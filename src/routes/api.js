const express = require('express');
const { getDatabaseStatus } = require('../controllers/database.controller');
const router = express.Router();
const { testQuery, testQueryDos } = require('../controllers/dba.controller');
const { uploadPdf, getPdfById, DeletePdf, test } = require('../controllers/pdf.controller');
const { login } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { requestPasswordReset, resetPassword } = require('../controllers/authEmail.controller');
// Ruta login
router.post('/login', login);
// Ruta protegida
router.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'Acceso a ruta protegida exitoso',
    });
});
// Estado de la base de datos
router.get('/data', getDatabaseStatus);
// Operaciones sobre tablas
router.get('/lista', testQuery);
router.get('/pdf', testQueryDos);
// Operaciones con PDFs
router.post('/upload-pdf', uploadPdf);
router.get('/get-pdf/:id', getPdfById);
router.delete('/delete-pdf/:id', DeletePdf);
router.delete('/delete-producto/:id', test);
// Recuperación de contraseña
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;