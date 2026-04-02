import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');
const isWide = width > 900;

const Features = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    'Invoicing',
    'Expenses', 
    'Payments',
    'WhatsApp',
    'Analytics',
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Invoicing
        return (
          <View style={styles.contentContainer}>
            <View style={styles.leftContent}>
              <Text style={styles.featureTitle}>GST-Compliant Invoices in Seconds</Text>
              <Text style={styles.featureDescription}>
                Create professional invoices that Indian clients expect. 
                Auto-calculate GST, add your logo, and get paid faster.
              </Text>
              <View style={styles.bulletsContainer}>
                <Text style={styles.bullet}>✓ GST/IGST/CGST auto-calculation</Text>
                <Text style={styles.bullet}>✓ PDF export & sharing</Text>
                <Text style={styles.bullet}>✓ Payment status tracking</Text>
              </View>
            </View>
            <View style={styles.rightContent}>
              <View style={styles.mockCard}>
                <Text style={styles.mockHeader}>INVOICE #001</Text>
                <View style={styles.mockRow}>
                  <Text style={styles.mockLabel}>Client:</Text>
                  <Text style={styles.mockValue}>Acme Corp</Text>
                </View>
                <View style={styles.mockRow}>
                  <Text style={styles.mockLabel}>Amount:</Text>
                  <Text style={styles.mockValue}>₹18,000 + GST</Text>
                </View>
                <View style={styles.mockStatus}>
                  <Text style={styles.statusText}>SENT</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 1: // Expenses
        return (
          <View style={styles.contentContainer}>
            <View style={styles.leftContent}>
              <Text style={styles.featureTitle}>Track Every Rupee Automatically</Text>
              <Text style={styles.featureDescription}>
                Categorize expenses, attach receipts, and get 
                a clear picture of where your money is going.
              </Text>
              <View style={styles.bulletsContainer}>
                <Text style={styles.bullet}>✓ Smart auto-categorization</Text>
                <Text style={styles.bullet}>✓ CSV export for CA/accountant</Text>
                <Text style={styles.bullet}>✓ Monthly spending insights</Text>
              </View>
            </View>
            <View style={styles.rightContent}>
              <View style={styles.mockCard}>
                <Text style={styles.mockHeader}>Recent Expenses</Text>
                <View style={styles.expenseRow}>
                  <Text style={styles.expenseName}>Canva Pro</Text>
                  <Text style={styles.expenseCategory}>Design</Text>
                  <Text style={styles.expenseAmount}>₹4,000</Text>
                  <View style={styles.expenseBadgePink} />
                </View>
                <View style={styles.expenseRow}>
                  <Text style={styles.expenseName}>AWS Hosting</Text>
                  <Text style={styles.expenseCategory}>Tech</Text>
                  <Text style={styles.expenseAmount}>₹2,200</Text>
                  <View style={styles.expenseBadgeTeal} />
                </View>
                <View style={styles.expenseRow}>
                  <Text style={styles.expenseName}>Travel</Text>
                  <Text style={styles.expenseCategory}>Transport</Text>
                  <Text style={styles.expenseAmount}>₹800</Text>
                  <View style={styles.expenseBadgeGray} />
                </View>
              </View>
            </View>
          </View>
        );

      case 2: // Payments
        return (
          <View style={styles.contentContainer}>
            <View style={styles.leftContent}>
              <Text style={styles.featureTitle}>Get Paid Faster with Online Payments</Text>
              <Text style={styles.featureDescription}>
                Accept payments via Razorpay and Stripe. 
                Send payment links directly from your invoice.
              </Text>
              <View style={styles.bulletsContainer}>
                <Text style={styles.bullet}>✓ Razorpay & Stripe integration</Text>
                <Text style={styles.bullet}>✓ Auto payment reminders</Text>
                <Text style={styles.bullet}>✓ Real-time payment notifications</Text>
              </View>
            </View>
            <View style={styles.rightContent}>
              <View style={styles.mockCard}>
                <Text style={styles.paymentStatus}>Payment Received</Text>
                <Text style={styles.paymentAmount}>₹25,000</Text>
                <Text style={styles.paymentMethod}>via Razorpay • Just now</Text>
              </View>
            </View>
          </View>
        );

      case 3: // WhatsApp
        return (
          <View style={styles.contentContainer}>
            <View style={styles.leftContent}>
              <Text style={styles.featureTitle}>Send Invoices via WhatsApp</Text>
              <Text style={styles.featureDescription}>
                Coming Soon — send invoices directly to clients 
                on WhatsApp. The channel they already use every day.
              </Text>
              <View style={styles.bulletsContainer}>
                <Text style={styles.bullet}>✓ One-tap invoice sharing</Text>
                <Text style={styles.bullet}>✓ Auto payment reminders on WhatsApp</Text>
                <Text style={styles.bullet}>✓ Client replies tracked in dashboard</Text>
              </View>
            </View>
            <View style={styles.rightContent}>
              <View style={styles.mockCard}>
                <View style={styles.whatsappHeader}>
                  <Text style={styles.whatsappTitle}>WhatsApp Business</Text>
                </View>
                <View style={styles.chatBubble}>
                  <Text style={styles.chatText}>Hi! Your invoice #INV-042 for ₹15,000 is ready</Text>
                </View>
                <View style={styles.chatStatus}>
                  <Text style={styles.chatTick}>✓✓ Delivered</Text>
                </View>
                <View style={styles.replyBubble}>
                  <Text style={styles.replyText}>Thanks! Paying now 👍</Text>
                </View>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 4: // Analytics
        return (
          <View style={styles.contentContainer}>
            <View style={styles.leftContent}>
              <Text style={styles.featureTitle}>Real-Time Financial Insights</Text>
              <Text style={styles.featureDescription}>
                See exactly how your business is performing. 
                Revenue trends, top clients, expense breakdowns — all live.
              </Text>
              <View style={styles.bulletsContainer}>
                <Text style={styles.bullet}>✓ Revenue vs expense charts</Text>
                <Text style={styles.bullet}>✓ Top client rankings</Text>
                <Text style={styles.bullet}>✓ Monthly/yearly comparisons</Text>
              </View>
            </View>
            <View style={styles.rightContent}>
              <View style={styles.mockCard}>
                <Text style={styles.analyticsHeader}>This Month</Text>
                <View style={styles.analyticsRow}>
                  <Text style={styles.analyticsLabel}>Revenue</Text>
                  <Text style={styles.analyticsValueGreen}>₹45,200 ↑</Text>
                </View>
                <View style={styles.analyticsRow}>
                  <Text style={styles.analyticsLabel}>Expenses</Text>
                  <Text style={styles.analyticsValueTeal}>₹12,800 ↓</Text>
                </View>
                <Text style={styles.analyticsComparison}>vs last month: +18%</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerMain}>The features you need.</Text>
        <Text style={styles.headerAccent}>All in one place.</Text>
        <Text style={styles.headerSubtext}>Built specifically for Indian freelancers and solopreneurs</Text>
      </View>

      {/* Feature Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              activeTab === index && styles.activeTab,
              index === 3 && styles.tabWithBadge
            ]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[
              styles.tabText,
              activeTab === index && styles.activeTabText
            ]}>
              {tab}
            </Text>
            {index === 3 && (
              <View style={styles.soonBadge}>
                <Text style={styles.soonText}>Soon</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Content */}
      <View style={styles.contentWrapper}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0D0D',
    paddingHorizontal: isWide ? 80 : 40,
    paddingVertical: isWide ? 120 : 80,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  headerMain: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerAccent: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FF006E',
    textAlign: 'center',
  },
  headerSubtext: {
    fontSize: 18,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 600,
  },
  tabsContainer: {
    marginBottom: 60,
  },
  tabsContent: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  tab: {
    backgroundColor: 'transparent',
    borderColor: '#2A2A2A',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: 'relative',
  },
  tabWithBadge: {
    paddingRight: 80,
  },
  activeTab: {
    backgroundColor: '#FF006E',
    borderColor: '#FF006E',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#AAAAAA',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  soonBadge: {
    position: 'absolute',
    right: 8,
    top: 6,
    backgroundColor: '#5EEAD4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  soonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D0D0D',
  },
  contentWrapper: {
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: isWide ? 'row' : 'column',
    gap: isWide ? 60 : 40,
    maxWidth: 1200,
    width: '100%',
  },
  leftContent: {
    flex: 1,
    alignItems: isWide ? 'flex-start' : 'center',
  },
  featureTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: isWide ? 'left' : 'center',
  },
  featureDescription: {
    fontSize: 16,
    color: '#AAAAAA',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: isWide ? 'left' : 'center',
  },
  bulletsContainer: {
    gap: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#5EEAD4',
    fontWeight: '500',
  },
  rightContent: {
    flex: 1,
    alignItems: 'center',
  },
  mockCard: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  mockHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF006E',
    marginBottom: 20,
  },
  mockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mockLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  mockValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  mockStatus: {
    alignSelf: 'flex-start',
    backgroundColor: '#5EEAD4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D0D0D',
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  expenseName: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  expenseCategory: {
    fontSize: 12,
    color: '#AAAAAA',
    marginHorizontal: 12,
  },
  expenseAmount: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  expenseBadgePink: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF006E',
  },
  expenseBadgeTeal: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5EEAD4',
  },
  expenseBadgeGray: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666666',
  },
  paymentStatus: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 12,
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#5EEAD4',
    marginBottom: 8,
  },
  paymentMethod: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  whatsappHeader: {
    backgroundColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  whatsappTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatBubble: {
    backgroundColor: '#E5E7EB',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 14,
    color: '#0D0D0D',
  },
  chatStatus: {
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
  },
  chatTick: {
    fontSize: 12,
    color: '#25D366',
  },
  replyBubble: {
    backgroundColor: '#DCF8C6',
    margin: 16,
    marginLeft: 60,
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  replyText: {
    fontSize: 14,
    color: '#0D0D0D',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#5EEAD4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D0D0D',
  },
  analyticsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  analyticsValueGreen: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  analyticsValueTeal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5EEAD4',
  },
  analyticsComparison: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
    marginTop: 8,
  },
});

export default Features;
