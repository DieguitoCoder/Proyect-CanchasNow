import { Router } from "express";
import { pool } from "../db.js";
const router = Router();

// Obtener todos los owners
router.get("/", async (req, res) => {
    try {
        const [owners] = await pool.query("SELECT * FROM owners");
        res.json(owners);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener owners", error });
    }
});

// Obtener owner por ID
router.get("/:owner_id", async (req, res) => {
    const { owner_id } = req.params;
    try {
        const [owners] = await pool.query("SELECT * FROM owners WHERE owner_id = ?", [owner_id]);
        if (owners.length === 0) return res.status(404).json({ message: "Owner no encontrado" });
        res.json(owners[0]);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener owner", error });
    }
});

// Crear owner
router.post("/", async (req, res) => {
    const { owner_id, user_id, business_name, address } = req.body;
    if (!user_id) return res.status(400).json({ message: "user_id es requerido" });
    try {
        await pool.query(
            "INSERT INTO owners (owner_id, user_id, business_name, address) VALUES (?, ?, ?, ?)",
            [owner_id || user_id, user_id, business_name, address]
        );
        res.status(201).json({ message: "Owner creado" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear owner", error });
    }
});

// Actualizar owner
router.put("/:owner_id", async (req, res) => {
    const { owner_id } = req.params;
    const { business_name, address } = req.body;
    try {
        await pool.query(
            "UPDATE owners SET business_name=?, address=? WHERE owner_id=?",
            [business_name, address, owner_id]
        );
        res.json({ message: "Owner actualizado" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar owner", error });
    }
});

// Eliminar owner
router.delete("/:owner_id", async (req, res) => {
    const { owner_id } = req.params;
    try {
        await pool.query("DELETE FROM owners WHERE owner_id = ?", [owner_id]);
        res.json({ message: "Owner eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar owner", error });
    }
});

export default router;
