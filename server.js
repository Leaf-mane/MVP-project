import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

app.use(express.json());
app.use(express.static("public"));

app.get('/employees', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM employees');
      const employees = result.rows;
      client.release();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch employees' });
    }
  });








// Listener
const start = () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is now running on port ${process.env.PORT}`);
    });
};

start();