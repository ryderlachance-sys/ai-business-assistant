const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.openai.com"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3002/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Store user data and tokens
    const user = {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos[0].value,
      accessToken,
      refreshToken
    };
    
    // In a real app, save to database
    console.log('Google OAuth user:', user);
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google APIs configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL || "http://localhost:3002/auth/google/callback"
);

// Google services
const gmail = google.gmail({ version: 'v1' });
const calendar = google.calendar({ version: 'v3' });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/pricing', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pricing.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Google OAuth Routes
app.get('/auth/google', (req, res) => {
  // Check if Google credentials are configured
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your-google-client-id') {
    return res.json({ 
      error: 'Google OAuth not configured',
      message: 'Please set up Google OAuth credentials. See GOOGLE_SETUP.md for instructions.',
      setupRequired: true
    });
  }
  
  passport.authenticate('google', { 
    scope: [
      'profile', 
      'email',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ] 
  })(req, res);
});

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect('/dashboard');
  }
);

// OAuth Integration System
const integrations = {
  google: {
    name: 'Google',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
    redirectUri: '/auth/google/callback'
  },
  slack: {
    name: 'Slack',
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scope: 'channels:read,chat:write,users:read,team:read',
    redirectUri: '/auth/slack/callback'
  },
  microsoft: {
    name: 'Microsoft',
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scope: 'https://graph.microsoft.com/User.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.ReadWrite',
    redirectUri: '/auth/microsoft/callback'
  },
  salesforce: {
    name: 'Salesforce',
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
    authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
    tokenUrl: 'https://login.salesforce.com/services/oauth2/token',
    scope: 'api refresh_token',
    redirectUri: '/auth/salesforce/callback'
  },
  hubspot: {
    name: 'HubSpot',
    clientId: process.env.HUBSPOT_CLIENT_ID,
    clientSecret: process.env.HUBSPOT_CLIENT_SECRET,
    authUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    scope: 'contacts deals tickets',
    redirectUri: '/auth/hubspot/callback'
  },
  zapier: {
    name: 'Zapier',
    clientId: process.env.ZAPIER_CLIENT_ID,
    clientSecret: process.env.ZAPIER_CLIENT_SECRET,
    authUrl: 'https://zapier.com/oauth/authorize',
    tokenUrl: 'https://zapier.com/oauth/token',
    scope: 'zaps:read zaps:write',
    redirectUri: '/auth/zapier/callback'
  },
  trello: {
    name: 'Trello',
    clientId: process.env.TRELLO_CLIENT_ID,
    clientSecret: process.env.TRELLO_CLIENT_SECRET,
    authUrl: 'https://trello.com/1/OAuthAuthorizeToken',
    tokenUrl: 'https://trello.com/1/OAuthGetAccessToken',
    scope: 'read,write',
    redirectUri: '/auth/trello/callback'
  },
  asana: {
    name: 'Asana',
    clientId: process.env.ASANA_CLIENT_ID,
    clientSecret: process.env.ASANA_CLIENT_SECRET,
    authUrl: 'https://app.asana.com/-/oauth_authorize',
    tokenUrl: 'https://app.asana.com/-/oauth_token',
    scope: 'default',
    redirectUri: '/auth/asana/callback'
  },
  notion: {
    name: 'Notion',
    clientId: process.env.NOTION_CLIENT_ID,
    clientSecret: process.env.NOTION_CLIENT_SECRET,
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenUrl: 'https://api.notion.com/v1/oauth/token',
    scope: 'read',
    redirectUri: '/auth/notion/callback'
  },
  github: {
    name: 'GitHub',
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scope: 'user:email repo',
    redirectUri: '/auth/github/callback'
  }
};

// Store OAuth state for security
const oauthStates = new Map();

// Generate OAuth URL
function generateOAuthUrl(integration, userId = 'default') {
  const crypto = require('crypto');
  const state = crypto.randomBytes(16).toString('hex');
  oauthStates.set(state, { integration: integration.name, userId, timestamp: Date.now() });
  
  const params = new URLSearchParams({
    client_id: integration.clientId,
    redirect_uri: `${process.env.BASE_URL || 'http://localhost:3002'}${integration.redirectUri}`,
    scope: integration.scope,
    response_type: 'code',
    state: state
  });
  
  return `${integration.authUrl}?${params.toString()}`;
}

// Generic OAuth Routes for all integrations
app.get('/auth/:service', (req, res) => {
  const service = req.params.service;
  const integration = integrations[service];
  
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }
  
  if (!integration.clientId || integration.clientId.includes('your-')) {
    return res.json({
      error: `${integration.name} OAuth not configured`,
      message: `Please set up ${integration.name} OAuth credentials in your environment variables.`,
      setupRequired: true,
      setupGuide: getSetupGuide(service)
    });
  }
  
  try {
    const authUrl = generateOAuthUrl(integration);
    res.redirect(authUrl);
  } catch (error) {
    console.error(`OAuth error for ${service}:`, error);
    res.status(500).json({ error: 'OAuth setup failed' });
  }
});

// OAuth Callback Routes
app.get('/auth/:service/callback', async (req, res) => {
  const service = req.params.service;
  const { code, state } = req.query;
  const integration = integrations[service];
  
  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }
  
  // Verify state
  const stateData = oauthStates.get(state);
  if (!stateData || stateData.integration !== integration.name) {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(integration, code);
    
    // Store the token (in a real app, store in database)
    console.log(`${integration.name} OAuth successful:`, {
      accessToken: tokenResponse.access_token ? '***' : 'none',
      refreshToken: tokenResponse.refresh_token ? '***' : 'none',
      scope: tokenResponse.scope
    });
    
    // Clean up state
    oauthStates.delete(state);
    
    // Redirect to dashboard with success message
    res.redirect('/dashboard?integration=connected&service=' + service);
    
  } catch (error) {
    console.error(`OAuth callback error for ${service}:`, error);
    res.redirect('/dashboard?integration=error&service=' + service);
  }
});

// Integration configuration status endpoint
app.get('/api/integrations/:service/status', (req, res) => {
  const service = req.params.service;
  const integration = integrations[service];

  if (!integration) {
    return res.status(404).json({
      service,
      setupRequired: true,
      configured: false,
      message: 'Integration not found'
    });
  }

  const hasClientId = Boolean(
    integration.clientId &&
    !integration.clientId.toString().includes('your-')
  );

  const hasClientSecret = integration.clientSecret === undefined
    ? true
    : Boolean(
        integration.clientSecret &&
        !integration.clientSecret.toString().includes('your-')
      );

  const configured = hasClientId && hasClientSecret;

  res.json({
    service,
    configured,
    setupRequired: !configured
  });
});

// Exchange authorization code for access token
async function exchangeCodeForToken(integration, code) {
  const axios = require('axios');
  
  const tokenData = {
    client_id: integration.clientId,
    client_secret: integration.clientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: `${process.env.BASE_URL || 'http://localhost:3002'}${integration.redirectUri}`
  };
  
  const response = await axios.post(integration.tokenUrl, tokenData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }
  });
  
  return response.data;
}

// Get setup guide for each integration
function getSetupGuide(service) {
  const guides = {
    slack: 'https://api.slack.com/authentication/oauth-v2',
    microsoft: 'https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app',
    salesforce: 'https://help.salesforce.com/s/articleView?id=sf.connected_app_create.htm',
    hubspot: 'https://developers.hubspot.com/docs/api/working-with-oauth',
    zapier: 'https://zapier.com/developer/',
    trello: 'https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/',
    asana: 'https://developers.asana.com/docs/oauth',
    notion: 'https://developers.notion.com/docs/authorization',
    github: 'https://docs.github.com/en/developers/apps/building-oauth-apps'
  };
  
  return guides[service] || 'https://example.com/setup-guide';
}

// Google Services API Routes
app.get('/api/google/gmail/profile', async (req, res) => {
  try {
    if (!req.user || !req.user.accessToken) {
      return res.status(401).json({ error: 'Not authenticated with Google' });
    }

    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken
    });

    const gmailClient = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmailClient.users.getProfile({ userId: 'me' });
    
    res.json(profile.data);
  } catch (error) {
    console.error('Gmail profile error:', error);
    res.status(500).json({ error: 'Failed to fetch Gmail profile' });
  }
});

app.get('/api/google/gmail/messages', async (req, res) => {
  try {
    if (!req.user || !req.user.accessToken) {
      return res.status(401).json({ error: 'Not authenticated with Google' });
    }

    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken
    });

    const gmailClient = google.gmail({ version: 'v1', auth: oauth2Client });
    const messages = await gmailClient.users.messages.list({
      userId: 'me',
      maxResults: 10,
      q: req.query.q || 'in:inbox'
    });
    
    res.json(messages.data);
  } catch (error) {
    console.error('Gmail messages error:', error);
    res.status(500).json({ error: 'Failed to fetch Gmail messages' });
  }
});

app.post('/api/google/gmail/send', async (req, res) => {
  try {
    if (!req.user || !req.user.accessToken) {
      return res.status(401).json({ error: 'Not authenticated with Google' });
    }

    const { to, subject, body } = req.body;
    
    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken
    });

    const gmailClient = google.gmail({ version: 'v1', auth: oauth2Client });
    
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const result = await gmailClient.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });
    
    res.json({ success: true, messageId: result.data.id });
  } catch (error) {
    console.error('Gmail send error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.get('/api/google/calendar/events', async (req, res) => {
  try {
    if (!req.user || !req.user.accessToken) {
      return res.status(401).json({ error: 'Not authenticated with Google' });
    }

    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken
    });

    const calendarClient = google.calendar({ version: 'v3', auth: oauth2Client });
    const events = await calendarClient.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    res.json(events.data);
  } catch (error) {
    console.error('Calendar events error:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

app.post('/api/google/calendar/events', async (req, res) => {
  try {
    if (!req.user || !req.user.accessToken) {
      return res.status(401).json({ error: 'Not authenticated with Google' });
    }

    const { summary, start, end, description, attendees } = req.body;
    
    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken
    });

    const calendarClient = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const event = {
      summary,
      description,
      start: {
        dateTime: start,
        timeZone: 'UTC'
      },
      end: {
        dateTime: end,
        timeZone: 'UTC'
      },
      attendees: attendees ? attendees.split(',').map(email => ({ email: email.trim() })) : []
    };

    const result = await calendarClient.events.insert({
      calendarId: 'primary',
      requestBody: event
    });
    
    res.json({ success: true, event: result.data });
  } catch (error) {
    console.error('Calendar create event error:', error);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
});

// API Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/email', require('./routes/email'));
  app.use('/api/schedule', require('./routes/schedule'));
  app.use('/api/analytics', require('./routes/analytics'));
  app.use('/api/subscription', require('./routes/subscription'));
  console.log('✅ API routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading API routes:', error.message);
}

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Enhanced mock response for business context
      const mockResponse = generateBusinessMockResponse(message);
      return res.json({ 
        response: mockResponse,
        timestamp: new Date().toISOString()
      });
    }

    // Real OpenAI integration
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages = [
      {
        role: "system",
        content: "You are an AI Business Assistant that helps small business owners automate their emails, scheduling, and business tasks. You provide practical, actionable advice and can help with business automation, productivity, and efficiency. Always be helpful, professional, and focused on saving time and improving business operations."
      }
    ];

    // Add conversation history (limit to last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
    messages.push(...recentHistory);

    // Add current message
    messages.push({
      role: "user",
      content: message
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    res.json({ 
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback to mock response
    const mockResponse = generateBusinessMockResponse(req.body.message);
    res.json({ 
      response: mockResponse,
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced mock response generator for business context
function generateBusinessMockResponse(message) {
  const responses = {
    greeting: [
      "Hello! I'm your AI Business Assistant. I can help you automate emails, manage your schedule, and streamline your business tasks. What would you like to work on today?",
      "Hi there! I'm here to help you save time and automate your business processes. How can I assist you today?",
      "Welcome! I specialize in helping small businesses automate their operations. What business task would you like to tackle?"
    ],
    email: [
      "I can help you automate your email responses! I can create templates, set up auto-replies, and even draft responses based on your business context. What type of emails do you receive most often?",
      "Email automation is one of my specialties! I can help you set up smart responses, categorize incoming emails, and save you hours each week. What's your biggest email challenge?",
      "Let's streamline your email workflow! I can create personalized templates, automate follow-ups, and help you respond faster to customers. What emails take up most of your time?"
    ],
    schedule: [
      "I can help you manage your schedule more efficiently! I can sync with your calendar, find optimal meeting times, and even handle meeting confirmations automatically. What scheduling challenges are you facing?",
      "Smart scheduling is one of my key features! I can optimize your calendar, prevent double-bookings, and automate meeting preparations. How can I help improve your scheduling?",
      "Let's make your calendar work smarter! I can suggest optimal meeting times, send automatic confirmations, and help you manage your availability. What scheduling issues would you like to solve?"
    ],
    automation: [
      "I love helping businesses automate their processes! I can help you identify repetitive tasks, create automation workflows, and save you significant time each week. What tasks do you find yourself doing repeatedly?",
      "Business automation is my specialty! I can help you streamline workflows, reduce manual work, and focus on what matters most in your business. What processes would you like to automate?",
      "Let's automate your business operations! I can help you identify opportunities for automation and implement solutions that save time and reduce errors. What's your biggest time-waster?"
    ],
    default: [
      "That's a great question! As your AI Business Assistant, I can help with email automation, smart scheduling, business analytics, and process optimization. What specific area would you like to focus on?",
      "I'm here to help you streamline your business operations! I specialize in email automation, calendar management, and business process optimization. How can I assist you today?",
      "Let me help you work more efficiently! I can assist with automating emails, managing your schedule, analyzing business data, and optimizing your workflows. What would you like to tackle first?"
    ]
  };

  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  } else if (messageLower.includes('email') || messageLower.includes('inbox') || messageLower.includes('message')) {
    return responses.email[Math.floor(Math.random() * responses.email.length)];
  } else if (messageLower.includes('schedule') || messageLower.includes('calendar') || messageLower.includes('meeting')) {
    return responses.schedule[Math.floor(Math.random() * responses.schedule.length)];
  } else if (messageLower.includes('automate') || messageLower.includes('workflow') || messageLower.includes('process')) {
    return responses.automation[Math.floor(Math.random() * responses.automation.length)];
  } else {
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'AI Business Assistant'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Business Assistant server running on http://localhost:${PORT}`);
  console.log(`📝 Note: To enable real AI, configure OpenAI API key in .env`);
  console.log(`💼 Ready to help businesses automate their operations!`);
});

module.exports = app;
