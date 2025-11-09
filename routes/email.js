const express = require('express');
const router = express.Router();

// Mock email data
const emailRules = [
    {
        id: '1',
        name: 'Customer Support Auto-Response',
        description: 'Automatically responds to common customer support questions',
        status: 'active',
        responsesSent: 156,
        successRate: 94,
        createdAt: new Date()
    },
    {
        id: '2',
        name: 'Meeting Confirmation',
        description: 'Sends automatic confirmation emails when meetings are scheduled',
        status: 'active',
        responsesSent: 89,
        successRate: 98,
        createdAt: new Date()
    }
];

// Get all email rules
router.get('/rules', (req, res) => {
    res.json({
        success: true,
        rules: emailRules
    });
});

// Create new email rule
router.post('/rules', (req, res) => {
    const { name, description, template } = req.body;
    
    const newRule = {
        id: (emailRules.length + 1).toString(),
        name,
        description,
        template,
        status: 'active',
        responsesSent: 0,
        successRate: 0,
        createdAt: new Date()
    };
    
    emailRules.push(newRule);
    
    res.json({
        success: true,
        rule: newRule
    });
});

// Update email rule
router.put('/rules/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, template, status } = req.body;
    
    const ruleIndex = emailRules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Rule not found'
        });
    }
    
    emailRules[ruleIndex] = {
        ...emailRules[ruleIndex],
        name: name || emailRules[ruleIndex].name,
        description: description || emailRules[ruleIndex].description,
        template: template || emailRules[ruleIndex].template,
        status: status || emailRules[ruleIndex].status,
        updatedAt: new Date()
    };
    
    res.json({
        success: true,
        rule: emailRules[ruleIndex]
    });
});

// Delete email rule
router.delete('/rules/:id', (req, res) => {
    const { id } = req.params;
    
    const ruleIndex = emailRules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Rule not found'
        });
    }
    
    emailRules.splice(ruleIndex, 1);
    
    res.json({
        success: true,
        message: 'Rule deleted successfully'
    });
});

// Get email analytics
router.get('/analytics', (req, res) => {
    const analytics = {
        totalEmails: 1247,
        automatedEmails: 873,
        manualEmails: 374,
        responseRate: 94.2,
        averageResponseTime: '2.3 minutes',
        topKeywords: [
            { keyword: 'pricing', count: 45 },
            { keyword: 'support', count: 38 },
            { keyword: 'meeting', count: 32 },
            { keyword: 'demo', count: 28 }
        ],
        dailyStats: [
            { date: '2024-10-20', emails: 45, automated: 32 },
            { date: '2024-10-21', emails: 52, automated: 38 },
            { date: '2024-10-22', emails: 38, automated: 28 },
            { date: '2024-10-23', emails: 61, automated: 45 },
            { date: '2024-10-24', emails: 47, automated: 35 },
            { date: '2024-10-25', emails: 43, automated: 31 },
            { date: '2024-10-26', emails: 39, automated: 29 }
        ]
    };
    
    res.json({
        success: true,
        analytics
    });
});

// Send test email
router.post('/test', (req, res) => {
    const { to, subject, body } = req.body;
    
    // Mock email sending
    setTimeout(() => {
        res.json({
            success: true,
            message: 'Test email sent successfully',
            emailId: 'test_' + Date.now()
        });
    }, 1000);
});

// Get email templates
router.get('/templates', (req, res) => {
    const templates = [
        {
            id: '1',
            name: 'Welcome Email',
            subject: 'Welcome to {{company}}!',
            body: 'Hi {{name}},\n\nWelcome to {{company}}! We\'re excited to have you on board.\n\nBest regards,\nThe {{company}} Team',
            variables: ['name', 'company']
        },
        {
            id: '2',
            name: 'Meeting Confirmation',
            subject: 'Meeting Confirmed: {{meeting_title}}',
            body: 'Hi {{name}},\n\nYour meeting "{{meeting_title}}" has been confirmed for {{meeting_date}} at {{meeting_time}}.\n\nMeeting Link: {{meeting_link}}\n\nBest regards,\n{{company}}',
            variables: ['name', 'meeting_title', 'meeting_date', 'meeting_time', 'meeting_link', 'company']
        },
        {
            id: '3',
            name: 'Follow-up Email',
            subject: 'Following up on {{topic}}',
            body: 'Hi {{name}},\n\nI wanted to follow up on our discussion about {{topic}}.\n\nPlease let me know if you have any questions.\n\nBest regards,\n{{sender_name}}',
            variables: ['name', 'topic', 'sender_name']
        }
    ];
    
    res.json({
        success: true,
        templates
    });
});

module.exports = router;







