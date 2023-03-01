import { pool } from "../db.js";
import { client } from "../index.js";

const ping  = async (req,res)=> {
    const [result] = await pool.query('SELECT * FROM employee')
    res.json(result)
}

const getEmployees = async (req,res)=> {
    try {
        const [rows] = await pool.query('SELECT * FROM employee')
        res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong',
            error: error
        })
    }
}

const getEmployee = async (req,res)=> {
    
    try {
        const employeeFromCache = await client.get(`employee${req.params.id}`)
        if(employeeFromCache){
            return res.send(JSON.parse(employeeFromCache))
        }
        const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [req.params.id])
        if(rows.length<=0) return res.status(404).json({message : 'Employee not found'})
        await client.set(`employee${req.params.id}`,JSON.stringify(rows[0]))
        res.json(rows[0])
        
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'+error
        })
        
    }
    
}

const createEmployee = async (req,res)=> {
    try {
        const {name, salary} = req.body
        //Entre corchetes para que solo recibas las filas de la consulta
        const [rows] = await pool.query('INSERT INTO employee (name,salary) values (?,?)', [name,salary])
        //console.log(req.body);
        //Para que me devuelva un JSON
        res.send({
            id: rows.insertId,
            name,
            salary
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

const deleteEmployee = async (req,res)=> {
    try {
        const [result] = await pool.query('DELETE FROM employee WHERE id = ?', [req.params.id])
        if(result.affectedRows <= 0) return res.status(404).json({ message : 'Employee not found' })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}

const updateEmployee = async (req,res)=> {
    try {
        const {id } = req.params
        const { name,salary } = req.body
        const [result] = await pool.query('UPDATE employee SET name = IFNULL(?,name) , salary = IFNULL(?,salary) WHERE id = ?', [name, salary, id])
        if(result.affectedRows <= 0) return res.status(404).json({ message : 'Employee not found' })
        const [rows] = await pool.query('SELECT * FROM Employee WHERE id = ?', [req.params.id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        })
    }
}



export {getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee}