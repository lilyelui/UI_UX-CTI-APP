# API Setup Instructions

This Cyber Threat Intelligence platform requires API keys from three external services. Follow the instructions below to set them up.

## Required API Keys

### 1. VirusTotal API Key

**Purpose:** Analyze files, URLs, domains, and IP addresses for malware and threats

**Steps to obtain:**
1. Go to https://www.virustotal.com/
2. Create a free account or sign in
3. Navigate to your profile settings
4. Copy your API key from the API Key section
5. Add it to Supabase environment variables as `VIRUSTOTAL_API_KEY`

**Free Tier Limits:**
- 500 requests per day
- 4 requests per minute

### 2. AbuseIPDB API Key

**Purpose:** Check IP address reputation and abuse reports

**Steps to obtain:**
1. Go to https://www.abuseipdb.com/
2. Create a free account or sign in
3. Navigate to Account > API
4. Generate a new API key
5. Add it to Supabase environment variables as `ABUSEIPDB_API_KEY`

**Free Tier Limits:**
- 1,000 requests per day

### 3. Qwen AI API Key (Alibaba Cloud DashScope)

**Purpose:** Generate comprehensive AI-powered threat analysis reports

**Steps to obtain:**
1. Go to https://dashscope.aliyun.com/
2. Create an Alibaba Cloud account (may require verification)
3. Navigate to DashScope console
4. Generate an API key
5. Add it to Supabase environment variables as `QWEN_API_KEY`

**Note:** You may need to add credits to your Alibaba Cloud account to use the API

## Adding API Keys to Supabase

1. Go to your Supabase project dashboard at https://supabase.com/dashboard
2. Navigate to Project Settings > Edge Functions
3. Scroll to "Secrets" section
4. Add each of the three API keys:
   - Key: `VIRUSTOTAL_API_KEY`, Value: [your VirusTotal API key]
   - Key: `ABUSEIPDB_API_KEY`, Value: [your AbuseIPDB API key]
   - Key: `QWEN_API_KEY`, Value: [your Qwen AI API key]

## Testing the Setup

1. Log in to the platform
2. Navigate to the Dashboard
3. Try analyzing a known malicious hash (example: `44d88612fea8a8f36de82e1278abb02f`)
4. If configured correctly, you should see:
   - VirusTotal analysis results
   - Vendor detections
   - Threat level assessment
   - AI-generated report

## Google OAuth Setup (Optional)

To enable "Sign in with Google":

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Follow the instructions at: https://supabase.com/docs/guides/auth/social-login/auth-google
5. You'll need to:
   - Create a Google Cloud Project
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add the credentials to Supabase

## Troubleshooting

**Error: "API key not configured"**
- Make sure you've added all three API keys to Supabase Secrets
- Ensure the key names match exactly (case-sensitive)
- Redeploy your Edge Functions after adding secrets

**Error: "Quota exceeded"**
- Check your API usage limits
- Consider upgrading to paid tiers for higher limits
- Wait for quota reset (usually daily)

**Error: "Invalid API key"**
- Verify the API key is correct
- Check if the API key has been revoked
- Generate a new API key if needed

## Security Notes

- Never commit API keys to code
- API keys are stored securely in Supabase environment variables
- Keys are only accessible server-side, never exposed to the frontend
- Rotate your API keys periodically for security
