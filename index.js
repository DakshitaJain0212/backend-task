require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const tradeRoutes = require('./routes/tradeRoutes');
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/trades', tradeRoutes);
app.use('/', (req,res) => {
    res.send("hello!");
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongoDB connected!")
  }).catch((err) =>{
    console.log("failed to connect", err);
  })


app.listen(process.env.PORT , () => {
    console.log(`server is connected on ${process.env.PORT}`);
})