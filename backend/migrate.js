const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const props = await db.collection('properties').find({}).toArray();
  
  for (const prop of props) {
    const newImages = [];
    for (const img of prop.images) {
      if (img.startsWith('/uploads/')) {
        const filename = img.replace('/uploads/', '');
        const filePath = path.join(__dirname, 'uploads', filename);
        try {
          const result = await cloudinary.uploader.upload(filePath);
          newImages.push(result.secure_url);
          console.log('Migré:', filename);
        } catch (e) {
          console.log('Erreur:', filename, e.message);
          newImages.push(img);
        }
      } else {
        newImages.push(img);
      }
    }
    await db.collection('properties').updateOne({_id: prop._id}, {$set: {images: newImages}});
  }
  console.log('Migration terminée!');
  process.exit();
});
