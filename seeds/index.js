const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelper')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/minas-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Database connected')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      owner: '62604234603724331d4224ce',
        geometry: {
           type: 'Point', 
           coordinates: [
             cities[random1000].longitude,
             cities[random1000].latitude,
           ] 
          },
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum inventore, impedit sequi quia doloremque soluta iste iure quisquam. Ducimus quod pariatur veritatis repellendus velit eaque vitae distinctio labore. Repellat, molestias?',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/djnc5xhv9/image/upload/v1650671835/MinasCamp/qy3s8ey4ijesuunbumo7.jpg',
          filename: 'MinasCamp/qy3s8ey4ijesuunbumo7',
        },
      ],
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
