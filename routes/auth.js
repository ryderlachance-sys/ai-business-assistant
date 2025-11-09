const express = require('express');
const router = express.Router();

// Mock user data (in production, this would come from a database)
const users = [
    {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        company: 'Demo Company',
        plan: 'professional',
        createdAt: new Date()
    }
];

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Mock authentication (in production, verify password hash)
    const user = users.find(u => u.email === email);
    
    if (user && password === 'demo123') {
        req.session.userId = user.id;
        res.json({ 
            success: true, 
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                company: user.company,
                plan: user.plan
            }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
        });
    }
});

// Register route
router.post('/register', (req, res) => {
    const { email, password, name, company } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ 
            success: false, 
            message: 'User already exists' 
        });
    }
    
    // Create new user
    const newUser = {
        id: (users.length + 1).toString(),
        email,
        name,
        company,
        plan: 'starter',
        createdAt: new Date()
    };
    
    users.push(newUser);
    
    // Set session
    req.session.userId = newUser.id;
    
    res.json({ 
        success: true, 
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            company: newUser.company,
            plan: newUser.plan
        }
    });
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Could not log out' 
            });
        }
        res.json({ success: true });
    });
});

// Get current user
router.get('/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authenticated' 
        });
    }
    
    const user = users.find(u => u.id === req.session.userId);
    if (!user) {
        return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
        });
    }
    
    res.json({ 
        success: true, 
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            company: user.company,
            plan: user.plan
        }
    });
});

// Google OAuth callback (mock)
router.get('/google/callback', (req, res) => {
    // Mock Google OAuth success
    const mockUser = {
        id: 'google_123',
        email: 'user@gmail.com',
        name: 'Google User',
        company: 'Google Company',
        plan: 'professional'
    };
    
    req.session.userId = mockUser.id;
    
    res.redirect('/dashboard');
});

module.exports = router;







