export default () => ({
    mongoUri: process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/?authSource=admin&authMechanism=SCRAM-SHA-1',
  });
  