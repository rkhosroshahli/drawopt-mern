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

const root = require('path').join(__dirname, 'frontend', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
})

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});