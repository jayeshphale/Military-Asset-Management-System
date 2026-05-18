import pg from 'pg';
import dotenv from 'dotenv';
import { schema } from './schema.js';

dotenv.config();

const { Pool } = pg;

const initializeDatabase = async () => {
  let pool;
  try {
    console.log('Connecting to PostgreSQL...');
    
    // First connect to default database to create the target database
    const tempPool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: 'postgres', // Connect to default postgres database
    });

    // Create database if it doesn't exist
    await tempPool.query(`CREATE DATABASE ${process.env.DB_NAME} WITH OWNER = ${process.env.DB_USER}`);
    console.log(`Database "${process.env.DB_NAME}" created successfully`);
    await tempPool.end();

    // Now connect to the created database
    pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    });

    console.log('Creating database schema...');
    
    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    
    console.log('Database schema created successfully');
    process.exit(0);
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database already exists, proceeding with schema creation...');
      // Database exists, try to create schema
      pool = new Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
      });
      
      const statements = schema.split(';').filter(stmt => stmt.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await pool.query(statement);
        }
      }
      console.log('Database schema created successfully');
      process.exit(0);
    } else {
      console.error('Error creating database/schema:', error);
      process.exit(1);
    }
  } finally {
    if (pool) await pool.end();
  }
};

initializeDatabase();
