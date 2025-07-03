const knex = require('knex');

const dbConfig = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'health_ai_agent'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },
  test: {
    client: 'postgresql',
    connection: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: process.env.TEST_DB_PORT || 5432,
      user: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'password',
      database: process.env.TEST_DB_NAME || 'health_ai_agent_test'
    },
    pool: {
      min: 1,
      max: 5
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};

const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment];

const db = knex(config);

async function initializeDatabase() {
  try {
    // Test the connection
    await db.raw('SELECT 1');
    console.log('Database connection established');
    
    // Run migrations
    await db.migrate.latest();
    console.log('Database migrations completed');
    
    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

async function closeDatabase() {
  try {
    await db.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

module.exports = {
  db,
  initializeDatabase,
  closeDatabase
}; 