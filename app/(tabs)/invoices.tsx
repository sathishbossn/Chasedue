import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, StyleSheet,
  ActivityIndicator, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_NAME } from '../../src/constants/BrandConfig';
import { getValidSession, supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { InvoicesSkeleton } from '../../components/SkeletonLoader';

const PRIMARY = '#d97757';

interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  reminder_count: number;
  last_chased_at?: string;
  // Joined client data
  client_name?: string;
  client_email?: string;
}

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    amount: '',
    description: '',
    due_date: '',
  });

  const { session } = useAuth();

  useEffect(() => {
    if (session?.user?.id) {
      fetchInvoices();
    }
  }, [session?.user?.id]);

  const fetchInvoices = async () => {
    const session = await getValidSession()
    if (!session) {
      router.replace('/login')
      return
    }

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', session.user.id)
      .order('due_date', { ascending: false })

    if (error) {
      console.error('Invoices error:', error)
      Alert.alert('Error', `Failed to load invoices: ${error.message}`);
      return
    }
    setInvoices(data ?? [])
    setLoading(false);
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const handleCreate = async () => {
    if (!form.client_name || !form.amount || !form.due_date) {
      Alert.alert('Error', 'Please fill in client name, amount and due date');
      return;
    }
    
    // Parse amount - strip ₹ symbol and commas, handle Indian number format
    const cleanAmount = form.amount
      .replace(/[₹$,]/g, '')  // Remove currency symbols and commas
      .trim();
    
    const parsedAmount = Number(cleanAmount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setSaving(true);
    try {
      const session = await getValidSession()
      if (!session) {
        router.replace('/login')
        return
      }

      // First try to find existing client
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('name', form.client_name.trim())
        .eq('user_id', session.user.id)
        .single()

      let clientId = existing?.id

      // Only create if not found
      if (!clientId) {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({ 
            name: form.client_name.trim(),
            email: form.client_email.trim() || null,
            user_id: session.user.id,
            freelancer_id: session.user.id
          })
          .select('id')
          .single()

        if (clientError) {
          throw new Error(`Failed to create client: ${clientError.message}`);
        }
        clientId = newClient.id
      }

      // Now create invoice with clientId
      const { data: invoiceData, error: invoiceError } = await supabase.from('invoices').insert({
        user_id: session.user.id,
        client_id: clientId,
        amount: parsedAmount,
        due_date: form.due_date || null,
        status: 'pending',
      }).select('id').single();

      if (invoiceError) {
        throw new Error(`Invoice creation failed: ${invoiceError.message}`);
      }

      Alert.alert('Success', 'Invoice created successfully!');
      setShowModal(false);
      setForm({ client_name: '', client_email: '', amount: '', description: '', due_date: '' });
      fetchInvoices();
    } catch (error: any) {
      console.error('Full error:', JSON.stringify(error, null, 2));
      console.error('Error creating invoice:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      Alert.alert('Error', `Failed to create invoice: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: Invoice['status']) => {
    try {
      console.log('🔍 handleStatusChange: Checking session...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('❌ handleStatusChange: No session token');
        Alert.alert('Error', 'Authentication required - please sign in again');
        return;
      }
      
      console.log('✅ handleStatusChange: Token exists, updating status...');
      const { error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      fetchInvoices();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Invoice', 'Are you sure you want to delete this invoice?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            console.log('🔍 handleDelete: Checking session...');
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
              console.error('❌ handleDelete: No session token');
              Alert.alert('Error', 'Authentication required - please sign in again');
              return;
            }
            
            console.log('✅ handleDelete: Token exists, deleting invoice...');
            const { error } = await supabase.from('invoices').delete().eq('id', id);
            if (error) throw error;
            fetchInvoices();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        }
      }
    ]);
  };

  const generatePDF = async (invoice: Invoice) => {
    setGeneratingPdf(invoice.id);
    try {
      const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const issueDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const dueDate = invoice.due_date 
        ? new Date(invoice.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'On Receipt';
      const amount = Number(invoice.amount);
      const gst = amount * 0.18;
      const total = amount + gst;

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1A1A1A; background: #fff; padding: 48px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; border-bottom: 3px solid #FF006E; padding-bottom: 24px; }
    .brand { font-size: 28px; font-weight: 900; color: #FF006E; }
    .brand-sub { font-size: 12px; color: #888; margin-top: 4px; }
    .invoice-label { text-align: right; }
    .invoice-label h1 { font-size: 32px; font-weight: 800; color: #1A1A1A; }
    .invoice-label p { font-size: 14px; color: #888; margin-top: 4px; }
    .invoice-number { font-size: 16px; font-weight: 700; color: #FF006E; margin-top: 8px; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .party h3 { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .party p { font-size: 15px; color: #1A1A1A; margin-bottom: 4px; }
    .party .name { font-size: 18px; font-weight: 700; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    .items-table thead tr { background: #FF006E; color: white; }
    .items-table thead th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 700; }
    .items-table tbody tr { border-bottom: 1px solid #F0F0F0; }
    .items-table tbody td { padding: 14px 16px; font-size: 14px; }
    .items-table tbody tr:nth-child(even) { background: #FAFAFA; }
    .totals { display: flex; justify-content: flex-end; }
    .totals-box { width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #F0F0F0; }
    .totals-row.total { font-size: 18px; font-weight: 800; color: #FF006E; border-bottom: none; padding-top: 12px; }
    .status-badge { display: inline-block; background: ${invoice.status === 'paid' ? '#22C55E' : invoice.status === 'overdue' ? '#EF4444' : '#F59E0B'}; color: white; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
    .footer { margin-top: 60px; padding-top: 24px; border-top: 1px solid #EEEEEE; text-align: center; color: #888; font-size: 12px; }
    .footer strong { color: #FF006E; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">🥕 CarrotCash</div>
      <div class="brand-sub">Professional Finance for Indian Solopreneurs</div>
    </div>
    <div class="invoice-label">
      <h1>INVOICE</h1>
      <p>Issue Date: ${issueDate}</p>
      <p>Due Date: ${dueDate}</p>
      <div class="invoice-number">${invoiceNumber}</div>
      <div class="status-badge">${invoice.status}</div>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>Billed By</h3>
      <p class="name">A. Sathish Kumar</p>
      <p>CarrotCash</p>
      <p>Chennai, Tamil Nadu</p>
      <p>India</p>
    </div>
    <div class="party" style="text-align: right;">
      <h3>Billed To</h3>
      <p class="name">${invoice.client_name || 'Client'}</p>
      ${invoice.client_email ? `<p>${invoice.client_email}</p>` : ''}
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Professional Services</td>
        <td>₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="totals-row">
        <span>GST @ 18%</span>
        <span>₹${gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="totals-row total">
        <span>Total</span>
        <span>₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Generated by <strong>CarrotCash</strong> — Professional Finance for Indian Solopreneurs</p>
    <p>© ${new Date().getFullYear()} CarrotCash. Built by A. Sathish Kumar, Chennai.</p>
  </div>
</body>
</html>`;

      if (Platform.OS === 'web') {
        // Web: use expo-print for proper PDF generation
        try {
          const { printToFileAsync } = await import('expo-print');
          const { uri } = await printToFileAsync({ 
            html: htmlContent,
            base64: false 
          });
          
          // Create download link for PDF
          const a = document.createElement('a');
          a.href = uri;
          a.download = `CarrotCash-${invoiceNumber}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          Alert.alert('PDF Downloaded', `Invoice saved as CarrotCash-${invoiceNumber}.pdf`);
        } catch (printError) {
          // Fallback to HTML if print fails
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `CarrotCash-${invoiceNumber}.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          Alert.alert(
            'Invoice Downloaded',
            'Open the downloaded file in your browser and press Ctrl+P to save as PDF.',
          );
        }
      } else {
        // Native: use expo-print
        const { printAsync } = await import('expo-print');
        const { shareAsync } = await import('expo-sharing');
        const { uri } = await printAsync({ html: htmlContent });
        await shareAsync(uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
        });
      }
    } catch (error: any) {
      console.error('PDF generation error:', error);
      Alert.alert('Error', 'Failed to generate PDF: ' + error.message);
    } finally {
      setGeneratingPdf(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#16a34a';
      case 'sent': return '#2563eb';
      case 'overdue': return '#e11d48';
      default: return '#888';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'paid': return '#f0fdf4';
      case 'sent': return '#eff6ff';
      case 'overdue': return '#fff1f2';
      default: return '#f5f5f5';
    }
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount || 0), 0);

  if (loading) {
    return <InvoicesSkeleton />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderLeftColor: '#16a34a' }]}>
            <Text style={styles.summaryLabel}>Total Paid</Text>
            <Text style={[styles.summaryValue, { color: '#16a34a' }]}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: PRIMARY }]}>
            <Text style={styles.summaryLabel}>Total Pending</Text>
            <Text style={[styles.summaryValue, { color: PRIMARY }]}>
              ₹{totalPending.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: '#888' }]}>
            <Text style={styles.summaryLabel}>Total Invoices</Text>
            <Text style={[styles.summaryValue, { color: '#1A1A1A' }]}>
              {invoices.length}
            </Text>
          </View>
        </View>

        {/* Invoice List */}
        {invoices.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={56} color="#DDD" />
            <Text style={styles.emptyTitle}>No invoices yet</Text>
            <Text style={styles.emptySubtitle}>Create your first invoice to get started</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setShowModal(true)}>
              <Text style={styles.emptyBtnText}>Create Invoice</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {invoices.map((invoice) => (
              <View key={invoice.id} style={styles.invoiceCard}>
                <View style={styles.invoiceTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
                    <Text style={styles.invoiceClient}>{invoice.client_name}</Text>
                    {invoice.client_email ? (
                      <Text style={styles.invoiceEmail}>{invoice.client_email}</Text>
                    ) : null}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.invoiceAmount}>
                      ₹{Number(invoice.amount).toLocaleString('en-IN')}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBg(invoice.status) }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(invoice.status) }]}>
                        {invoice.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {invoice.description ? (
                  <Text style={styles.invoiceDesc} numberOfLines={2}>{invoice.description}</Text>
                ) : null}

                {invoice.due_date ? (
                  <Text style={styles.invoiceDue}>
                    Due: {new Date(invoice.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                ) : null}

                {/* Actions */}
                <View style={styles.invoiceActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={(e) => {
                      e?.stopPropagation();
                      generatePDF(invoice);
                    }}
                    disabled={generatingPdf === invoice.id}
                  >
                    {generatingPdf === invoice.id ? (
                      <ActivityIndicator size="small" color={PRIMARY} />
                    ) : (
                      <Ionicons name="download-outline" size={16} color={PRIMARY} />
                    )}
                    <Text style={[styles.actionBtnText, { color: PRIMARY }]}>
                      {generatingPdf === invoice.id ? 'Generating...' : 'PDF'}
                    </Text>
                  </TouchableOpacity>

                  {invoice.status !== 'paid' && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleStatusChange(invoice.id, 'paid')}
                    >
                      <Ionicons name="checkmark-circle-outline" size={16} color="#16a34a" />
                      <Text style={[styles.actionBtnText, { color: '#16a34a' }]}>Mark Paid</Text>
                    </TouchableOpacity>
                  )}

                  {invoice.status === 'draft' && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleStatusChange(invoice.id, 'sent')}
                    >
                      <Ionicons name="send-outline" size={16} color="#2563eb" />
                      <Text style={[styles.actionBtnText, { color: '#2563eb' }]}>Mark Sent</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleDelete(invoice.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#e11d48" />
                    <Text style={[styles.actionBtnText, { color: '#e11d48' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Create Invoice Modal */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Invoice</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Client Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rohan Designs"
                value={form.client_name}
                onChangeText={(v) => setForm({ ...form, client_name: v })}
              />

              <Text style={styles.inputLabel}>Client Email</Text>
              <TextInput
                style={styles.input}
                placeholder="client@example.com"
                value={form.client_email}
                onChangeText={(v) => setForm({ ...form, client_email: v })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Amount (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 15000"
                value={form.amount}
                onChangeText={(v) => setForm({ ...form, amount: v })}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Services rendered..."
                value={form.description}
                onChangeText={(v) => setForm({ ...form, description: v })}
                multiline
              />

              <Text style={styles.inputLabel}>Due Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2026-04-30"
                value={form.due_date}
                onChangeText={(v) => setForm({ ...form, due_date: v })}
              />

              <TouchableOpacity
                style={[styles.createBtn, saving && { opacity: 0.6 }]}
                onPress={handleCreate}
                disabled={saving}
              >
                <Text style={styles.createBtnText}>
                  {saving ? 'Creating...' : 'Create Invoice'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  summaryCard: { flex: 1, minWidth: 120, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderLeftWidth: 4, borderWidth: 1, borderColor: '#EEEEEE' },
  summaryLabel: { fontSize: 12, color: '#888', marginBottom: 6, fontWeight: '500' },
  summaryValue: { fontSize: 22, fontWeight: '800', fontFamily: 'System' },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 48, alignItems: 'center', borderWidth: 1, borderColor: '#EEEEEE' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', marginBottom: 24, textAlign: 'center' },
  emptyBtn: { backgroundColor: PRIMARY, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  list: { gap: 16 },
  invoiceCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: '#EEEEEE', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  invoiceTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  invoiceNumber: { fontSize: 13, fontWeight: '700', color: PRIMARY, marginBottom: 4 },
  invoiceClient: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  invoiceEmail: { fontSize: 12, color: '#888', marginTop: 2 },
  invoiceAmount: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  invoiceDesc: { fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 8 },
  invoiceDue: { fontSize: 12, color: '#888', marginBottom: 12 },
  invoiceActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: '#EEEEEE', backgroundColor: '#FAFAFA' },
  actionBtnText: { fontSize: 13, fontWeight: '600' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: 14, fontSize: 15, color: '#1A1A1A', marginBottom: 16, backgroundColor: '#FAFAFA' },
  createBtn: { backgroundColor: PRIMARY, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  createBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});