import express from "express";
import "dotenv/config";
import { users } from "./data/users.js";
import { generateToken, verifyToken } from "./jwt-middleware.js";
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/login', generateToken, (req, res) => {});

app.get('/api/user', verifyToken, (req, res) => {
    res.json({ message: 'Token has been verified' });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});