const jwt = require('jsonwebtoken');
const secretKey = 'mi-clave-secreta';
exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Leer el token del header
    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        req.user = user; // Guardar información del usuario en el request
        next();
    });
};