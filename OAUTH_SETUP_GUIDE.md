# OAuth Integration Setup Guide

This guide will help you set up OAuth credentials for all supported integrations in the AI Business Assistant.

## Quick Start

1. Copy `config.env.example` to `config.env`
2. Follow the setup instructions for each integration you want to use
3. Add the credentials to your `config.env` file
4. Restart the server

## Integration Setup Instructions

### 1. Google (Gmail & Calendar)

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API and Google Calendar API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add redirect URI: `http://localhost:3002/auth/google/callback`
7. Copy Client ID and Client Secret

**Environment Variables:**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Slack

**Setup Steps:**
1. Go to [Slack API](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Enter app name and select workspace
4. Go to "OAuth & Permissions"
5. Add redirect URL: `http://localhost:3002/auth/slack/callback`
6. Add scopes: `channels:read`, `chat:write`, `users:read`, `team:read`
7. Install app to workspace
8. Copy Client ID and Client Secret

**Environment Variables:**
```
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
```

### 3. Microsoft (Teams & Outlook)

**Setup Steps:**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Set redirect URI: `http://localhost:3002/auth/microsoft/callback`
5. Go to "API permissions" → Add Microsoft Graph permissions:
   - User.Read
   - Mail.Read
   - Calendars.ReadWrite
6. Go to "Certificates & secrets" → Create new client secret
7. Copy Application (client) ID and Client Secret

**Environment Variables:**
```
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

### 4. Salesforce

**Setup Steps:**
1. Go to [Salesforce Setup](https://login.salesforce.com/)
2. Navigate to "Setup" → "App Manager"
3. Click "New Connected App"
4. Fill in basic information
5. Enable OAuth Settings
6. Add callback URL: `http://localhost:3002/auth/salesforce/callback`
7. Select OAuth scopes: "Access and manage your data (api)"
8. Save and copy Consumer Key and Consumer Secret

**Environment Variables:**
```
SALESFORCE_CLIENT_ID=your-salesforce-client-id
SALESFORCE_CLIENT_SECRET=your-salesforce-client-secret
```

### 5. HubSpot

**Setup Steps:**
1. Go to [HubSpot Developer Portal](https://developers.hubspot.com/)
2. Create a new app
3. Go to "Auth" tab
4. Add redirect URL: `http://localhost:3002/auth/hubspot/callback`
5. Select scopes: "contacts", "deals", "tickets"
6. Copy Client ID and Client Secret

**Environment Variables:**
```
HUBSPOT_CLIENT_ID=your-hubspot-client-id
HUBSPOT_CLIENT_SECRET=your-hubspot-client-secret
```

### 6. Zapier

**Setup Steps:**
1. Go to [Zapier Developer Platform](https://zapier.com/developer/)
2. Create a new app
3. Go to "Authentication" → "OAuth v2"
4. Add redirect URL: `http://localhost:3002/auth/zapier/callback`
5. Set scopes: "zaps:read", "zaps:write"
6. Copy Client ID and Client Secret

**Environment Variables:**
```
ZAPIER_CLIENT_ID=your-zapier-client-id
ZAPIER_CLIENT_SECRET=your-zapier-client-secret
```

### 7. Trello

**Setup Steps:**
1. Go to [Trello Developer Portal](https://developer.atlassian.com/cloud/trello/)
2. Create a new app
3. Add redirect URL: `http://localhost:3002/auth/trello/callback`
4. Set scopes: "read", "write"
5. Copy API Key and API Secret

**Environment Variables:**
```
TRELLO_CLIENT_ID=your-trello-client-id
TRELLO_CLIENT_SECRET=your-trello-client-secret
```

### 8. Asana

**Setup Steps:**
1. Go to [Asana Developer Console](https://app.asana.com/0/developer-console)
2. Create a new app
3. Add redirect URL: `http://localhost:3002/auth/asana/callback`
4. Set scopes: "default"
5. Copy Client ID and Client Secret

**Environment Variables:**
```
ASANA_CLIENT_ID=your-asana-client-id
ASANA_CLIENT_SECRET=your-asana-client-secret
```

### 9. Notion

**Setup Steps:**
1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Create a new integration
3. Add redirect URL: `http://localhost:3002/auth/notion/callback`
4. Set scopes: "read"
5. Copy Client ID and Client Secret

**Environment Variables:**
```
NOTION_CLIENT_ID=your-notion-client-id
NOTION_CLIENT_SECRET=your-notion-client-secret
```

### 10. GitHub

**Setup Steps:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Add redirect URL: `http://localhost:3002/auth/github/callback`
4. Set scopes: "user:email", "repo"
5. Copy Client ID and Client Secret

**Environment Variables:**
```
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Testing Integrations

1. Start the server: `npm start`
2. Go to `http://localhost:3002`
3. Login to the dashboard
4. Navigate to the "Integrations" section
5. Click "Connect" on any integration
6. Follow the OAuth flow
7. Verify the integration shows as "Connected"

## Troubleshooting

### Common Issues

**"OAuth not configured" error:**
- Make sure you've added the credentials to `config.env`
- Restart the server after adding credentials
- Check that the environment variables are correctly named

**"Invalid redirect URI" error:**
- Ensure the redirect URI in your OAuth app matches exactly: `http://localhost:3002/auth/[service]/callback`
- Check for typos in the URL

**"Invalid client" error:**
- Verify the Client ID and Client Secret are correct
- Make sure the OAuth app is properly configured
- Check that the app is published/activated if required

**"Scope not granted" error:**
- Ensure you've requested the correct scopes in your OAuth app
- Some services require manual approval for certain scopes

### Getting Help

- Check the individual service documentation links provided in the setup modals
- Review the server logs for detailed error messages
- Ensure your OAuth app has the correct permissions and scopes

## Security Notes

- Never commit your `config.env` file to version control
- Use strong, unique secrets for each integration
- Regularly rotate your OAuth credentials
- Monitor your OAuth app usage and permissions





