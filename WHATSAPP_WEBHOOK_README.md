# WhatsApp Webhook for CarrotCash

This Supabase Edge Function handles incoming WhatsApp messages and automatically categorizes expenses into CarrotCash or Kharcha projects.

## 🚀 Features

- **Webhook Verification**: Handles Meta's webhook verification with custom VERIFY_TOKEN
- **Message Parsing**: Extracts messages from specific phone number (9789654609)
- **Smart Routing**: Classifies messages using Gemini AI or keyword fallback
- **Database Sync**: Automatically inserts expenses into Supabase with project classification
- **WhatsApp Replies**: Sends confirmation messages back to users

## 📋 Setup Instructions

### 1. Prerequisites

- Supabase CLI installed: `npm install -g supabase`
- WhatsApp Business API setup with provided credentials
- Supabase project with required tables

### 2. Database Setup

Ensure your Supabase project has these tables:

```sql
-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  phone_number TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2),
  description TEXT,
  category TEXT,
  project_type TEXT, -- 'carrotcash' or 'kharcha'
  created_at TIMESTAMP DEFAULT NOW(),
  phone_number TEXT,
  message_id TEXT
);
```

### 3. Deploy the Webhook

```bash
# Make the deploy script executable
chmod +x deploy-webhook.sh

# Deploy the webhook
./deploy-webhook.sh
```

Or deploy manually:

```bash
supabase functions deploy whatsapp-webhook --no-verify-jwt
```

### 4. Configure WhatsApp Business API

1. **Webhook URL**: `https://[YOUR-PROJECT-REF].supabase.co/functions/v1/whatsapp-webhook`
2. **Verify Token**: `CarrotKharcha2026`
3. **Subscribe to**: `messages` field

## 🔧 Configuration

### WhatsApp Credentials (already configured)

```typescript
const APP_ID = '1660966971999576'
const PHONE_NUMBER_ID = '1040721029119915'
const WABA_ID = '2007019747361253'
const APP_SECRET = 'efbae2e844e1dec5e44fa2e16621ff8e'
const VERIFY_TOKEN = 'CarrotKharcha2026'
```

### Environment Variables

Set these in your Supabase project:

```bash
# Required (automatically set by Supabase)
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional (for enhanced AI classification)
GEMINI_API_KEY=your-gemini-api-key
```

## 📱 How It Works

### 1. Message Flow

1. User sends WhatsApp message to +919789654609
2. Meta sends webhook to your Supabase function
3. Function verifies webhook signature
4. Extracts message text and sender phone number
5. Classifies message using Gemini AI or keywords
6. Finds user profile in database
7. Inserts expense with project classification
8. Sends WhatsApp confirmation reply

### 2. Smart Classification

**Keyword-based (current)**:
- Contains "carrot", "work", or "client" → `project: carrotcash`
- Everything else → `project: kharcha`

**Gemini AI (optional enhancement)**:
- Sends message to Gemini for intelligent classification
- More nuanced understanding of context
- Can handle complex expense descriptions

### 3. Database Schema

```typescript
interface Expense {
  id: string
  user_id: string
  amount: number // Currently 0, can be enhanced
  description: string // Full message text
  category: string // "WhatsApp Expense"
  project_type: 'carrotcash' | 'kharcha'
  created_at: string
  phone_number: string
  message_id: string
}
```

## 🧪 Testing

### Test Webhook Verification

```bash
curl "https://[YOUR-PROJECT-REF].supabase.co/functions/v1/whatsapp-webhook?hub.mode=subscribe&hub.verify_token=CarrotKharcha2026&hub.challenge=test_challenge"
```

### Test Message Processing

Send a WhatsApp message to +919789654609:

- "Paid for client lunch" → Classified as `carrotcash`
- "Bought groceries" → Classified as `kharcha`

Expected reply: "Got it! Added to [Project Name] 🥕"

## 🔍 Monitoring

Check function logs:

```bash
supabase functions logs whatsapp-webhook
```

## 🚨 Troubleshooting

### Common Issues

1. **Webhook verification fails**
   - Check VERIFY_TOKEN matches exactly
   - Ensure webhook URL is accessible

2. **Messages not processed**
   - Verify phone number matches 9789654609
   - Check user profile exists in database

3. **WhatsApp replies not sent**
   - Verify access token is valid
   - Check PHONE_NUMBER_ID is correct

4. **Database errors**
   - Ensure tables exist with correct schema
   - Check user permissions

### Debug Mode

Add more logging by checking the Supabase function logs:

```bash
supabase functions logs whatsapp-webhook -n 50
```

## 🔄 Enhancements

### Future Improvements

1. **Amount Extraction**: Parse amounts from message text
2. **Category Detection**: Auto-categorize expenses
3. **Multiple Users**: Support multiple phone numbers
4. **Receipt Processing**: Handle image attachments
5. **Recurring Expenses**: Detect and set up recurring transactions

### Gemini AI Integration

To enable full Gemini AI classification:

1. Get Gemini API key from Google AI Studio
2. Set `GEMINI_API_KEY` environment variable
3. Uncomment the Gemini code in `classifyWithGemini()`

## 📞 Support

For issues with:
- **WhatsApp API**: Check Meta for Business documentation
- **Supabase Functions**: Check Supabase docs
- **CarrotCash**: Contact support team

---

**Built with ❤️ for CarrotCash users**
