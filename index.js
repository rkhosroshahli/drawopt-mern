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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusternetworkassignmen.efumv5c.mongodb.net/optimizationDB?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true 
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });