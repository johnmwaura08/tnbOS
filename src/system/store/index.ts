import {combineReducers, configureStore} from '@reduxjs/toolkit';

import {appReducers} from 'apps/registry';
import accountOnlineStatusesReducer from 'system/store/accountOnlineStatuses';
import accountsReducer from 'system/store/accounts';
import balancesReducer from 'system/store/balances';
import internalReducer from 'system/store/internal';
import managerReducer from 'system/store/manager';
import networkAccountOnlineStatusesReducer from 'system/store/networkAccountOnlineStatuses';
import networkCorrelationIdsReducer from 'system/store/networkCorrelationIds';
import networksReducer from 'system/store/networks';
import peerRequestManagerReducer from 'system/store/peerRequestManager';
import selfReducer from 'system/store/self';
import socketStatusesReducer from 'system/store/socketStatuses';

const systemReducer = combineReducers({
  accountOnlineStatuses: accountOnlineStatusesReducer,
  accounts: accountsReducer,
  balances: balancesReducer,
  internal: internalReducer,
  manager: managerReducer,
  networkAccountOnlineStatuses: networkAccountOnlineStatusesReducer,
  networkCorrelationIds: networkCorrelationIdsReducer,
  networks: networksReducer,
  peerRequestManager: peerRequestManagerReducer,
  self: selfReducer,
  socketStatuses: socketStatusesReducer,
});

const store = configureStore({
  reducer: {
    ...appReducers,
    system: systemReducer,
  },
});

export default store;
