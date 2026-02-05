const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const farmerRoutes = require('./routes/farmerRoutes');
const cropRoutes = require('./routes/cropRoutes');
const profitRoutes = require('./routes/profitRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/farmers', farmerRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/profit', profitRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});