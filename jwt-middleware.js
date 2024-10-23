import { users } from "./data/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;

export const generateToken = (req, res, next) => {
    const { login, password } = req.body;

    const user = users.find((u) => u.login === login);

    if (!user){
        return res.status(404).json({ message: 'User not found' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
            const token = jwt.sign({ id: user.id, login: user.login }, SECRET_KEY, {
                expiresIn: '1h'
            });

            res.json({ token });
        }
        else{
            res.status(400).json({ message: 'Incorrect password' });
        }
    });
}

export const verifyToken = (req, res, next) => {
    const auth = req.headers["authorization"];
    const token = auth && auth.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Cannot verify token' });
        }

        req.userId = decoded.id;
        next();
    });
};