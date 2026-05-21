import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST ,
  user: process.env.MYSQL_USER ,
  password: process.env.MYSQL_PASSWORD ,
  database: process.env.MYSQL_DATABASE ,
});

// Fungsi untuk mengetes koneksi
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Berhasil terhubung ke database MySQL!");
    connection.release(); // Lepaskan koneksi kembali ke pool
    return true;
  } catch (error) {
    console.error("❌ Gagal terhubung ke database:", error.message);
    return false;
  }
}

export default pool;
