import mysql from "mysql2/promise"

// Database configuration
const dbConfig = {
  host: "db5017977807.hosting-data.io",
  port: 3306,
  user: "dbu3130980",
  password: "photodb123##$$__",
  database: "photodb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
}

// Create connection pool
let pool: mysql.Pool | null = null

export const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

// Helper function to execute queries
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const pool = getPool()
    const [results] = await pool.execute(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error(`Database query failed: ${error.message}`)
  }
}

// Helper function to get a single row
export const queryRow = async (query: string, params: any[] = []) => {
  const results = (await executeQuery(query, params)) as any[]
  return results[0] || null
}

// Helper function to get multiple rows
export const queryRows = async (query: string, params: any[] = []) => {
  return (await executeQuery(query, params)) as any[]
}

// Test database connection
export const testConnection = async () => {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Close all connections
export const closePool = async () => {
  if (pool) {
    await pool.end()
    pool = null
  }
}
