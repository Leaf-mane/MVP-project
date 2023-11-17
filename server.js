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
console.log(process.env.DATABASE_URL)

// create
app.post('/employees', async (req, res) => {
    const { emp_name, dep_id, skill_one, skill_two, skill_three } = req.body;
    try {
      const client = await pool.connect();
      const query = 'INSERT INTO employees (emp_name, dep_id, skill_one, skill_two, skill_three) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [emp_name, dep_id, skill_one, skill_two, skill_three];
      const result = await client.query(query, values);
      client.release();
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create employee' });
    }
  });

// get all employees
app.get('/employees', async (req, res) => {
    try {
      const client = await pool.connect();
      const result =  await client.query('SELECT * FROM employees');
      const employees = result.rows;
      client.release();
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch employees' });
    }
  });
// get all departments
  app.get('/departments', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM departments');
      const departments = result.rows;
      client.release();
      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch departments' });
    }
  });
// delete 1
  app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params; 
    try {
      const client = await pool.connect();
      await client.query('DELETE FROM employees WHERE emp_id = $1', [id]);
      client.release();
      res.status(200).json({ message: `Employee with ID ${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete employee' });
    }
  });
// update 
app.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { emp_name, dep_id, skill_one, skill_two, skill_three } = req.body;
    try {
        const client = await pool.connect();
        const query = 'UPDATE employees SET emp_name = $1, dep_id = $2, skill_one = $3, skill_two = $4, skill_three = $5 WHERE emp_id = $6 RETURNING *';
        const values = [emp_name, dep_id, skill_one, skill_two, skill_three, id];
        const result = await client.query(query, values);
        client.release();
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Unable to update employee' });
    }
});

app.get('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM employees WHERE emp_id = $1', [id]);
      client.release();

      if (result.rows.length > 0) {
          res.status(200).json(result.rows[0]); 
      } else {
          res.status(404).json({ error: 'Employee not found' }); 
      }
  } catch (error) {
      res.status(500).json({ error: 'Unable to fetch employee' });
  }
});



// Listener
const start = () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is now running on port ${process.env.PORT}`);
    });
};

start();