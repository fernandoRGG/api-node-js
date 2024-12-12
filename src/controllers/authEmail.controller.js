const mysql = require('mysql2/promise'); // Uso de mysql2 con promesas
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbConfig = require('../config/db.config');
const secretKey = 'mi-clave-secreta';
// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'fernando.garcia131103@gmail.com',
        pass: 'bbikhebybkqllhnr', // Usa una contraseña de aplicación segura
    },
});
// Endpoint para solicitar recuperación de contraseña
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        // Consultar usuario por email
        const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);
        const user = rows[0]; // Obtener el primer registro
        if (!user) {
            await connection.end();
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Generar un token temporal (válido por 1 hora)
        const resetToken = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
        // Crear el enlace de recuperación
        const resetLink = `http://zerver.angel.lat/angular-app/accounts/reset-password/reset-password-1?token=${resetToken}`;
        // Enviar correo
        await transporter.sendMail({
            from: 'fernando.garcia131103@gmail.com',
            to: email,
            subject: 'Recuperación de Contraseña',
            html: `
            <p>Hola,</p>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Este enlace es válido por 1 hora.</p>`,
        });
        await connection.end();
        res.json({ message: 'Correo enviado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
// Endpoint para restablecer contraseña
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, secretKey); // Verificar el token
        const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hashear la nueva contraseña
        const connection = await mysql.createConnection(dbConfig);
        // Actualizar la contraseña en la base de datos
        await connection.execute(
            'UPDATE Usuarios SET password = ? WHERE id = ?',
            [hashedPassword, decoded.id]
        );
        await connection.end();
        res.json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};
