const mongoose = require("mongoose")
const data = require("./data.js");
const Listing = require("../models/listing.js")



main().then(()=>{
    console.log("connected db")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wounderLust');

}

const initDB = async ()=>{
     await Listing.deleteMany({})
     await Listing.insertMany(data.data)
     console.log("Data was initialized success")
}

initDB();