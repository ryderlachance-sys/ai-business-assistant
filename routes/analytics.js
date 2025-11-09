const express = require('express');
const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', (req, res) => {
    const analytics = {
        overview: {
            emailsProcessed: 1247,
            hoursSaved: 8.5,
            meetingsScheduled: 156,
            automationRate: 94.2
        },
        timeSaved: {
            thisWeek: 8.5,
            lastWeek: 6.2,
            thisMonth: 32.1,
            lastMonth: 28.7,
            trend: 'up'
        },
        emailAutomation: {
            totalEmails: 1247,
            automatedEmails: 873,
            manualEmails: 374,
            responseRate: 94.2,
            averageResponseTime: '2.3 minutes'
        },
        scheduling: {
            totalMeetings: 156,
            meetingsThisWeek: 23,
            averageDuration: 45,
            mostPopularTime: '10:00 AM'
        },
        productivity: {
            tasksCompleted: 89,
            tasksAutomated: 67,
            efficiencyGain: 23.5,
            timeToFocus: 4.2
        }
    };
    
    res.json({
        success: true,
        analytics
    });
});

// Get recent activity feed
router.get('/activity', (req, res) => {
    const activity = [
        {
            id: 'email-auto-response',
            icon: '📧',
            title: 'Email auto-responded to customer inquiry',
            time: '2 minutes ago',
            type: 'email'
        },
        {
            id: 'meeting-scheduled',
            icon: '📅',
            title: 'Meeting scheduled with Sarah Johnson',
            time: '15 minutes ago',
            type: 'schedule'
        },
        {
            id: 'analytics-report',
            icon: '📊',
            title: 'Weekly analytics report generated',
            time: '1 hour ago',
            type: 'analytics'
        },
        {
            id: 'integration-connected',
            icon: '🔗',
            title: 'Slack workspace connected successfully',
            time: '3 hours ago',
            type: 'integration'
        },
        {
            id: 'follow-up-sent',
            icon: '✉️',
            title: 'Follow-up email sent to new lead',
            time: 'Yesterday',
            type: 'email'
        }
    ];

    res.json({
        success: true,
        activity
    });
});

// Get email analytics
router.get('/email', (req, res) => {
    const { period = 'week' } = req.query;
    
    const emailAnalytics = {
        summary: {
            totalEmails: 1247,
            automatedEmails: 873,
            manualEmails: 374,
            responseRate: 94.2,
            averageResponseTime: '2.3 minutes'
        },
        trends: {
            daily: [
                { date: '2024-10-20', emails: 45, automated: 32, manual: 13 },
                { date: '2024-10-21', emails: 52, automated: 38, manual: 14 },
                { date: '2024-10-22', emails: 38, automated: 28, manual: 10 },
                { date: '2024-10-23', emails: 61, automated: 45, manual: 16 },
                { date: '2024-10-24', emails: 47, automated: 35, manual: 12 },
                { date: '2024-10-25', emails: 43, automated: 31, manual: 12 },
                { date: '2024-10-26', emails: 39, automated: 29, manual: 10 }
            ],
            weekly: [
                { week: 'Week 1', emails: 312, automated: 218, manual: 94 },
                { week: 'Week 2', emails: 298, automated: 209, manual: 89 },
                { week: 'Week 3', emails: 334, automated: 234, manual: 100 },
                { week: 'Week 4', emails: 303, automated: 212, manual: 91 }
            ]
        },
        topKeywords: [
            { keyword: 'pricing', count: 45, percentage: 12.3 },
            { keyword: 'support', count: 38, percentage: 10.4 },
            { keyword: 'meeting', count: 32, percentage: 8.7 },
            { keyword: 'demo', count: 28, percentage: 7.6 },
            { keyword: 'invoice', count: 24, percentage: 6.6 }
        ],
        responseTime: {
            automated: '2.3 minutes',
            manual: '4.7 hours',
            improvement: '98.2%'
        }
    };
    
    res.json({
        success: true,
        period,
        analytics: emailAnalytics
    });
});

// Get scheduling analytics
router.get('/scheduling', (req, res) => {
    const schedulingAnalytics = {
        summary: {
            totalMeetings: 156,
            meetingsThisWeek: 23,
            averageDuration: 45,
            mostPopularTime: '10:00 AM',
            successRate: 96.8
        },
        trends: {
            daily: [
                { day: 'Monday', meetings: 8, hours: 6 },
                { day: 'Tuesday', meetings: 12, hours: 9 },
                { day: 'Wednesday', meetings: 10, hours: 7.5 },
                { day: 'Thursday', meetings: 15, hours: 11 },
                { day: 'Friday', meetings: 6, hours: 4.5 }
            ],
            weekly: [
                { week: 'Week 1', meetings: 38, hours: 28.5 },
                { week: 'Week 2', meetings: 42, hours: 31.5 },
                { week: 'Week 3', meetings: 35, hours: 26.25 },
                { week: 'Week 4', meetings: 41, hours: 30.75 }
            ]
        },
        meetingTypes: [
            { type: 'Client Calls', count: 45, percentage: 29, avgDuration: 60 },
            { type: 'Team Meetings', count: 38, percentage: 24, avgDuration: 30 },
            { type: '1-on-1s', count: 32, percentage: 21, avgDuration: 45 },
            { type: 'Strategy Sessions', count: 28, percentage: 18, avgDuration: 90 },
            { type: 'Other', count: 13, percentage: 8, avgDuration: 30 }
        ],
        timeDistribution: [
            { time: '09:00', meetings: 12, percentage: 7.7 },
            { time: '10:00', meetings: 18, percentage: 11.5 },
            { time: '11:00', meetings: 15, percentage: 9.6 },
            { time: '14:00', meetings: 22, percentage: 14.1 },
            { time: '15:00', meetings: 16, percentage: 10.3 },
            { time: '16:00', meetings: 14, percentage: 9.0 }
        ]
    };
    
    res.json({
        success: true,
        analytics: schedulingAnalytics
    });
});

// Get productivity analytics
router.get('/productivity', (req, res) => {
    const productivityAnalytics = {
        summary: {
            tasksCompleted: 89,
            tasksAutomated: 67,
            efficiencyGain: 23.5,
            timeToFocus: 4.2,
            productivityScore: 87
        },
        timeBreakdown: {
            automated: 67,
            manual: 22,
            saved: 45
        },
        focusTime: {
            thisWeek: 4.2,
            lastWeek: 3.8,
            thisMonth: 16.8,
            lastMonth: 14.2,
            trend: 'up'
        },
        efficiency: {
            beforeAutomation: 6.5,
            afterAutomation: 4.2,
            improvement: 35.4
        },
        weeklyTrends: [
            { week: 'Week 1', tasks: 78, automated: 58, efficiency: 82 },
            { week: 'Week 2', tasks: 85, automated: 64, efficiency: 85 },
            { week: 'Week 3', tasks: 92, automated: 71, efficiency: 88 },
            { week: 'Week 4', tasks: 89, automated: 67, efficiency: 87 }
        ]
    };
    
    res.json({
        success: true,
        analytics: productivityAnalytics
    });
});

// Get business insights
router.get('/insights', (req, res) => {
    const insights = [
        {
            id: '1',
            type: 'success',
            title: 'Email Response Time Improved',
            description: 'Your average email response time has improved by 98% with automation.',
            metric: '2.3 minutes',
            change: '+98%',
            trend: 'up'
        },
        {
            id: '2',
            type: 'warning',
            title: 'Meeting Overload Alert',
            description: 'You have 15 meetings scheduled this week. Consider blocking focus time.',
            metric: '15 meetings',
            change: '+25%',
            trend: 'up'
        },
        {
            id: '3',
            type: 'info',
            title: 'Productivity Peak',
            description: 'Your most productive hours are between 10 AM and 2 PM.',
            metric: '4 hours',
            change: 'Peak time',
            trend: 'stable'
        },
        {
            id: '4',
            type: 'success',
            title: 'Automation Success',
            description: '94% of your emails are now handled automatically.',
            metric: '94%',
            change: '+12%',
            trend: 'up'
        }
    ];
    
    res.json({
        success: true,
        insights
    });
});

// Get performance metrics
router.get('/performance', (req, res) => {
    const { period = 'month' } = req.query;
    
    const performanceMetrics = {
        period,
        metrics: {
            timeSaved: {
                value: 32.1,
                unit: 'hours',
                change: '+12.5%',
                trend: 'up'
            },
            emailsProcessed: {
                value: 1247,
                unit: 'emails',
                change: '+8.3%',
                trend: 'up'
            },
            meetingsScheduled: {
                value: 156,
                unit: 'meetings',
                change: '+15.2%',
                trend: 'up'
            },
            automationRate: {
                value: 94.2,
                unit: '%',
                change: '+3.1%',
                trend: 'up'
            },
            productivityScore: {
                value: 87,
                unit: 'score',
                change: '+5.2%',
                trend: 'up'
            }
        },
        benchmarks: {
            industryAverage: {
                timeSaved: 15.2,
                automationRate: 67.8,
                productivityScore: 72
            },
            topPerformers: {
                timeSaved: 45.6,
                automationRate: 96.4,
                productivityScore: 94
            }
        }
    };
    
    res.json({
        success: true,
        performance: performanceMetrics
    });
});

// Export analytics data
router.get('/export', (req, res) => {
    const { format = 'json', period = 'month' } = req.query;
    
    // Mock export data
    const exportData = {
        period,
        generatedAt: new Date().toISOString(),
        data: {
            emails: 1247,
            meetings: 156,
            timeSaved: 32.1,
            automationRate: 94.2
        }
    };
    
    if (format === 'csv') {
        // In production, generate actual CSV
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="analytics.csv"');
        res.send('Date,Emails,Meetings,TimeSaved,AutomationRate\n2024-10-26,39,3,1.2,94.2\n');
    } else {
        res.json({
            success: true,
            data: exportData
        });
    }
});

module.exports = router;





