#!/bin/bash

echo "🚀 Deploying WhatsApp Webhook for CarrotCash..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Deploy the function
echo "📦 Deploying whatsapp-webhook function..."
supabase functions deploy whatsapp-webhook --no-verify-jwt

if [ $? -eq 0 ]; then
    echo "✅ WhatsApp webhook deployed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Configure your WhatsApp Business API webhook URL to:"
    echo "   https://[YOUR-PROJECT-REF].supabase.co/functions/v1/whatsapp-webhook"
    echo ""
    echo "2. Set the VERIFY_TOKEN to: CarrotKharcha2026"
    echo ""
    echo "3. Test the webhook by sending a message to +919789654609"
    echo ""
    echo "🔧 Environment variables needed:"
    echo "- SUPABASE_URL (automatically set)"
    echo "- SUPABASE_SERVICE_ROLE_KEY (automatically set)"
    echo "- GEMINI_API_KEY (optional, for enhanced classification)"
else
    echo "❌ Deployment failed. Please check the error above."
    exit 1
fi
