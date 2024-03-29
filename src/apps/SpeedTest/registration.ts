import AppIcon from 'apps/SpeedTest/assets/app-icon.png';
import SpeedTest from 'apps/SpeedTest/containers';
import appRouter from 'apps/SpeedTest/routers/appRouter';
import speedTestReducer from 'apps/SpeedTest/store';
import loadSpeedTestStoreData from 'apps/SpeedTest/store/initializer';
import {SpeedTestElectronStore} from 'apps/SpeedTest/types';
import {AppIconType, AppRegistration} from 'system/types';

const SpeedTestRegistration: AppRegistration = {
  appId: 'speedTest',
  icon: AppIcon,
  iconType: AppIconType.image,
  initializer: loadSpeedTestStoreData,
  isSystemApp: false,
  reducer: speedTestReducer,
  router: appRouter,
};

export {SpeedTest, SpeedTestElectronStore, SpeedTestRegistration};
