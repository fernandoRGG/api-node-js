const mysql = require('mysql2/promise'); // Uso de mysql2 con promesas
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbConfig = require('../config/db.config');
const secretKey = 'mi-clave-secreta';
// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Crear conexión a la base de datos
        const connection = await mysql.createConnection(dbConfig);
        // Consultar al usuario por su email
        const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);
        const user = rows[0]; // Obtener el primer registro
        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Comparar contraseñas (la contraseña en la BD debe estar hasheada con bcrypt)
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        // Generar un token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
        // Responder con el token
        res.json({ token, userId: user.nombre });
        // Cerrar conexión
        await connection.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};