/**
 * Script de prueba para verificar la conexión a MySQL
 * Uso: node test-db.js
 */

import { config } from "./src/config/index.js";
import { getPool, initializeDatabase } from "./src/core/database.js";

console.log("🔍 Probando conexión a MySQL...\n");
console.log("📋 Configuración:");
console.log(`   HOST: ${config.mysqlHost}`);
console.log(`   PORT: ${config.mysqlPort}`);
console.log(`   USER: ${config.mysqlUser}`);
console.log(`   DATABASE: ${config.mysqlDatabase}\n`);

try {
  // Obtener el pool de conexiones
  const pool = await getPool();
  console.log("✅ Conexión al pool establecida\n");

  // Probar una consulta simple
  const connection = await pool.getConnection();
  const results = await connection.query("SELECT 1 as test");
  connection.release();

  console.log("✅ Consulta de prueba exitosa");
  console.log(`   Resultado: ${results[0][0].test}\n`);

  // Inicializar base de datos
  console.log("📦 Inicializando base de datos...\n");
  await initializeDatabase();

  console.log("✅ Base de datos inicializada correctamente\n");

  // Verificar tablas
  const conn = await pool.getConnection();
  const tables = await conn.query(
    `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
    [config.mysqlDatabase]
  );
  conn.release();

  console.log("📊 Tablas en la base de datos:");
  tables[0].forEach((table) => {
    console.log(`   ✓ ${table.TABLE_NAME}`);
  });

  console.log("\n✨ ¡Todo está configurado correctamente!");
  console.log("\n🚀 Ahora puedes ejecutar: npm run dev");

  process.exit(0);
} catch (error) {
  console.error("❌ Error de conexión:\n");
  console.error(error.message);
  console.error("\n💡 Posibles soluciones:");
  console.error("   1. Verifica que MySQL esté corriendo");
  console.error("   2. Verifica las credenciales en .env");
  console.error("   3. Verifica que la base de datos exista o que el usuario pueda crearla");
  console.error("   4. Verifica la conectividad de red (host, puerto)");
  process.exit(1);
}
