const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

// Item Schema
const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    currentPrice: { type: Number },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    endTime: { type: Date, required: true },
    image: { type: String },
    category: { type: String, required: true },
    status: { type: String, enum: ['active', 'ended'], default: 'active' }
});

// Bid Schema
const bidSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    time: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);
const Bid = mongoose.model('Bid', bidSchema);

// Multer Configuration for Image Upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: { id: user._id, username, email } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user._id, username: user.username, email } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Item Routes
app.post('/api/items', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, startingPrice, endTime, category } = req.body;
        
        const item = new Item({
            title,
            description,
            startingPrice,
            currentPrice: startingPrice,
            seller: req.user.id,
            endTime,
            category,
            image: req.file ? `/uploads/${req.file.filename}` : null
        });

        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error: error.message });
    }
});

app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find({ status: 'active' })
            .populate('seller', 'username')
            .sort({ endTime: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('seller', 'username');
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item', error: error.message });
    }
});

// Bid Routes
app.post('/api/items/:id/bid', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.status === 'ended') {
            return res.status(400).json({ message: 'Auction has ended' });
        }

        if (amount <= item.currentPrice) {
            return res.status(400).json({ message: 'Bid must be higher than current price' });
        }

        const bid = new Bid({
            item: item._id,
            bidder: req.user.id,
            amount
        });

        await bid.save();
        item.currentPrice = amount;
        await item.save();

        res.status(201).json(bid);
    } catch (error) {
        res.status(500).json({ message: 'Error placing bid', error: error.message });
    }
});

// Get user's bids
app.get('/api/user/bids', authenticateToken, async (req, res) => {
    try {
        const bids = await Bid.find({ bidder: req.user.id })
            .populate('item')
            .sort({ time: -1 });
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bids', error: error.message });
    }
});

// Get user's items
app.get('/api/user/items', authenticateToken, async (req, res) => {
    try {
        const items = await Item.find({ seller: req.user.id })
            .sort({ endTime: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
});

// Search and Filter Routes
app.get('/api/search', async (req, res) => {
    try {
        const { query, category, minPrice, maxPrice } = req.query;
        
        let filter = { status: 'active' };
        
        if (query) {
            filter.$or = [
                { title: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ];
        }
        
        if (category) {
            filter.category = category;
        }
        
        if (minPrice || maxPrice) {
            filter.currentPrice = {};
            if (minPrice) filter.currentPrice.$gte = minPrice;
            if (maxPrice) filter.currentPrice.$lte = maxPrice;
        }

        const items = await Item.find(filter)
            .populate('seller', 'username')
            .sort({ endTime: 1 });
            
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error searching items', error: error.message });
    }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});