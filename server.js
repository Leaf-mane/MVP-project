import express from "express";
import postgres from "postgres";
import dotenv from "dotenv";


/////////////////////////////////////////////////////
dotenv.config();
const app = express();
const sql = postgres(process.env.DATABASE_URL);

app.use(express.json());
app.use(express.static("public"));
//////////////////////////////////////////////////////
app.get('/employees', async (req, res) => {
    try {
      const employees = await sql`SELECT * FROM employees`;
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch employees' });
    }
  });








// Listener
const start = () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is now running on port ${port}`);
    });
};

start();