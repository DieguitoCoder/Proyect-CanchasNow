import { Router } from "express";
import { pool } from "../db.js";
const router = Router();

// Actualizar datos personales del usuario
router.put('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { name, email, phone } = req.body;
    try {
        await pool.query(
            'UPDATE users SET username=?, email=?, phone=? WHERE user_id=?',
            [name, email, phone, user_id]
        );
        res.json({ message: 'Usuario actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
});

export default router;
