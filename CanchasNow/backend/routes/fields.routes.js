import { Router } from "express";
import { pool } from "../db.js";
const router = Router();

// Obtener todas las canchas de un owner
router.get("/owner/:owner_id", async (req, res) => {
    const { owner_id } = req.params;
    try {
        const [fields] = await pool.query("SELECT * FROM fields WHERE owner_id = ?", [owner_id]);
        res.json(fields);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener canchas", error });
    }
});

// Crear una cancha
router.post("/", async (req, res) => {
    const { owner_id, type_id, name, description, address, price_per_hour, image_url } = req.body;
    if (!owner_id || !type_id || !name || !address || !price_per_hour) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    try {
        const [result] = await pool.query(
            "INSERT INTO fields (owner_id, type_id, name, description, address, price_per_hour, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [owner_id, type_id, name, description, address, price_per_hour, image_url]
        );
        res.status(201).json({ field_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Error al crear cancha", error });
    }
});

// Actualizar una cancha
router.put("/:field_id", async (req, res) => {
    const { field_id } = req.params;
    const { name, description, address, price_per_hour, image_url, type_id } = req.body;
    try {
        await pool.query(
            "UPDATE fields SET name=?, description=?, address=?, price_per_hour=?, image_url=?, type_id=? WHERE field_id=?",
            [name, description, address, price_per_hour, image_url, type_id, field_id]
        );
        res.json({ message: "Cancha actualizada" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar cancha", error });
    }
});

// Eliminar una cancha
router.delete("/:field_id", async (req, res) => {
    const { field_id } = req.params;
    try {
        await pool.query("DELETE FROM fields WHERE field_id = ?", [field_id]);
        res.json({ message: "Cancha eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar cancha", error });
    }
});

export default router;
