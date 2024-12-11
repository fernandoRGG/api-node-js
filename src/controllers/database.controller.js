const mysql = require('mysql2/promise'); // Uso de la librería mysql2 con promesas
const dbConfig = require('../config/db.config');
const getDatabaseStatus = async (req, res) => {
    try {
        // Crear una conexión a la base de datos
        const connection = await mysql.createConnection(dbConfig);
        // Si la conexión es exitosa
        console.log('Connected to database');
        res.send('Connected to database!');
        // Cerrar la conexión
        await connection.end();
    } catch (error) {
        console.log('Connection Failed:', error);
        res.status(500).send('Database connection error');
    }
};
module.exports = { getDatabaseStatus };