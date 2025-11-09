# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication and Google services integration for your AI Business Assistant.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Node.js and npm installed

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "AI Business Assistant"
4. Click "Create"

## Step 2: Enable Google APIs

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for and enable the following APIs:
   - **Gmail API**
   - **Google Calendar API**
   - **Google+ API** (for profile information)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set the following:
   - **Name**: AI Business Assistant
   - **Authorized JavaScript origins**: `http://localhost:3002`
   - **Authorized redirect URIs**: `http://localhost:3002/auth/google/callback`
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

## Step 4: Configure Environment Variables

1. Copy `config.env.example` to `config.env`
2. Add your Google OAuth credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3002/auth/google/callback
```

## Step 5: Test the Integration

1. Start your server:
   ```bash
   npm start
   ```

2. Open your browser and go to `http://localhost:3002`

3. Click "Login" or "Sign up with Google"

4. You should be redirected to Google's OAuth consent screen

5. After authorization, you'll be redirected back to the dashboard

## Step 6: Verify Google Services

Once logged in with Google, you can test the integrations:

### Gmail Integration
- Go to the dashboard
- Click "Add New Rule" in the Email Automation section
- Check "Use Gmail integration" - it should show "(Connected)"
- Create email rules that will work with your Gmail account

### Google Calendar Integration
- Click "Schedule Meeting" in the Smart Scheduling section
- Check "Add to Google Calendar" - it should show "(Connected)"
- Schedule a meeting - it will be added to your Google Calendar

## Features Available with Google Integration

### Gmail API
- ✅ Read Gmail messages
- ✅ Send emails through Gmail
- ✅ Access Gmail profile information
- ✅ Create email automation rules

### Google Calendar API
- ✅ Read calendar events
- ✅ Create new events
- ✅ Manage meeting attendees
- ✅ Schedule meetings with descriptions

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Make sure the redirect URI in Google Console matches exactly: `http://localhost:3002/auth/google/callback`

2. **"invalid_client" error**
   - Check that your Client ID and Client Secret are correct
   - Make sure they're properly set in your `config.env` file

3. **"access_denied" error**
   - The user denied permission during OAuth flow
   - Try the OAuth flow again and grant all permissions

4. **"insufficient_scope" error**
   - The requested scopes aren't enabled
   - Make sure Gmail API and Calendar API are enabled in Google Console

### Debug Mode

To see detailed logs, set the environment variable:
```bash
DEBUG=passport:*
npm start
```

## Production Deployment

For production deployment:

1. Update the redirect URIs in Google Console to include your production domain
2. Set `GOOGLE_CALLBACK_URL` to your production callback URL
3. Ensure your production server uses HTTPS
4. Update the session secret to a secure random string

## Security Notes

- Never commit your `config.env` file to version control
- Use environment variables in production
- Regularly rotate your OAuth credentials
- Monitor API usage in Google Cloud Console

## Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check the server logs for backend errors
3. Verify your Google Cloud Console configuration
4. Ensure all required APIs are enabled





