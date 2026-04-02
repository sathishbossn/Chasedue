import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { APP_NAME } from '../../../src/constants/BrandConfig.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// WhatsApp credentials
const APP_ID = '1660966971999576'
const PHONE_NUMBER_ID = '1040721029119915'
const WABA_ID = '2007019747361253'
const APP_SECRET = 'efbae2e844e1dec5e44fa2e16621ff8e'
const VERIFY_TOKEN = 'CarrotKharcha2026'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    
    // Handle webhook verification (GET request)
    if (req.method === 'GET') {
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      console.log('Webhook verification attempt:', { mode, token, challenge })

      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified successfully')
        return new Response(challenge, {
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
          status: 200
        })
      } else {
        console.log('Webhook verification failed:', { mode, token, expected: VERIFY_TOKEN })
        return new Response('Verification failed', { status: 403 })
      }
    }

    // Handle incoming messages (POST request)
    if (req.method === 'POST') {
      const body = await req.json()
      console.log('Received webhook payload:', JSON.stringify(body, null, 2))

      // Verify webhook signature
      const signature = req.headers.get('x-hub-signature-256')
      if (signature) {
        const [algorithm, signatureHash] = signature.split('=')
        if (algorithm !== 'sha256') {
          console.log('Unsupported signature algorithm:', algorithm)
          return new Response('Unsupported signature algorithm', { status: 400 })
        }

        // Note: In production, you should verify the signature here
        // For now, we'll proceed without signature verification for testing
      }

      // Extract message from webhook payload
      const entry = body.entry?.[0]
      if (!entry) {
        console.log('No entry found in webhook payload')
        return new Response('No entry found', { status: 400 })
      }

      const changes = entry.changes?.[0]
      if (!changes) {
        console.log('No changes found in webhook payload')
        return new Response('No changes found', { status: 400 })
      }

      const messages = changes.value?.messages
      if (!messages || messages.length === 0) {
        console.log('No messages found in webhook payload')
        return new Response('No messages found', { status: 200 })
      }

      // Process each message
      for (const message of messages) {
        await processMessage(message)
      }

      return new Response('Message processed', {
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
        status: 200
      })
    }

    return new Response('Method not allowed', { status: 405 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

async function processMessage(message: any) {
  try {
    // Extract message details
    const from = message.from // Phone number
    const messageText = message.text?.body || ''
    const messageId = message.id
    const timestamp = message.timestamp

    console.log('Processing message:', { from, messageText, messageId, timestamp })

    // Only process messages from the specific phone number
    if (from !== '9789654609') {
      console.log('Ignoring message from unrecognized number:', from)
      return
    }

    // Smart Router - Send to Gemini for classification
    const projectType = await classifyWithGemini(messageText)
    console.log('Gemini classification result:', projectType)

    // Database Sync - Find user profile and insert expense
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Find user profile by phone number
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('phone_number', from)
      .single()

    if (userError || !userProfile) {
      console.log('User profile not found for phone:', from)
      await sendWhatsAppReply(from, `Sorry, I couldn't find your profile. Please make sure you're registered with ${APP_NAME}.`)
      return
    }

    // Insert expense into database
    const expenseData = {
      user_id: userProfile.user_id,
      amount: 0, // Default amount, can be enhanced to extract from message
      description: messageText,
      category: 'WhatsApp Expense',
      project_type: projectType,
      created_at: new Date().toISOString(),
      phone_number: from,
      message_id: messageId
    }

    const { data: expense, error: expenseError } = await supabase
      .from('expenses')
      .insert(expenseData)
      .select()
      .single()

    if (expenseError) {
      console.error('Error inserting expense:', expenseError)
      await sendWhatsAppReply(from, 'Sorry, I had trouble saving your expense. Please try again.')
      return
    }

    console.log('Expense inserted successfully:', expense)

    // Send confirmation reply
    const projectName = projectType === 'carrotcash' ? APP_NAME : 'Kharcha'
    const replyMessage = `Got it! Added to ${projectName} 🥕`
    await sendWhatsAppReply(from, replyMessage)

  } catch (error) {
    console.error('Error processing message:', error)
  }
}

async function classifyWithGemini(messageText: string): Promise<'carrotcash' | 'kharcha'> {
  try {
    // Simple keyword-based classification as fallback
    const lowerText = messageText.toLowerCase()
    
    if (lowerText.includes('carrot') || lowerText.includes('work') || lowerText.includes('client')) {
      return 'carrotcash'
    }
    
    return 'kharcha'
    
    // Note: In a production environment, you would integrate with Gemini API here:
    /*
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Classify this message as either 'carrotcash' or 'kharcha'. If it mentions carrot, work, or client, classify as 'carrotcash'. Otherwise, classify as 'kharcha'. Message: "${messageText}"`
          }]
        }]
      })
    })
    
    const result = await response.json()
    const classification = result.candidates[0].content.parts[0].text.toLowerCase().trim()
    return classification === 'carrotcash' ? 'carrotcash' : 'kharcha'
    */
  } catch (error) {
    console.error('Error classifying with Gemini:', error)
    return 'kharcha' // Default fallback
  }
}

async function sendWhatsAppReply(to: string, message: string) {
  try {
    console.log('Sending WhatsApp reply:', { to, message })

    // Get WhatsApp access token
    const accessToken = await getWhatsAppAccessToken()
    
    if (!accessToken) {
      console.error('Failed to get WhatsApp access token')
      return
    }

    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      text: {
        body: message
      }
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to send WhatsApp reply:', error)
      return
    }

    const result = await response.json()
    console.log('WhatsApp reply sent successfully:', result)

  } catch (error) {
    console.error('Error sending WhatsApp reply:', error)
  }
}

async function getWhatsAppAccessToken(): Promise<string | null> {
  try {
    // In production, you would store and refresh the access token properly
    // For now, we'll use a temporary token or app access token
    
    const response = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&grant_type=client_credentials`)
    
    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to get access token:', error)
      return null
    }

    const data = await response.json()
    return data.access_token

  } catch (error) {
    console.error('Error getting WhatsApp access token:', error)
    return null
  }
}
