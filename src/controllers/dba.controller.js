const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');
// Consulta 1
const testQuery = async (req, res) => {
    console.log('📩 Probando consulta a la base de datos');
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conexión establecida con éxito');
        // Ejecutar la consulta
        const [rows] = await connection.execute('SELECT * FROM Sellers');
        console.log(`✅ Consulta ejecutada. Filas obtenidas: ${rows.length}`);
        res.json({ message: 'Consulta ejecutada correctamente', results: rows });
        // Cerrar conexión
        await connection.end();
    } catch (err) {
        console.error('❌ Error al ejecutar la consulta:', err.message);
        res.status(500).json({ error: 'Error ejecutando consulta', details: err.message });
    }
};
// Consulta 2
const testQueryDos = async (req, res) => {
    console.log('📩 Probando consulta a la base de datos');
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conexión establecida con éxito');
        // Ejecutar la consulta
        const [rows] = await connection.execute(
            'SELECT id, nombreArchivo, fechaHoraInsercion FROM Archivos'
        );
        console.log(`✅ Consulta ejecutada. Filas obtenidas: ${rows.length}`);
        res.json({ message: 'Consulta ejecutada correctamente', results: rows });
        // Cerrar conexión
        await connection.end();
    } catch (err) {
        console.error('❌ Error al ejecutar la consulta:', err.message);
        res.status(500).json({ error: 'Error ejecutando consulta', details: err.message });
    }
};
module.exports = { testQuery, testQueryDos };