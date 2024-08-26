require('dotenv').config();
const express = require('express');
const app = express();
const emailRoutes = require('./routes/emailRoutes');

app.use(express.json());
app.use('/email', emailRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
  res.json("hello");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
