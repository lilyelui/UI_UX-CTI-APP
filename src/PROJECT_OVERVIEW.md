# Cyber Threat Intelligence Platform - Project Overview

## 🎯 Project Summary

A full-stack, real-time Cyber Threat Intelligence platform built with React, TypeScript, Tailwind CSS, Supabase (PostgreSQL), and integrating three external threat intelligence APIs.

## 🏗️ Architecture

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: Custom component library (shadcn/ui based)
- **Charts**: Recharts for data visualization
- **State Management**: React hooks
- **Authentication**: Supabase Auth with email/password and Google OAuth

### Backend
- **Runtime**: Deno (via Supabase Edge Functions)
- **Framework**: Hono (Express-like web framework)
- **Database**: Supabase PostgreSQL (using KV store)
- **Real-time**: Supabase real-time subscriptions (via WebSocket)
- **Authentication**: Supabase Auth

### External APIs
1. **VirusTotal API** - File, URL, domain, and IP threat analysis
2. **AbuseIPDB API** - IP reputation and abuse reporting
3. **Qwen AI API** - AI-powered threat analysis report generation

## 📁 Project Structure

```
/
├── App.tsx                          # Main application component with routing
├── components/
│   ├── LoginPage.tsx               # Email/Google authentication
│   ├── SignupPage.tsx              # User registration
│   ├── DashboardPage.tsx           # Main threat analysis interface
│   ├── HistoryPage.tsx             # Download history management
│   ├── SettingsPage.tsx            # User profile and settings
│   ├── ExampleQueries.tsx          # Sample queries for testing
│   └── ui/                         # Reusable UI components
├── supabase/functions/server/
│   ├── index.tsx                   # Main server with API routes
│   ├── threat-analysis.tsx         # External API integrations
│   └── kv_store.tsx                # Database utility (protected)
├── utils/supabase/
│   └── info.tsx                    # Supabase configuration (auto-generated)
├── styles/
│   └── globals.css                 # Global styles and typography
├── README_API_SETUP.md             # API key setup instructions
└── PROJECT_OVERVIEW.md             # This file
```

## 🔐 Authentication Flow

1. **User Registration** (`/signup`)
   - Email/password or Google OAuth
   - Server-side user creation via Supabase Admin API
   - Auto-confirmation (email server not configured)

2. **User Login** (`/login`)
   - Email/password or Google OAuth
   - Session management via Supabase Auth
   - Access token stored in React state

3. **Session Persistence**
   - Automatic session check on app load
   - Tokens used for all protected API calls

## 🚀 Key Features

### Dashboard Page
1. **Threat Analysis Form**
   - Input types: Hash, Domain, IP Address, URL
   - Real-time analysis via VirusTotal and AbuseIPDB
   - AI-generated comprehensive reports

2. **Threat Metrics**
   - Threat level indicator (High/Medium/Low)
   - Total alerts counter
   - High/Medium alert breakdown
   - Visual charts (Pie & Bar)

3. **Analysis Results**
   - Security vendor detections table
   - IP reputation data (for IP analysis)
   - AI-generated threat report
   - Mitigation action recommendations

4. **Report Download**
   - PDF and DOCX format options
   - Automatic history logging
   - Re-downloadable from history

### History Page
- Table of all downloaded reports
- Timestamp tracking
- Re-download functionality
- User-specific history (multi-tenant)

### Settings Page
- User profile management
- API configuration status
- Logout functionality

## 🔌 API Endpoints

### Server Routes (Supabase Edge Functions)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/make-server-4d23e959/health` | Health check | No |
| POST | `/make-server-4d23e959/signup` | Create new user | No |
| POST | `/make-server-4d23e959/analyze` | Analyze threat | Yes |
| POST | `/make-server-4d23e959/history` | Save download history | Yes |
| GET | `/make-server-4d23e959/history` | Get download history | Yes |
| GET | `/make-server-4d23e959/analysis/:id` | Get analysis by ID | Yes |
| PUT | `/make-server-4d23e959/profile` | Update user profile | Yes |

## 🗄️ Data Models

### Analysis Data
```typescript
{
  analysisId: string;           // Unique identifier
  userId: string;               // User who performed analysis
  type: 'hash' | 'domain' | 'ip' | 'url';
  value: string;                // Analyzed value
  vtData: object;               // VirusTotal response
  abuseData: object | null;     // AbuseIPDB response (IP only)
  aiAnalysis: string;           // AI-generated report
  timestamp: string;            // ISO date string
}
```

### History Data
```typescript
{
  historyId: string;            // Unique identifier
  userId: string;               // User who downloaded
  analysisId: string;           // Reference to analysis
  fileName: string;             // Downloaded file name
  format: 'pdf' | 'docx';       // File format
  downloadedAt: string;         // ISO date string
}
```

## 🔧 Setup Instructions

### 1. API Keys Required
Set these in Supabase Dashboard > Edge Functions > Secrets:
- `VIRUSTOTAL_API_KEY`
- `ABUSEIPDB_API_KEY`
- `QWEN_API_KEY`

See `README_API_SETUP.md` for detailed instructions.

### 2. Google OAuth (Optional)
To enable Google sign-in:
1. Configure in Supabase Dashboard > Auth > Providers
2. Follow: https://supabase.com/docs/guides/auth/social-login/auth-google

### 3. Testing
Use the example queries provided in the dashboard:
- **Hash**: `44d88612fea8a8f36de82e1278abb02f` (EICAR test file)
- **Domain**: `google.com`
- **IP**: `8.8.8.8`
- **URL**: `https://www.virustotal.com`

## 🎨 Design Features

### Responsive Layout
- Collapsible sidebar navigation
- Mobile-friendly interface
- Adaptive grid layouts

### Dark Mode Support
- Automatic theme detection
- Consistent color scheme
- Enhanced readability

### Visual Components
- Interactive charts (Pie, Bar)
- Data tables with sorting
- Status badges and alerts
- Progress indicators

## 🔒 Security Considerations

### Best Practices Implemented
1. API keys stored server-side only (never exposed to frontend)
2. User authentication required for all sensitive operations
3. Access tokens validated on each request
4. User-specific data isolation (multi-tenant)
5. CORS enabled for frontend access

### Important Notes
- This is a **prototype/learning platform**, not production-ready
- Do not store highly sensitive data
- Rotate API keys regularly
- Consider additional security measures for production use

## 🚦 Status Indicators

The platform provides real-time feedback:
- **Loading states**: Spinners during async operations
- **Error handling**: Toast notifications for failures
- **Success messages**: Confirmation toasts
- **API status**: Configuration warnings

## 📊 Data Visualization

### Chart Types
1. **Pie Chart**: Threat distribution across categories
2. **Bar Chart**: Detection statistics by category
3. **Tables**: Vendor results and IP reputation data

### Metrics Displayed
- Threat level assessment
- Malicious/Suspicious/Harmless/Undetected counts
- Abuse confidence scores
- Country and ISP information

## 🛠️ Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Backend | Deno, Hono, Supabase Edge Functions |
| Database | Supabase PostgreSQL (KV Store) |
| Auth | Supabase Auth (Email + OAuth) |
| Real-time | Supabase WebSocket subscriptions |
| Charts | Recharts |
| UI Components | Custom component library |
| External APIs | VirusTotal, AbuseIPDB, Qwen AI |

## 📝 Next Steps for Production

If you want to deploy this for production use:

1. **Database Schema**: Create proper tables instead of using KV store
2. **Rate Limiting**: Implement API rate limiting
3. **Caching**: Cache API responses to reduce costs
4. **Error Monitoring**: Add Sentry or similar
5. **Analytics**: Track usage patterns
6. **Email Notifications**: Set up email server for alerts
7. **Role-Based Access**: Add admin/user roles
8. **Audit Logs**: Track all security actions
9. **Data Retention**: Implement automatic cleanup policies
10. **CI/CD**: Set up automated testing and deployment

## 🐛 Troubleshooting

### Common Issues

**"API key not configured"**
- Add API keys to Supabase Secrets
- Ensure exact key names match
- Redeploy Edge Functions

**"Unauthorized" errors**
- Check if user is logged in
- Verify access token is being sent
- Check token hasn't expired

**"Quota exceeded"**
- Free tier limits reached
- Wait for daily reset
- Consider upgrading API plans

**No analysis results**
- Verify API keys are valid
- Check API service status
- Review browser console for errors

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [VirusTotal API](https://developers.virustotal.com/reference)
- [AbuseIPDB API](https://www.abuseipdb.com/api.html)
- [Qwen AI (DashScope)](https://dashscope.aliyun.com/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🙏 Important Disclaimer

This platform is designed for **educational and prototyping purposes**. For production threat intelligence systems:

- Use enterprise-grade security measures
- Implement comprehensive logging and monitoring
- Follow compliance requirements (GDPR, SOC2, etc.)
- Conduct security audits
- Have incident response procedures
- Work with cybersecurity professionals

---

**Built with Figma Make** - A rapid prototyping platform for web applications
