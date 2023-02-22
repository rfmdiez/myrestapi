import { pool } from "../db.js";

const ping  = async (req,res)=> {
    const [result] = await pool.query('SELECT * FROM employee')
    res.json(result)
}

export { ping }