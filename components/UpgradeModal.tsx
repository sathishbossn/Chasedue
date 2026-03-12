import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { PaymentService } from '@/lib/payments';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export default function UpgradeModal({ visible, onClose, onUpgradeSuccess }: UpgradeModalProps) {
  const { session } = useAuth();
  const [loading, setLoading] = useState<'razorpay' | 'stripe' | null>(null);

  const handleRazorpayPayment = async () => {
    if (!session?.user.email) {
      Alert.alert('Error', 'Please login to upgrade');
      return;
    }

    setLoading('razorpay');
    try {
      await PaymentService.loadRazorpayScript();
      const result = await PaymentService.initiateRazorpayPayment(session.user.email);
      
      if (result.success) {
        Alert.alert('Success', 'Payment successful! Upgrading to Pro...');
        onUpgradeSuccess();
        onClose();
      } else {
        Alert.alert('Payment Failed', result.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleStripePayment = async () => {
    if (!session?.user.email) {
      Alert.alert('Error', 'Please login to upgrade');
      return;
    }

    setLoading('stripe');
    try {
      const result = await PaymentService.initiateStripePayment(session.user.email);
      
      if (result.success) {
        Alert.alert('Success', 'Redirecting to Stripe checkout...');
      } else {
        Alert.alert('Payment Failed', result.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#eee'
        }}>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 16, color: '#007AFF' }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Upgrade to Pro</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#FF6B35',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{ fontSize: 32, color: 'white' }}>🥕</Text>
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              CarrotCash Pro
            </Text>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
              Unlock unlimited clients and premium features
            </Text>
          </View>

          <View style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>
              What you'll get:
            </Text>
            
            {[
              '🚀 Unlimited clients',
              '💰 Invoice generation',
              '📊 Advanced analytics',
              '🔔 Payment reminders',
              '📱 Priority support',
              '🎯 Export to PDF/Excel',
            ].map((feature, index) => (
              <View key={index} style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 12 
              }}>
                <Text style={{ fontSize: 16, marginRight: 10 }}>✓</Text>
                <Text style={{ fontSize: 16, flex: 1 }}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={{ 
            backgroundColor: '#f8f9fa', 
            padding: 20, 
            borderRadius: 12, 
            marginBottom: 30 
          }}>
            <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 8 }}>
              Best value in India
            </Text>
            <Text style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              textAlign: 'center',
              color: '#FF6B35'
            }}>
              ₹499/month
            </Text>
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
              (~$6/month for international users)
            </Text>
          </View>

          <View style={{ gap: 12, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={handleRazorpayPayment}
              disabled={loading !== null}
              style={{
                backgroundColor: loading === 'razorpay' ? '#ccc' : '#FF6B35',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ 
                color: 'white', 
                fontSize: 16, 
                fontWeight: 'bold' 
              }}>
                {loading === 'razorpay' ? 'Processing...' : 'Pay with Razorpay (₹499)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleStripePayment}
              disabled={loading !== null}
              style={{
                backgroundColor: loading === 'stripe' ? '#ccc' : '#635BFF',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ 
                color: 'white', 
                fontSize: 16, 
                fontWeight: 'bold' 
              }}>
                {loading === 'stripe' ? 'Processing...' : 'Pay with Stripe ($6/month)'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={{ 
            fontSize: 12, 
            color: '#999', 
            textAlign: 'center',
            marginBottom: 20
          }}>
            30-day money-back guarantee • Cancel anytime
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}
