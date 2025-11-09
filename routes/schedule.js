const express = require('express');
const router = express.Router();

// Mock schedule data
const meetings = [
    {
        id: '1',
        title: 'Client Call - Project Review',
        participants: ['Sarah Johnson'],
        startTime: new Date('2024-10-26T10:00:00'),
        endTime: new Date('2024-10-26T11:00:00'),
        status: 'confirmed',
        location: 'Zoom Meeting',
        description: 'Review project progress and discuss next steps'
    },
    {
        id: '2',
        title: 'Team Standup',
        participants: ['Development Team'],
        startTime: new Date('2024-10-26T14:00:00'),
        endTime: new Date('2024-10-26T14:30:00'),
        status: 'confirmed',
        location: 'Conference Room A',
        description: 'Daily team standup meeting'
    },
    {
        id: '3',
        title: 'Strategy Planning',
        participants: ['Management Team'],
        startTime: new Date('2024-10-26T16:30:00'),
        endTime: new Date('2024-10-26T17:30:00'),
        status: 'confirmed',
        location: 'Board Room',
        description: 'Quarterly strategy planning session'
    }
];

// Get all meetings
router.get('/meetings', (req, res) => {
    const { startDate, endDate } = req.query;
    
    let filteredMeetings = meetings;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredMeetings = meetings.filter(meeting => 
            meeting.startTime >= start && meeting.startTime <= end
        );
    }
    
    res.json({
        success: true,
        meetings: filteredMeetings
    });
});

// Create new meeting
router.post('/meetings', (req, res) => {
    const { title, participants, startTime, endTime, location, description } = req.body;
    
    const newMeeting = {
        id: (meetings.length + 1).toString(),
        title,
        participants: Array.isArray(participants) ? participants : [participants],
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: 'pending',
        location: location || 'TBD',
        description: description || '',
        createdAt: new Date()
    };
    
    meetings.push(newMeeting);
    
    res.json({
        success: true,
        meeting: newMeeting
    });
});

// Update meeting
router.put('/meetings/:id', (req, res) => {
    const { id } = req.params;
    const { title, participants, startTime, endTime, location, description, status } = req.body;
    
    const meetingIndex = meetings.findIndex(meeting => meeting.id === id);
    if (meetingIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Meeting not found'
        });
    }
    
    meetings[meetingIndex] = {
        ...meetings[meetingIndex],
        title: title || meetings[meetingIndex].title,
        participants: participants || meetings[meetingIndex].participants,
        startTime: startTime ? new Date(startTime) : meetings[meetingIndex].startTime,
        endTime: endTime ? new Date(endTime) : meetings[meetingIndex].endTime,
        location: location || meetings[meetingIndex].location,
        description: description || meetings[meetingIndex].description,
        status: status || meetings[meetingIndex].status,
        updatedAt: new Date()
    };
    
    res.json({
        success: true,
        meeting: meetings[meetingIndex]
    });
});

// Delete meeting
router.delete('/meetings/:id', (req, res) => {
    const { id } = req.params;
    
    const meetingIndex = meetings.findIndex(meeting => meeting.id === id);
    if (meetingIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Meeting not found'
        });
    }
    
    meetings.splice(meetingIndex, 1);
    
    res.json({
        success: true,
        message: 'Meeting deleted successfully'
    });
});

// Get available time slots
router.get('/availability', (req, res) => {
    const { date, duration } = req.query;
    
    // Mock available time slots
    const availableSlots = [
        { time: '09:00', available: true },
        { time: '09:30', available: true },
        { time: '10:00', available: false },
        { time: '10:30', available: true },
        { time: '11:00', available: true },
        { time: '11:30', available: true },
        { time: '12:00', available: false },
        { time: '12:30', available: false },
        { time: '13:00', available: true },
        { time: '13:30', available: true },
        { time: '14:00', available: false },
        { time: '14:30', available: false },
        { time: '15:00', available: true },
        { time: '15:30', available: true },
        { time: '16:00', available: true },
        { time: '16:30', available: false },
        { time: '17:00', available: true }
    ];
    
    res.json({
        success: true,
        date: date || new Date().toISOString().split('T')[0],
        duration: duration || 30,
        slots: availableSlots
    });
});

// Get scheduling preferences
router.get('/preferences', (req, res) => {
    const preferences = {
        workingHours: {
            start: '09:00',
            end: '17:00',
            timezone: 'America/New_York'
        },
        meetingDuration: 30,
        bufferTime: 15,
        advanceNotice: 24, // hours
        maxMeetingsPerDay: 8,
        autoConfirm: true,
        sendReminders: true,
        reminderTime: 60 // minutes before
    };
    
    res.json({
        success: true,
        preferences
    });
});

// Update scheduling preferences
router.put('/preferences', (req, res) => {
    const preferences = req.body;
    
    // In production, save to database
    console.log('Updated preferences:', preferences);
    
    res.json({
        success: true,
        message: 'Preferences updated successfully',
        preferences
    });
});

// Get meeting analytics
router.get('/analytics', (req, res) => {
    const analytics = {
        totalMeetings: 156,
        meetingsThisWeek: 23,
        averageMeetingDuration: 45,
        mostPopularTime: '10:00 AM',
        meetingTypes: [
            { type: 'Client Calls', count: 45, percentage: 29 },
            { type: 'Team Meetings', count: 38, percentage: 24 },
            { type: '1-on-1s', count: 32, percentage: 21 },
            { type: 'Strategy Sessions', count: 28, percentage: 18 },
            { type: 'Other', count: 13, percentage: 8 }
        ],
        weeklyStats: [
            { day: 'Monday', meetings: 8, hours: 6 },
            { day: 'Tuesday', meetings: 12, hours: 9 },
            { day: 'Wednesday', meetings: 10, hours: 7.5 },
            { day: 'Thursday', meetings: 15, hours: 11 },
            { day: 'Friday', meetings: 6, hours: 4.5 }
        ]
    };
    
    res.json({
        success: true,
        analytics
    });
});

module.exports = router;







