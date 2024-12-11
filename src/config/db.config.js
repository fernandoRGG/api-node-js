require('dotenv').config();

module.exports = {
    host: process.env.DB_HOST, // Dirección del servidor desde .env
    user: process.env.DB_USER, // Usuario desde .env
    password: process.env.DB_PASSWORD, // Contraseña desde .env
    database: process.env.DB_NAME, // Base de datos desde .env
    port: process.env.DB_PORT || 3306, // Puerto estándar con fallback
    connectTimeout: process.env.DB_CONNECT_TIMEOUT || 30000, // Tiempo de espera (30s)
    ssl: process.env.DB_SSL === 'true', // Cambiar a true si necesitas SSL
};
