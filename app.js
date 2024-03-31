const express = require("express");
const mongoose = require("mongoose")
const app = express();

main().then(()=>{
    console.log("connected db")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wounderLust');

}

const PORT = 3000;

app.listen(PORT,(req,res)=>{
    console.log("Server was listen in port ",PORT)
})