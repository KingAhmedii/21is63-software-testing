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
db.data ||= { users: [] };
await db.write();

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const user = db.data.users.find(user => user.username === username);

    if (user) {
        return res.status(400).send('User already exists');
    }

    db.data.users.push({ username, password });
    await db.write();
    res.status(200).send('User registered successfully');
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = db.data.users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(400).send('Invalid credentials');
    }

    res.status(200).send('Login successful');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
