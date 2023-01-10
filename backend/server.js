const { readdirSync } = require("fs");
const path = require("path");
const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const cors = require('cors');



// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet())


// routes middleware
readdirSync("./src/routes").map(r => app.use("/api/v1", require(`./src/routes/${r}`)))


// server
const port = process.env.PORT || 8000;

// Database connect
mongoose
    .connect(process.env.DATABASE)
    .then(()=>{
        console.log('DB Connected');
        app.listen(port, ()=>{
            console.log(`Server run success on port ${port}`)
        })
    })
    .catch(error => console.log(error))