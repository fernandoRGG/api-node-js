const express = require('express');
const apiRoutes = require('./routes/api');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: '*', // O especifica el dominio permitido
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api', apiRoutes);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

