const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const cors = require("cors");

const app = express();

// const port = 5000;
const PORT = process.env.PORT || 5000;

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production"){
  app.use(express.static(path.resolve(__dirname, '../client/build')));
  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
} else {
  app.get("/", (req, res)=>{
    // console.log("jnds")
    res.send("API is running...");
    // res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    // res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  })
}

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});