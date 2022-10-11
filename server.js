const express = require('express');
const cors =  require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./handelrs/users');
const categoriesRoutes = require('./handelrs/categories');

const app = express();
const port = process.env.PORT|| '3001';

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('./uploads'));

app.get('/', function (_req, res) {
    res.json({message: 'Hello!'});
});

userRoutes(app);
categoriesRoutes(app);

app.use((_req, res) => {
    res.status(404).json({message: 'oh you are lost.'})
});


app.listen(port, async () => {
    console.log(`starting app on: ${port}`);
    await sequelize.authenticate()
    console.log('Database is connected!!');
});
