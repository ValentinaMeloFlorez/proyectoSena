/**
 * Configuración y conexión a MySQL
 */

import mysql from "mysql2/promise";
import { config } from "../config/index.js";

let pool = null;

/**
 * Obtiene el pool de conexiones a MySQL
 */
export async function getPool() {
  if (pool) return pool;

  pool = await mysql.createPool({
    host: config.mysqlHost,
    port: config.mysqlPort,
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database: config.mysqlDatabase,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("✓ Conexión a MySQL establecida");
  return pool;
}

/**
 * Obtiene una conexión del pool
 */
export async function getConnection() {
  const pool = await getPool();
  return pool.getConnection();
}

/**
 * Cierra el pool de conexiones
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("✓ Pool de conexiones cerrado");
  }
}

/**
 * Ejecuta una consulta SQL
 */
export async function query(sql, values = []) {
  const connection = await getConnection();
  try {
    const [results] = await connection.query(sql, values);
    return results;
  } finally {
    connection.release();
  }
}

/**
 * Inicia la base de datos — crea tablas si no existen
 */
export async function initializeDatabase() {
  const tables = [
    // Tabla de roles
    `CREATE TABLE IF NOT EXISTS roles (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      permissions JSON,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (name)
    )`,

    // Tabla de usuarios
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      passwordHash VARCHAR(255) NOT NULL,
      firstName VARCHAR(100),
      lastName VARCHAR(100),
      document VARCHAR(50),
      role VARCHAR(100),
      roleId VARCHAR(36),
      companyId VARCHAR(36),
      isActive BOOLEAN DEFAULT true,
      lastLoginAt TIMESTAMP NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (email),
      INDEX (roleId),
      FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE SET NULL
    )`,

    // Tabla de tokens en lista negra
    `CREATE TABLE IF NOT EXISTS token_blacklist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      token VARCHAR(1000) NOT NULL,
      expiresAt TIMESTAMP,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabla de productos
    `CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2),
      cost DECIMAL(10, 2),
      sku VARCHAR(100) UNIQUE,
      category VARCHAR(100),
      quantity INT DEFAULT 0,
      unit VARCHAR(50),
      isActive BOOLEAN DEFAULT true,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (sku),
      INDEX (name)
    )`,

    // Tabla de clientes
    `CREATE TABLE IF NOT EXISTS clients (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      address VARCHAR(255),
      city VARCHAR(100),
      state VARCHAR(100),
      zipCode VARCHAR(20),
      country VARCHAR(100),
      document VARCHAR(50),
      companyName VARCHAR(255),
      isActive BOOLEAN DEFAULT true,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (email),
      INDEX (document)
    )`,

    // Tabla de movimientos de inventario
    `CREATE TABLE IF NOT EXISTS inventory_movements (
      id VARCHAR(36) PRIMARY KEY,
      productId VARCHAR(36) NOT NULL,
      type VARCHAR(20),
      quantity INT,
      reason VARCHAR(255),
      reference VARCHAR(100),
      createdBy VARCHAR(36),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX (productId),
      INDEX (createdAt),
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    )`,

    // Tabla de facturas
    `CREATE TABLE IF NOT EXISTS invoices (
      id VARCHAR(36) PRIMARY KEY,
      number VARCHAR(50) UNIQUE NOT NULL,
      clientId VARCHAR(36),
      date DATE,
      dueDate DATE,
      items JSON,
      subtotal DECIMAL(12, 2),
      tax DECIMAL(12, 2),
      total DECIMAL(12, 2),
      status VARCHAR(50),
      notes TEXT,
      createdBy VARCHAR(36),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (number),
      INDEX (clientId),
      INDEX (status),
      FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL
    )`,

    // Tabla de ingresos
    `CREATE TABLE IF NOT EXISTS incomes (
      id VARCHAR(36) PRIMARY KEY,
      description VARCHAR(255),
      amount DECIMAL(12, 2),
      date DATE,
      category VARCHAR(100),
      source VARCHAR(100),
      reference VARCHAR(100),
      notes TEXT,
      createdBy VARCHAR(36),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (date),
      INDEX (category)
    )`,

    // Tabla de gastos
    `CREATE TABLE IF NOT EXISTS expenses (
      id VARCHAR(36) PRIMARY KEY,
      description VARCHAR(255),
      amount DECIMAL(12, 2),
      date DATE,
      category VARCHAR(100),
      vendor VARCHAR(100),
      reference VARCHAR(100),
      notes TEXT,
      createdBy VARCHAR(36),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX (date),
      INDEX (category)
    )`,
  ];

  for (const createTableSQL of tables) {
    try {
      await query(createTableSQL);
    } catch (error) {
      console.error("Error creating table:", error.message);
    }
  }

  console.log("✓ Base de datos inicializada");
}
