import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Sequelize, DataTypes } from 'sequelize';

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure Sequelize to use SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

// Define User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define Product model
const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Initialize the database
async function initDb() {
    await sequelize.sync({ force: true });

    // Add some products to the database if it's empty
    await Product.bulkCreate([
        { name: 'Sandisk Cruzer Blade CZ50 USB 2.0 Pendrive (16 GB) - Pack of 5', price: 999, image: 'images/product1.jpg' },
        { name: 'Pigeon by Stovekraft Kessel 1.2-Litre Multi-Purpose Kettle (Silver) 600W, Black', price: 799, image: 'images/product2.jpg' },
        { name: 'Mediweave KN95 (Equivalent to N95) Mask/Respirator, CE certified, Pack of 5', price: 199.99, image: 'images/product3.jpg' },
        { name: 'Amazon Echo (3rd generation) | Smart speaker with Alexa, Charcoal Fabric', price: 989.99, image: 'images/product4.jpg' },
        { name: 'New Apple iPad Pro (12.9-inch, Wi-Fi, 128GB) - Silver (4th Generation)', price: 159811.99, image: 'images/product5.jpg' },
        { name: 'Netgear R6120-100INS AC1200 Dual-Band Wi-Fi Router (Black, Not a Modem)', price: 1991.99, image: 'images/product6.jpg' },
        { name: 'Amazon Brand - Solimo Water Resistant Cotton Mattress Protector 78x72 - King Size, Grey', price: 839.99, image: 'images/product7.jpg' },
        { name: 'OPPO F19 Pro (Crystal Silver, 8GB RAM, 128GB Storage) with No Cost EMI/Additional Exchange Offers', price: 59877.99, image: 'images/product8.jpg' }
    ]);
}

// Initialize the database
initDb();

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await User.create({ username, password });
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send('User already exists');
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username, password } });
    if (user) {
        res.status(200).send('Login successful');
    } else {
        res.status(400).send('Invalid credentials');
    }
});

// Endpoint to get all products
app.get('/api/products', async (req, res) => {
    const products = await Product.findAll();
    res.send(products);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
