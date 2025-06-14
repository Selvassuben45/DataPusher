require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
app.use(express.json()); app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
});
const PORT = process.env.PORT;
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
const apiRoutes = require('./routes');
app.use('/api', limiter, apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const sequelize = require('./config/db');
sequelize.sync({ force: false })
  .then(() => {
    // console.log('Database & tables created!');
  })
  .catch(err => {
    console.log(err);

    // console.error('Database Sync Error: ', err);
  });

sequelize.authenticate()
  .then(() => console.log('MySQL Database Connected!'))
  .catch(err => console.error('DB Connection Failed:', err));
require('./queue/queueprocessor');
module.exports = app;