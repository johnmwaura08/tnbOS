import {useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Formik, FormikHelpers} from 'formik';

import {setMessageBlock} from 'apps/Chat/blocks';
import {ButtonType} from 'apps/Chat/components/Button';
import NetworkSelector from 'apps/Chat/containers/Right/NetworkSelector';
import {useActiveNetwork, useActiveNetworkBalance} from 'apps/Chat/hooks';
import {getActiveChat} from 'apps/Chat/selectors/state';
import {setContact} from 'apps/Chat/store/contacts';
import {setDelivery} from 'apps/Chat/store/deliveries';
import {setMessage} from 'apps/Chat/store/messages';
import {DeliveryStatus, Transfer} from 'apps/Chat/types';
import {useRecipientsDefaultNetworkId} from 'system/hooks';
import {getSelf} from 'system/selectors/state';
import {AppDispatch, SFC} from 'system/types';
import {currentSystemDate} from 'system/utils/dates';
import yup from 'system/utils/forms/yup';
import {displayErrorToast} from 'system/utils/toast';
import * as S from './Styles';

const MessageForm: SFC = ({className}) => {
  const activeChat = useSelector(getActiveChat);
  const activeNetwork = useActiveNetwork();
  const activeNetworkBalance = useActiveNetworkBalance();
  const dispatch = useDispatch<AppDispatch>();
  const recipientsDefaultNetworkId = useRecipientsDefaultNetworkId(activeChat!);
  const self = useSelector(getSelf);

  const initialValues = {
    amount: '',
    content: '',
  };

  type FormValues = typeof initialValues;

  const getTransfer = (amount: number): Transfer | null => {
    if (!activeNetwork || amount === 0) return null;
    return {
      amount: amount,
      networkId: activeNetwork.networkId,
    };
  };

  const handleSubmit = async (values: FormValues, {resetForm}: FormikHelpers<FormValues>): Promise<void> => {
    try {
      const amount = values.amount ? parseInt(values.amount, 10) : 0;
      const content = values.content;
      const messageId = crypto.randomUUID();
      const networkId = activeNetwork?.networkId || recipientsDefaultNetworkId;
      const now = currentSystemDate();
      const recipient = activeChat!;
      const transfer = getTransfer(amount);

      const message = {
        content,
        createdDate: now,
        messageId,
        modifiedDate: now,
        recipient,
        sender: self.accountNumber,
        transfer,
      };

      if (networkId) {
        await setMessageBlock({
          amount,
          networkId,
          params: message,
          recipient,
        });
      }

      dispatch(setMessage(message));

      dispatch(
        setContact({
          accountNumber: recipient,
          lastActivityDate: now,
          lastMessageId: messageId,
        }),
      );

      dispatch(
        setDelivery({
          delivery: {
            attempts: 1,
            status: DeliveryStatus.pending,
          },
          messageId,
        }),
      );

      resetForm();
    } catch (error) {
      console.error(error);
      displayErrorToast('Error sending the message');
    }
  };

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      amount: yup.number().test('amount-does-not-exceed-balance', 'Invalid amount', (amount) => {
        return amount ? activeNetworkBalance >= amount : true;
      }),
      content: yup.string(),
    });
  }, [activeNetworkBalance]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnMount={false}
      validationSchema={validationSchema}
    >
      {({dirty, errors, isSubmitting, isValid, touched}) => (
        <S.Form className={className}>
          <S.ContentInput errors={errors} name="content" placeholder="New Message" touched={touched} />
          {activeNetwork ? (
            <S.AmountInput
              errors={errors}
              name="amount"
              placeholder={activeNetwork.displayName || ''}
              touched={touched}
            />
          ) : null}
          <NetworkSelector />
          <S.Button
            dirty={dirty}
            disabled={isSubmitting}
            isSubmitting={isSubmitting}
            isValid={isValid}
            text=""
            type={ButtonType.submit}
          />
        </S.Form>
      )}
    </Formik>
  );
};

export default MessageForm;
