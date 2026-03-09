# 🚀 Quick Start Guide - CTI Platform

## 📋 Step-by-Step Setup

### Step 1: Supabase Configuration ✅

The Edge Function is now properly configured as `/supabase/functions/make-server-4d23e959/`

### Step 2: Set API Keys (IMPORTANT) 🔑

Go to your **Supabase Dashboard** → **Settings** → **Edge Functions** and add these secrets:

```
VIRUSTOTAL_API_KEY     = your_virustotal_api_key
ABUSEIPDB_API_KEY      = your_abuseipdb_api_key  
QWEN_API_KEY           = your_qwen_ai_api_key
```

**Get Your API Keys:**
- **VirusTotal**: https://www.virustotal.com/gui/my-apikey
- **AbuseIPDB**: https://www.abuseipdb.com/account/api
- **Qwen AI**: https://dashscope.aliyun.com/ (Alibaba Cloud)

### Step 3: Create Test User (Optional) 👤

The platform will auto-deploy. After deployment, you can create a test user by calling:

```bash
POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-4d23e959/create-test-user
```

This creates:
- Email: `test@example.com`
- Password: `test123456`

### Step 4: Sign Up / Login 🔐

**Option A - Create New Account:**
1. Click **"Sign up"**
2. Enter any email (e.g., `demo@test.com`)
3. Password (min 6 chars)
4. Sign up, then login

**Option B - Use Test Account:**
```
Email:    test@example.com
Password: test123456
```

### Step 5: Run Your First Analysis 🔍

1. Navigate to **Dashboard**
2. Enter any threat indicator:
   - IP: `8.8.8.8`
   - Domain: `google.com`
   - URL: `https://example.com`
   - Hash: `5d41402abc4b2a76b9719d911017c592`
3. Click **"Analyze Threat"**
4. View comprehensive results!

## 🎯 What You Can Do

### 🔍 Unified Threat Analysis
Auto-detects and analyzes:
- IP addresses (IPv4/IPv6)
- Domains
- URLs
- File hashes (MD5, SHA1, SHA256)
- Subnets (CIDR notation)
- ASN numbers

### 📊 View Results
- Threat Level (Critical/High/Medium/Low)
- Total Alerts from security vendors
- Threat Distribution charts
- Security Vendor Analysis table
- AI-Generated comprehensive report
- Threat Correlation Engine with radar chart
- Prioritized Mitigation Actions

### 📥 Download Reports
- PDF format
- DOCX format
- Includes all analysis data

### 📜 History Page
- View all downloaded reports
- Re-download previous analyses
- Track your analysis history

### ⚙️ Settings
- Update your profile
- Change name
- Logout

### 📖 Documentation
- Complete flowchart
- Database ERD
- API documentation

## 🔧 Troubleshooting

### Can't Login?
- Create a new account first using Sign Up
- Or use test account: `test@example.com` / `test123456`
- Email verification is disabled for testing

### Analysis Not Working?
- Check that API keys are set in Supabase Dashboard
- Wait 30 seconds after setting keys
- Check browser console for errors
- Verify you're logged in

### 403 Deployment Error?
- Function is now correctly named `make-server-4d23e959`
- Should auto-deploy
- Check Supabase Dashboard → Edge Functions

### No Results?
- Verify API keys are correct
- Check quotas on VirusTotal/AbuseIPDB
- Try a different indicator
- Check Edge Function logs

## 📚 All Features

✅ **Intelligent Auto-Detection** - Automatically identifies indicator types
✅ **Multi-Source Analysis** - VirusTotal + AbuseIPDB correlation
✅ **AI-Powered Reports** - Comprehensive threat assessment
✅ **5-Dimensional Scoring** - Malware, Reputation, Network, Geographic, History
✅ **Priority-Based Mitigation** - Actionable security recommendations
✅ **Beautiful Visualizations** - Charts, graphs, and radar plots
✅ **Download Reports** - PDF and DOCX formats
✅ **Complete History** - Track all your analyses
✅ **Responsive Design** - Works on all devices
✅ **Secure Authentication** - JWT tokens and Supabase Auth

## 🎓 Example Analysis

**Input:** `8.8.8.8`

**Auto-Detection:** IP Address ✅

**Results:**
- Threat Level: LOW
- Total Alerts: 85 vendors
- High Alerts: 0 malicious
- Medium Alerts: 0 suspicious
- AI Analysis: "Google DNS server, widely trusted..."
- Mitigation: "No immediate action required"

## 📞 Support

### Check These Documents:
1. **DEPLOYMENT_FIX.md** - Edge Function deployment guide
2. **AUTHENTICATION_GUIDE.md** - Login/signup details
3. **UNIFIED_ANALYSIS_UPDATE.md** - Complete platform features
4. **FIXES_APPLIED.md** - What was fixed

### Common Issues:

**Q: How do I get API keys?**
A: See Step 2 above - links to each provider's API key page

**Q: Is it free?**
A: Supabase has a free tier. API keys have free quotas (limited requests).

**Q: Can I use my own data?**
A: Yes! All analyses are private to your account.

**Q: How accurate is the AI analysis?**
A: Uses Qwen AI trained on cybersecurity data, very accurate for threat assessment.

**Q: Can I export data?**
A: Yes! Download reports as PDF or DOCX from the results page.

## 🎉 You're Ready!

1. ✅ Set your API keys in Supabase
2. ✅ Sign up or use test account
3. ✅ Run your first threat analysis
4. ✅ Explore all features
5. ✅ Download your reports

**Happy threat hunting! 🛡️🔍**

---

## 🔗 Quick Links

- [VirusTotal](https://www.virustotal.com)
- [AbuseIPDB](https://www.abuseipdb.com)
- [Supabase Dashboard](https://app.supabase.com)
- [Qwen AI](https://dashscope.aliyun.com)

## 📈 Next Steps

After getting started:
1. Analyze multiple indicators
2. Compare different threat types
3. Download and share reports
4. Review correlation insights
5. Implement mitigation actions

Enjoy your new Cyber Threat Intelligence Platform! 🚀
