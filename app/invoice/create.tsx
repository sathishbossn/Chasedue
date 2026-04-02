import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { supabase } from '@/lib/supabase';

interface InvoiceData {
  clientName: string;
  clientEmail: string;
  itemDescription: string;
  amount: string;
  dueDate: string;
  invoiceNumber: string;
}

function CreateInvoice() {
  const router = useRouter();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    clientName: '',
    clientEmail: '',
    itemDescription: '',
    amount: '',
    dueDate: '',
    invoiceNumber: `INV-${Date.now()}`,
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCancel = () => {
    console.log('Canceling invoice creation...');
    router.replace('/(tabs)/profile');
  };

  const generateInvoiceHTML = (data: InvoiceData) => {
    const currentDate = new Date().toLocaleDateString();
    const totalAmount = parseFloat(data.amount) || 0;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${data.invoiceNumber}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #ffffff;
            color: #1a1a1a;
            line-height: 1.6;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #f5f5f5;
          }
          .header {
            position: relative;
            padding: 40px 30px;
            text-align: center;
            background: #ffffff;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: #FF7043;
          }
          .logo {
            font-size: 2.8em;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: -1px;
            color: #1a1a1a;
          }
          .business-name {
            font-size: 1.4em;
            font-weight: 600;
            margin-bottom: 5px;
            color: #1a1a1a;
          }
          .tagline {
            font-size: 1em;
            color: #666;
            font-weight: 400;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            padding: 40px 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
          }
          .invoice-info h3, .client-info h3 {
            margin: 0 0 20px 0;
            color: #FF7043;
            font-size: 1.3em;
            font-weight: 600;
          }
          .invoice-info p, .client-info p {
            margin: 8px 0;
            font-size: 1.05em;
            line-height: 1.5;
            color: #333;
          }
          .items-section {
            padding: 40px 30px;
          }
          .section-title {
            font-size: 1.5em;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 25px;
            text-align: center;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: white;
            border: 1px solid #f5f5f5;
            border-radius: 8px;
            overflow: hidden;
          }
          .items-table th {
            background: #FF7043;
            color: white;
            padding: 18px 20px;
            text-align: left;
            font-weight: 600;
            font-size: 1.1em;
            letter-spacing: 0.5px;
          }
          .items-table td {
            padding: 20px;
            border-bottom: 1px solid #f5f5f5;
            font-size: 1.05em;
            line-height: 1.6;
            color: #333;
          }
          .items-table tr:last-child td {
            border-bottom: none;
          }
          .items-table tr:hover {
            background: #f8f9fa;
          }
          .amount-cell {
            text-align: right;
            font-weight: 600;
            font-size: 1.1em;
            color: #FF7043;
          }
          .total-section {
            text-align: right;
            padding: 30px 40px;
            background: #f8f9fa;
            border-top: 3px solid #FF7043;
          }
          .total-label {
            font-size: 1.2em;
            color: #666;
            margin-bottom: 8px;
            font-weight: 500;
          }
          .total-amount {
            font-size: 2.2em;
            font-weight: 800;
            color: #FF7043;
          }
          .footer {
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 0.95em;
            border-top: 1px solid #f5f5f5;
            background: #f8f9fa;
          }
          .footer p {
            margin: 5px 0;
            line-height: 1.5;
          }
          .footer .highlight {
            color: #FF7043;
            font-weight: 600;
          }
          @media print {
            body { padding: 0; }
            .invoice-container { box-shadow: none; border: 1px solid #ccc; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="logo">🥕 CarrotCash</div>
            <div class="business-name">A Sathish Kumar</div>
            <div class="tagline">Solopreneur & Data Analyst</div>
          </div>
          
          <div class="invoice-details">
            <div class="invoice-info">
              <h3>Invoice Details</h3>
              <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
              <p><strong>Date Issued:</strong> ${currentDate}</p>
              <p><strong>Due Date:</strong> ${data.dueDate}</p>
            </div>
            <div class="client-info">
              <h3>Bill To</h3>
              <p><strong>Client Name:</strong> ${data.clientName}</p>
              <p><strong>Email:</strong> ${data.clientEmail}</p>
            </div>
          </div>
          
          <div class="items-section">
            <h2 class="section-title">Invoice Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${data.itemDescription}</td>
                  <td class="amount-cell">₹${parseFloat(data.amount).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <div class="total-label">Total Due</div>
            <div class="total-amount">₹${totalAmount.toFixed(2)}</div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Invoice generated by <span class="highlight">CarrotCash</span></p>
            <p>Questions? Contact us at <span class="highlight">sathish@carrotcash.com</span></p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      
      const html = generateInvoiceHTML(invoiceData);
      
      await Print.printAsync({
        html,
        orientation: 'portrait',
        margins: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },
      });
      
      // Cinematic Success Feedback
      Alert.alert(
        '🎉 Invoice Ready for OMR Project!',
        'Your professional invoice has been generated successfully.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'View PDF', 
            onPress: () => {
              // Re-open the print preview
              Print.printAsync({
                html,
                orientation: 'portrait',
                margins: {
                  left: 20,
                  right: 20,
                  top: 20,
                  bottom: 20,
                },
              });
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert(
        'Error',
        'Failed to generate PDF. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    console.log('Saving...');
    
    // Validation
    if (!invoiceData.clientName.trim()) {
      Alert.alert('Error', 'Please enter client name');
      return;
    }
    
    if (!invoiceData.itemDescription.trim()) {
      Alert.alert('Error', 'Please enter item description');
      return;
    }
    
    if (!invoiceData.amount || parseFloat(invoiceData.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      setIsGenerating(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to create an invoice');
        return;
      }

      console.log('🔍 Looking up client:', invoiceData.clientName.trim());

      // Step A: Find or create client to get UUID
      let clientId: string | null = null;
      
      // First, check if client exists
      const { data: existingClient, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('name', invoiceData.clientName.trim())
        .eq('user_id', user.id)
        .single();

      if (clientError && clientError.code === 'PGRST116') {
        // Client doesn't exist, create it
        console.log('👤 Creating new client...');
        
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            name: invoiceData.clientName.trim(),
            email: invoiceData.clientEmail || null,
            user_id: user.id,
          })
          .select('id')
          .single();

        if (createError) {
          console.error('❌ Client creation error:', createError);
          Alert.alert('Database Error', `Client creation failed: ${createError.message}`);
          return;
        }

        clientId = newClient?.id || null;
        console.log('✅ Created new client with ID:', clientId);
      } else if (clientError) {
        console.error('❌ Client lookup error:', clientError);
        Alert.alert('Database Error', `Client lookup failed: ${clientError.message}`);
        return;
      } else {
        // Client exists
        clientId = existingClient?.id || null;
        console.log('✅ Found existing client with ID:', clientId);
      }

      if (!clientId) {
        Alert.alert('Database Error', 'Could not determine client ID');
        return;
      }

      // Step B: Format due_date as YYYY-MM-DD if provided
      let formattedDueDate = null;
      if (invoiceData.dueDate && invoiceData.dueDate.trim()) {
        // Try to parse and format the date
        const date = new Date(invoiceData.dueDate);
        if (!isNaN(date.getTime())) {
          formattedDueDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        }
      }

      // Step C: Insert invoice with exact schema keys (simplified)
      console.log('📝 Inserting invoice with client_id:', clientId);
      
      const { data: invoiceResult, error: insertError } = await supabase
        .from('invoices')
        .insert([{
          user_id: user.id,           // Current user's UUID
          client_id: clientId,        // The UUID we just found/created
          amount: parseFloat(invoiceData.amount),  // Numeric value from form
          due_date: formattedDueDate, // YYYY-MM-DD format or null
          status: 'pending',          // Fixed status
        }])
        .select('id')
        .single();

      if (insertError) {
        console.error('❌ Invoice insert error:', insertError);
        Alert.alert('Database Error', `Insert failed: ${insertError.message}`);
        return;
      }

      console.log('✅ Invoice saved with ID:', invoiceResult?.id);

      // Step D: Generate PDF
      console.log('📄 Generating PDF...');
      const html = generateInvoiceHTML(invoiceData);
      const { uri } = await Print.printToFileAsync({ html });

      // Step E: Share PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Invoice',
        });
      }

      // Step F: Success
      Alert.alert('Invoice Created!', `Invoice #${invoiceData.invoiceNumber} saved successfully!`);
      console.log('Success!');
      
    } catch (error) {
      console.error('❌ Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateField = (field: keyof InvoiceData, value: string) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <LinearGradient colors={['#1A1A1A', '#000000']} style={styles.gradientContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Invoice</Text>
          <Text style={styles.headerSubtitle}>Generate professional invoices instantly</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Client Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Client Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter client name"
                placeholderTextColor="#6b7280"
                value={invoiceData.clientName}
                onChangeText={(value) => updateField('clientName', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Client Email</Text>
              <TextInput
                style={styles.input}
                placeholder="client@example.com"
                placeholderTextColor="#6b7280"
                value={invoiceData.clientEmail}
                onChangeText={(value) => updateField('clientEmail', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Invoice Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the service or product"
                placeholderTextColor="#6b7280"
                value={invoiceData.itemDescription}
                onChangeText={(value) => updateField('itemDescription', value)}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#6b7280"
                value={invoiceData.amount}
                onChangeText={(value) => updateField('amount', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due Date</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#6b7280"
                value={invoiceData.dueDate}
                onChangeText={(value) => updateField('dueDate', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Invoice Number</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={invoiceData.invoiceNumber}
                editable={false}
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Cancel Button */}
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isGenerating}
            >
              <Ionicons name="close-outline" size={24} color="#ffffff" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            {/* Save & Generate PDF Button */}
            <TouchableOpacity 
              style={[styles.saveButton, isGenerating && styles.disabledButton]}
              onPress={handleSave}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={24} color="#ffffff" />
                  <Text style={styles.saveButtonText}>Save & Generate PDF</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated invoices can be shared via WhatsApp, Email, or other apps
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  
  // Header
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#5eead4',
    fontWeight: '500',
  },

  // Form
  formContainer: {
    marginBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#9ca3af',
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6b7280',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4b5563',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff7043',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ff5722',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
  },
  disabledButton: {
    backgroundColor: '#6b7280',
    borderColor: '#4b5563',
    shadowOpacity: 0,
    elevation: 0,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CreateInvoice;
