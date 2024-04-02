const express = require("express");
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")

const app = express();


main().then(()=>{
    console.log("connected db")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wounderLust');

}

// app.get("/testListing",async (req,res)=>{
//     let newListing = new Listing({
//         title:"villa",
//         discription:"mud",
//         price:500,
//         country:"India",
//         location:"South india"
//     })
//     await newListing.save();
//     res.send("Sucess full")
// })

app.set("view engine","ejs")
app.set("views" , path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))

app.get("/listings",async(req,res)=>{
    const allListing = await Listing.find({})
    res.render("listings/index.ejs",{allListing})
})

// new listings

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})


//show route

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    
        let data = await Listing.findById(id);
       
        res.render("listings/show.ejs", { data });
    
});

//create route 
 app.post("/listings",async(req,res)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
 })

const PORT = 3000;

app.listen(PORT,()=>{
    console.log("Server was listen in port ",PORT)
})