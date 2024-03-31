const express = require("express");
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const app = express();

main().then(()=>{
    console.log("connected db")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wounderLust');

}

app.get("/testListing",async (req,res)=>{
    let newListing = new Listing({
        title:"villa",
        discription:"mud",
        price:500,
        country:"India",
        location:"South india"
    })
    await newListing.save();
    res.send("Sucess full")
})

const PORT = 3000;

app.listen(PORT,(req,res)=>{
    console.log("Server was listen in port ",PORT)
})