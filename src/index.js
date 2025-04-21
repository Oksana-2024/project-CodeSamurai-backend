import { initMongoConnection } from './db/initMongoConnection.js';
import { startServer } from './server.js';

const setupServer = async () => {
  await initMongoConnection();
  startServer();
};

void setupServer();
