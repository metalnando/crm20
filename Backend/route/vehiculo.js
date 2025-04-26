const express = require("express");
const router= express.Router();
const pool= require("../db");

//Crear vehiculo

router.post("/", async (req,res)=>{
    try{
        
        const {id_cliente,placa,marca,modelo}= req.body;

        // Verificar si el id_cliente existe en la tabla cliente
        const [cliente] = await pool.execute(
            "SELECT id_cliente FROM cliente WHERE id_cliente = ?",
            [id_cliente]
        );

        if (cliente.length === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        // Verificar si el id_vehiculo existe en la tabla vehiculo

        const[restul] = await pool.execute(
            "INSERT INTO vehiculo (id_cliente,placa,marca,modelo)VALUES ( ?, ?, ?, ?)",
            [id_cliente,placa,marca,modelo]
        );
        res.status(201).json({id:restul.insertId,id_cliente,placa,marca,modelo});
        }catch(err){
            res.status(500).send(err);
        }
});

// Consultar todos los vehiculos

router.get("/", async (req,res)=>{
    try{
        const [rows] = await pool.execute("SELECT * FROM vehiculo");
        res.json(rows);
    }catch(err){
        res.status(500).send(err);
    }
});

// Consultar un vehiculo por id

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT * FROM vehiculo WHERE id_vehiculo = ?",
      [id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Vehiculo no encontrado" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//Actualizar vehiculo
router.put("/:id", async (req,res)=>{
    try{
        const {id} =req.params;
        const {id_cliente,placa,marca,modelo}= req.body;
        const [result]= await pool.execute("UPDATE vehiculo SET id_cliente=?,placa=?,marca=?,modelo=? WHERE id_vehiculo =?",[id_cliente,placa,marca,modelo,id]);  
    
    if(result.affectedRows > 0)
    {
        res.json({message:"Vehiculo Actualiziado OK"});
    }else{
        res.status(400).json({message:"Vehiculo no enconrado"})
    }
    }catch(err)
    {
        res.status(500).send(err);
    }
});

// Eliminar vehiculo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [ result ] = await pool.execute(
      'DELETE FROM vehiculo WHERE id_vehiculo = ?',
      [id]
    );
    if(result.affectedRows > 0){
        res.json({message: "Vehiculo Eliminado correctamente"});
    }else{
        res.status(404).json({ message: "Vehiculo no encontrado" });
    }
}catch(err){
    res.status(500).send(err);
}
});


module.exports = router;
