import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import authRoutes from "./routes/auth.routes.js"; // Importing authRoutes for authentication
import usersRoutes from "./routes/users.routes.js";
import fieldsRoutes from "./routes/fields.routes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import field_typesRoutes from "./routes/field_types.routes.js";
import ownersRoutes from "./routes/owners.routes.js";
import schedulesRoutes from "./routes/schedules.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
    cors({
        origin: '*', // Permitir cualquier origen para desarrollo
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: false,
    })
);
// Servir archivos estáticos para assets y js en desarrollo
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/assets', express.static(path.join(__dirname, '../frontend/src/assets')));
app.use('/js', express.static(path.join(__dirname, '../frontend/src/js')));

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Adding authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/fields", fieldsRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/field_types", field_typesRoutes);
app.use("/api/owners", ownersRoutes);
app.use("/api/schedules", schedulesRoutes);
app.use("/api/sales", salesRoutes);

const PORT = process.env.PORT || 3000;

async function ensureDB() {
    try {
    const [rows] = await pool.query("SELECT user_id FROM users WHERE email=?", [
        "admin@cancha.com",
    ]);
    if (!rows.length) {
        const hash = await bcrypt.hash("admin123", 10);
        await pool.query(
        "INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)",
        ["Admin", "admin@cancha.com", hash, "admin"]
        );
    console.log("✔ Admin created: admin@cancha.com / admin123");
    }
    } catch (e) {
    console.error("Error en ensureDB", e.message);
    }
}

app.listen(PORT, async () => {
    try {
        await pool.getConnection();
        console.log(`API lista en http://localhost:${PORT}`);
        await ensureDB();
    } catch (e) {
    console.error("Error conectando a MySQL:", e.message);
    }
});
