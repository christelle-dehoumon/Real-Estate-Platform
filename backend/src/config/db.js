const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/real_estate_db';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connecté avec succès');
    } catch (error) {
        console.error('Échec de la connexion à MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
