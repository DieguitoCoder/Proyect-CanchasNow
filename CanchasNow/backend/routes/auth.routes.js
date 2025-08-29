import { Router } from "express";
import { pool } from "../db.js";
import bcrypt from "bcryptjs";

const router = Router();

// Registro de usuario
router.post("/register", async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    try {
        // Verificar si el usuario ya existe
        const [rows] = await pool.query("SELECT user_id FROM users WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: "El usuario ya existe" });
        }
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insertar usuario
        await pool.query(
            "INSERT INTO users (username, email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, hashedPassword, name, phone, 'user']
        );
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }
        // Aquí podrías generar un token JWT si lo necesitas
        res.status(200).json({ 
            message: "Login exitoso", 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                role: user.role,
                owner_id: user.owner_id
            } 
        });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});

export default router;
