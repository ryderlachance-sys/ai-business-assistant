const express = require('express');
const router = express.Router();

// Mock subscription data
const subscriptions = {
    '1': {
        id: '1',
        userId: '1',
        plan: 'professional',
        status: 'active',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-10-01'),
        price: 59,
        currency: 'USD',
        features: [
            '500 automated emails/month',
            'Advanced scheduling',
            '5 business integrations',
            'Priority support'
        ]
    }
};

// Get current subscription
router.get('/current', (req, res) => {
    const userId = req.session.userId || '1'; // Mock user ID
    
    const subscription = subscriptions[userId];
    if (!subscription) {
        return res.status(404).json({
            success: false,
            message: 'No active subscription found'
        });
    }
    
    res.json({
        success: true,
        subscription
    });
});

// Get available plans
router.get('/plans', (req, res) => {
    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            price: 29,
            currency: 'USD',
            period: 'month',
            description: 'Perfect for solopreneurs and small teams',
            features: [
                '100 automated emails/month',
                'Basic scheduling',
                '1 business integration',
                'Email support'
            ],
            limits: {
                emails: 100,
                integrations: 1,
                users: 1
            }
        },
        {
            id: 'professional',
            name: 'Professional',
            price: 59,
            currency: 'USD',
            period: 'month',
            description: 'Ideal for growing businesses',
            features: [
                '500 automated emails/month',
                'Advanced scheduling',
                '5 business integrations',
                'Priority support'
            ],
            limits: {
                emails: 500,
                integrations: 5,
                users: 5
            },
            popular: true
        },
        {
            id: 'business',
            name: 'Business',
            price: 99,
            currency: 'USD',
            period: 'month',
            description: 'For established businesses',
            features: [
                'Unlimited automated emails',
                'Full scheduling suite',
                'Unlimited integrations',
                'Phone support'
            ],
            limits: {
                emails: -1, // unlimited
                integrations: -1, // unlimited
                users: -1 // unlimited
            }
        }
    ];
    
    res.json({
        success: true,
        plans
    });
});

// Create subscription
router.post('/create', (req, res) => {
    const { planId, paymentMethod } = req.body;
    const userId = req.session.userId || '1'; // Mock user ID
    
    // Validate plan
    const plans = {
        starter: { price: 29, features: ['100 automated emails/month', 'Basic scheduling', '1 business integration', 'Email support'] },
        professional: { price: 59, features: ['500 automated emails/month', 'Advanced scheduling', '5 business integrations', 'Priority support'] },
        business: { price: 99, features: ['Unlimited automated emails', 'Full scheduling suite', 'Unlimited integrations', 'Phone support'] }
    };
    
    const plan = plans[planId];
    if (!plan) {
        return res.status(400).json({
            success: false,
            message: 'Invalid plan selected'
        });
    }
    
    // Mock payment processing
    if (!paymentMethod) {
        return res.status(400).json({
            success: false,
            message: 'Payment method required'
        });
    }
    
    // Create subscription
    const subscription = {
        id: userId,
        userId,
        plan: planId,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        price: plan.price,
        currency: 'USD',
        features: plan.features,
        paymentMethod: 'card_****1234' // Mock payment method
    };
    
    subscriptions[userId] = subscription;
    
    res.json({
        success: true,
        subscription,
        message: 'Subscription created successfully'
    });
});

// Update subscription
router.put('/update', (req, res) => {
    const { planId } = req.body;
    const userId = req.session.userId || '1'; // Mock user ID
    
    const subscription = subscriptions[userId];
    if (!subscription) {
        return res.status(404).json({
            success: false,
            message: 'No active subscription found'
        });
    }
    
    // Validate new plan
    const plans = {
        starter: { price: 29, features: ['100 automated emails/month', 'Basic scheduling', '1 business integration', 'Email support'] },
        professional: { price: 59, features: ['500 automated emails/month', 'Advanced scheduling', '5 business integrations', 'Priority support'] },
        business: { price: 99, features: ['Unlimited automated emails', 'Full scheduling suite', 'Unlimited integrations', 'Phone support'] }
    };
    
    const newPlan = plans[planId];
    if (!newPlan) {
        return res.status(400).json({
            success: false,
            message: 'Invalid plan selected'
        });
    }
    
    // Update subscription
    subscription.plan = planId;
    subscription.price = newPlan.price;
    subscription.features = newPlan.features;
    subscription.updatedAt = new Date();
    
    res.json({
        success: true,
        subscription,
        message: 'Subscription updated successfully'
    });
});

// Cancel subscription
router.post('/cancel', (req, res) => {
    const userId = req.session.userId || '1'; // Mock user ID
    
    const subscription = subscriptions[userId];
    if (!subscription) {
        return res.status(404).json({
            success: false,
            message: 'No active subscription found'
        });
    }
    
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    
    res.json({
        success: true,
        message: 'Subscription cancelled successfully',
        subscription
    });
});

// Get billing history
router.get('/billing', (req, res) => {
    const userId = req.session.userId || '1'; // Mock user ID
    
    const billingHistory = [
        {
            id: 'inv_001',
            date: new Date('2024-10-01'),
            amount: 59,
            currency: 'USD',
            status: 'paid',
            description: 'Professional Plan - October 2024'
        },
        {
            id: 'inv_002',
            date: new Date('2024-09-01'),
            amount: 59,
            currency: 'USD',
            status: 'paid',
            description: 'Professional Plan - September 2024'
        },
        {
            id: 'inv_003',
            date: new Date('2024-08-01'),
            amount: 29,
            currency: 'USD',
            status: 'paid',
            description: 'Starter Plan - August 2024'
        }
    ];
    
    res.json({
        success: true,
        billingHistory
    });
});

// Get usage statistics
router.get('/usage', (req, res) => {
    const userId = req.session.userId || '1'; // Mock user ID
    
    const usage = {
        currentPeriod: {
            startDate: new Date('2024-10-01'),
            endDate: new Date('2024-10-31'),
            emails: {
                used: 247,
                limit: 500,
                percentage: 49.4
            },
            integrations: {
                used: 3,
                limit: 5,
                percentage: 60
            },
            users: {
                used: 2,
                limit: 5,
                percentage: 40
            }
        },
        trends: {
            emails: [
                { month: 'August', used: 89, limit: 100 },
                { month: 'September', used: 156, limit: 500 },
                { month: 'October', used: 247, limit: 500 }
            ]
        }
    };
    
    res.json({
        success: true,
        usage
    });
});

// Update payment method
router.put('/payment-method', (req, res) => {
    const { paymentMethod } = req.body;
    const userId = req.session.userId || '1'; // Mock user ID
    
    const subscription = subscriptions[userId];
    if (!subscription) {
        return res.status(404).json({
            success: false,
            message: 'No active subscription found'
        });
    }
    
    // Mock payment method update
    subscription.paymentMethod = 'card_****5678';
    subscription.updatedAt = new Date();
    
    res.json({
        success: true,
        message: 'Payment method updated successfully',
        subscription
    });
});

// Get subscription analytics
router.get('/analytics', (req, res) => {
    const analytics = {
        revenue: {
            monthly: 59,
            yearly: 708,
            growth: 12.5
        },
        usage: {
            emailsProcessed: 1247,
            meetingsScheduled: 156,
            timeSaved: 32.1,
            automationRate: 94.2
        },
        savings: {
            timeValue: 1284, // hours saved * hourly rate
            efficiencyGain: 35.4,
            costSavings: 2400
        }
    };
    
    res.json({
        success: true,
        analytics
    });
});

module.exports = router;







