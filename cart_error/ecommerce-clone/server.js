import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Low, JSONFile } from 'lowdb';

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure lowdb to write to JSON file
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

// Initialize the database with default data if it doesn't exist
db.data ||= { products: [] };
await db.write();

// Add some products to the database if it's empty
if (!db.data.products || db.data.products.length === 0) {
    db.data.products = [
        { id: 1, name: 'Sandisk Cruzer Blade CZ50 USB 2.0 Pendrive (16 GB) - Pack of 5', price: 999, image: 'images/product1.jpg' },
        { id: 2, name: 'Pigeon by Stovekraft Kessel 1.2-Litre Multi-Purpose Kettle (Silver) 600W, Black', price: 799, image: 'images/product2.jpg' },
        { id: 3, name: 'Mediweave KN95 (Equivalent to N95) Mask/Respirator, CE certified, Pack of 5', price: 199.99, image: 'images/product3.jpg' },
        { id: 4, name: 'Amazon Echo (3rd generation) | Smart speaker with Alexa, Charcoal Fabric', price: 989.99, image: 'images/product4.jpg' },
        { id: 5, name: 'New Apple iPad Pro (12.9-inch, Wi-Fi, 128GB) - Silver (4th Generation)', price: 159811.99, image: 'images/product5.jpg' },
        { id: 6, name: 'Netgear R6120-100INS AC1200 Dual-Band Wi-Fi Router (Black, Not a Modem)', price: 1991.99, image: 'images/product6.jpg' },
        { id: 7, name: 'Amazon Brand - Solimo Water Resistant Cotton Mattress Protector 78x72 - King Size, Grey', price: 839.99, image: 'images/product7.jpg' },
        { id: 8, name: 'OPPO F19 Pro (Crystal Silver, 8GB RAM, 128GB Storage) with No Cost EMI/Additional Exchange Offers', price: 59877.99, image: 'images/product8.jpg' }
    ];
    await db.write();
}

// Endpoint to get all products
app.get('/api/products', async (req, res) => {
    await db.read();
    res.send(db.data.products);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
