const data = require('./data.js')
const listing = require('../models/listing.js')
const mongoose = require('mongoose')
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
main()
    .then(res => console.log('Connection Successfull...')).catch(err => console.log(err))
async function main() {
    await mongoose.connect(process.env.MONGO_URL)
}

const init = async () => {
    await listing.deleteMany({})
    const updateData = data.map((obj) => ({ ...obj, owner: '6a0db0191bf17ba357a12ed4' }))
    await listing.insertMany(updateData);
    console.log('Data Inserted Successfully!')
}
init();