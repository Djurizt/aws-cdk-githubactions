import express from "express";
import { Pool } from "pg";

const app = express();
const port = process.env.PORT || 8080;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get("/", async (_, res) => {
  const { rows } = await pool.query("SELECT NOW() as now");
  res.json({ message: "Hello World!", time: rows[0].now });
});

app.listen(port, () => console.log(`api listening on ${port}`));