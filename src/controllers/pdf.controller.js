const mysql = require('mysql2/promise');
const multer = require('multer');
// Configuración de multer para manejar archivos
const upload = multer({ storage: multer.memoryStorage() }).single('pdfFile');
// Subir PDF
const uploadPdf = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('❌ Error al procesar archivo:', err.message);
            return res.status(500).json({ error: 'Error procesando archivo', details: err.message });
        }
        const { originalname, buffer } = req.file; // Nombre del archivo y su contenido
        try {
            const connection = await mysql.createConnection(require('../config/db.config'));
            const query = `
                INSERT INTO Archivos (nombreArchivo, contenidoArchivo)
                VALUES (?, ?)
            `;
            await connection.execute(query, [originalname, buffer]);
            console.log('✅ Archivo subido con éxito');
            res.status(200).json({ message: 'Archivo subido con éxito' });
            await connection.end();
        } catch (error) {
            console.error('❌ Error ejecutando consulta:', error.message);
            res.status(500).json({ error: 'Error ejecutando consulta', details: error.message });
        }
    });
};
// Obtener PDF por ID
const getPdfById = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(require('../config/db.config'));
        const query = `SELECT nombreArchivo, contenidoArchivo FROM Archivos WHERE id = ?`;
        const [rows] = await connection.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        const { nombreArchivo, contenidoArchivo } = rows[0];
        const extension = nombreArchivo.split('.').pop().toLowerCase();

        let contentType;

        // Determina el Content-Type basado en la extensión del archivo
        switch (extension) {
            case 'pdf':
                contentType = 'application/pdf';
                break;
                case 'docx':
                    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    break;
            default:
                contentType = 'application/octet-stream'; // Tipo genérico
                break;
        }

        // Convertir contenido a Buffer si no lo es
        const fileBuffer = Buffer.isBuffer(contenidoArchivo)
            ? contenidoArchivo
            : Buffer.from(contenidoArchivo);

        // Establecer los encabezados correctamente
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"; filename*=UTF-8''${encodeURIComponent(nombreArchivo)}`);
        res.send(fileBuffer);

        await connection.end();
    } catch (error) {
        console.error('❌ Error ejecutando consulta:', error.message);
        res.status(500).json({ error: 'Error ejecutando consulta', details: error.message });
    }
};







// Eliminar PDF por ID
const DeletePdf = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(require('../config/db.config'));
        const query = `DELETE FROM Archivos WHERE id = ?`;
        const [result] = await connection.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }
        console.log('✅ Archivo eliminado con éxito');
        res.status(200).json({ message: 'Archivo eliminado con éxito' });
        await connection.end();
    } catch (error) {
        console.error('❌ Error ejecutando consulta:', error.message);
        res.status(500).json({ error: 'Error ejecutando consulta', details: error.message });
    }
};
// Eliminar Producto
const test = async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(require('../config/db.config'));
        const query = `DELETE FROM Sellers WHERE id = ?`;
        const [result] = await connection.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        console.log('✅ Producto eliminado con éxito');
        res.status(200).json({ message: 'Producto eliminado con éxito' });
        await connection.end();
    } catch (error) {
        console.error('❌ Error ejecutando consulta:', error.message);
        res.status(500).json({ error: 'Error ejecutando consulta', details: error.message });
    }
};
module.exports = { uploadPdf, getPdfById, DeletePdf, test };