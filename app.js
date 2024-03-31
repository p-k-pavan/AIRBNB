const express = require("express");
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const app = express();


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