const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

// Define models object to store all models
const models = {};

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
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    startingPrice: { type: Number, required: true, min: 0 },
    currentPrice: { type: Number },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    durationHours: { type: Number, min: 1, max: 168 },  // Made optional since we set it in pre-save
    startTime: { type: Date },  // Made optional since we set it in pre-save
    endTime: { type: Date },    // Made optional since we set it in pre-save
    image: { type: String },
    category: { type: String, required: true, enum: ['Electronics', 'Watches', 'Jewelry', 'Antiques', 'Art', 'Other'] },
    condition: { type: String, enum: ['New', 'Used', 'Refurbished', 'Antique'], default: 'New' },
    status: { type: String, enum: ['active', 'ended'], default: 'active' }
}, {
    timestamps: true
});

// Pre-save middleware to set currentPrice, startTime, and endTime
itemSchema.pre('save', function(next) {
    // Set currentPrice if not set
    if (!this.currentPrice) {
        this.currentPrice = this.startingPrice;
    }

    // Set startTime if not set
    if (!this.startTime) {
        this.startTime = new Date();
    }

    // Set endTime based on durationHours
    if (this.durationHours) {
        this.endTime = new Date(this.startTime.getTime() + (this.durationHours * 60 * 60 * 1000));
    }

    next();
});

// Initialize models
try {
    models.User = mongoose.model('User');
} catch {
    models.User = mongoose.model('User', userSchema);
}

try {
    models.Item = mongoose.model('Item');
} catch {
    models.Item = mongoose.model('Item', itemSchema);
}

// Add indexes for better performance
itemSchema.index({ status: 1, endTime: 1 });
itemSchema.index({ seller: 1, status: 1 });
itemSchema.index({ category: 1, status: 1 });

// Bid Schema
const bidSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    time: { type: Date, default: Date.now }
});

// Initialize Bid model
models.Bid = mongoose.model('Bid', bidSchema);

// Get all models
const { User, Item, Bid } = models;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Configuration for Image Upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

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
        const { email, password, role } = req.body;

        // Find user by email and role
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or role' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Additional role check
        if (user.role !== role) {
            return res.status(403).json({ message: 'Invalid role for this user' });
        }

        // Create token with all necessary user info
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
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
        const { username, email, password, role } = req.body;
        
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
            password: hashedPassword,
            role: role || 'user' // Default to 'user' if role is not specified
        });

        await user.save();

        res.status(201).json({ message: 'Registration successful. Please login.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
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
// Item Routes
app.post('/api/items', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    console.log('Received item data:', req.body);
    console.log('Received file:', req.file);
    console.log('User data from token:', req.user);

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin users can create items' });
    }

    // Extract and validate fields
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const startingPrice = parseFloat(req.body.startingPrice);
    const durationHours = parseFloat(req.body.durationHours);
    const category = req.body.category?.trim();
    const condition = req.body.condition || 'New';

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields: {
          title: !title,
          description: !description,
          category: !category
        }
      });
    }

    // Validate numeric fields
    if (isNaN(startingPrice) || startingPrice <= 0) {
      return res.status(400).json({ message: 'Starting price must be a positive number' });
    }

    if (isNaN(durationHours) || durationHours <= 0 || durationHours > 168) {
      return res.status(400).json({ message: 'Duration must be between 1 and 168 hours' });
    }

    // Create item data
    const itemData = {
      title,
      description,
      startingPrice,
      durationHours,
      category,
      condition,
      seller: req.user.id,
      startTime: new Date()
    };

    // Add image if provided
    if (req.file) {
      itemData.image = `/uploads/${req.file.filename}`;
    }

    console.log('Creating new item with data:', itemData);

    // Create and save the item
    const newItem = new Item(itemData);
    const savedItem = await newItem.save();

    console.log('Item saved successfully:', savedItem);
    return res.status(201).json(savedItem);

  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).json({
      message: 'Error creating item',
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : null
    });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find({ status: 'active' })
      .sort({ endTime: 1 })
      .populate('seller', 'username');
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
});

app.delete('/api/items/:id', authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only admin or the seller can delete the item
    if (req.user.role !== 'admin' && item.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    // Delete the image file if it exists
    if (item.image) {
      const imagePath = path.join(__dirname, item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item' });
  }
});

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