import expressLoader from './express';
import Logger from './logger';

export default async ({ expressApp }) => {
  // Logger.info('🔥🔥 DB loaded and connected! 🔥🔥');

  expressLoader({ app: expressApp });
  Logger.info('🔥🔥 Express loaded 🔥🔥');
};
