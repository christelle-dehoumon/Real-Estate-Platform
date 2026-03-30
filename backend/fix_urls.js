const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const props = await db.collection('properties').find({}).toArray();
  
  for (const prop of props) {
    const newImages = prop.images.map(img => {
      if (img.startsWith('/uploads/fasohabitat/')) {
        const id = img.replace('/uploads/', '');
        return `https://res.cloudinary.com/dturhg6oe/image/upload/${id}`;
      }
      return img;
    });
    await db.collection('properties').updateOne(
      {_id: prop._id}, 
      {$set: {images: newImages}}
    );
    console.log(prop.title, '->', newImages);
  }
  console.log('Correction terminée!');
  process.exit();
});
