require('dotenv/config');

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// migrate-mongo wants the database name split out from the connection
// string rather than embedded in it.
const url = new URL(DATABASE_URL);
const databaseName = url.pathname.replace(/^\//, '');
url.pathname = '/';

module.exports = {
  mongodb: {
    url: url.toString(),
    databaseName,
    options: {},
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};
