import { initMongoConnection } from './db/initMongoConnection.js';
import { startServer } from './server.js';
import { initializeDefaultCategories } from './utils/dbInitializer.js';

const setupServer = async () => {
  await initMongoConnection();
  await initializeDefaultCategories();
  startServer();
};

void setupServer();
