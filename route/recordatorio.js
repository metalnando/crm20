const express =require("express");
const router = express.Router();
const pool=require('../db');

// Crear un recordatorio

router.post("/", async (req, res) => {
  try {
    const { id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado } =
      req.body;
    // Comprueba que se encuentre creado el vehiculo.
    const [vehiculo] = await pool.execute(
      "SELECT id_vehiculo FROM vehiculo WHERE id_vehiculo = ?",
      [id_vehiculo]
    );
    if (vehiculo.length === 0) {
      return res.status(404).json({ message: "Vehiculo no encontrado" });
    }
    const [result] = await pool.execute(
      "INSERT INTO recordatorio(id_vehiculo,tipo_recordatorio,fecha_vencimiento, estado) VALUES (?,?,?,?)",
      [id_vehiculo, tipo_recordatorio, fecha_vencimiento, estado]
    );

    res
      .status(201)
      .json({
        id: result.insertId,
        id_vehiculo,
        tipo_recordatorio,
        fecha_vencimiento,
        estado,
      });
  } catch (err) {
    res.status(500).send(err);
  }
});
// consultar recordatorio
router.get('/',async (req,res)=>{
    try{
        const [rows]= await pool.execute("SELECT * FROM recordatorio");
        res.json(rows);
    }
    catch(err){
        res.status(500).send(err);
    }
});

// consultar recordatorio por ID
router.get("/:id", async (req,res)=>{
    try{
        const {id}=req.params;
        const [rows] = await pool.execute("SELECT * FROM recordatorio WHERE id_recordatorio =?",[id]);
        if(rows.length >0){
             res.json(rows[0]);
        }else{
             res.status(404).json({message:"recordatorio no encontrado"})
        }
    }catch(err){
        res.status(500).send(err);
    }
});

//Actualizar el recordatorio
router.put("/:id", async (req,res)=>{
    try{
        const {id}= req.params;
        const {id_vehiculo, tipo_recordatorio,fecha_vencimiento,estado}=req.body;
        const [resul] = await pool.execute("UPDATE recordatorio SET id_vehiculo=?, tipo_recordatorio=?, fecha_vencimiento=?, estado=?",[id_vehiculo,tipo_recordatorio,fecha_vencimiento,estado]);

        if(resul.affectedRows >0){
            res.json({message:"recordatorio actualizado con exito"});
        }else{
            res.status(404).json({message:"recordatorio no encontrado"});
        }
        }catch(err){
            res.status(500).send(err);
        }
    
});

// Eliminar recordatorio

router.delete("/:id", async (req,res)=>{
    try{
        const {id}= req.params;
        const [resul]  =await pool.execute("DELETE FROM recordatorio WHERE id_recordatorio =?",[id]);

        if(resul.affectedRows >0 ){
            res.json({message:"recordatorio eliminado con exito"});
        }else{
            res.json({message:"Recordatorio no encontrado"});
        }
        }catch(err){
            res.status(500).send(err);
        }
    });

module.exports = router;
