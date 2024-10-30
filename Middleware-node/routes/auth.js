import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { EMAIL, EMAIL_PASSWORD } from '../config.js';

import { connectDB, userCollection } from '../db.js';


const router = express.Router();

const verifyUser = async (email, password) => {
    const user = await userCollection.findOne({ email });
    return user && await bcrypt.compare(password, user.password);
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        EMAIL,
        EMAIL_PASSWORD
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and Password are required' });
    }
    if (await verifyUser(email, password)) {
        return res.status(200).json({ message: 'User logged in successfully' });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

router.post('/signup', async (req, res) => {
    const { id, firstName, lastName, email, password, location, created_at } = req.body;

    console.log(`User ID: ${id} First Name: ${firstName} Last Name: ${lastName} Email: ${email} Password: ${password} Location: ${location} Created At: ${created_at}`);

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ detail: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id,
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        location,
        created_at: created_at || new Date(),
    };

    await userCollection.insertOne(newUser);

    res.status(201).json({ message: "Sign-Up successful" });
});

router.post('/forgot-password', async (req, res) => {
    const {email} = req.body;
    const user = await userCollection.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const token = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; 

    await userCollection.updateOne({ email }, { $set: { resetPasswordToken: token, resetPasswordExpires: resetTokenExpiry } });
    const mailOptions = {
        to: email,
        from: process.env.EMAIL,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://${req.headers.host}/reset-password/${token}\n\n` +
              `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    console.log('Sending mail, reset link', `http://${req.headers.host}/reset-password/${token}\n\n` );
    transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
            console.error('There was an error: ', err);
            return res.status(500).json({ error: 'Error sending email' });
        }
        res.status(200).json({ message: 'Password reset email sent successfully' });
    });
}); 

export default router;