import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Dimensions,
  Animated,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { BlurView } from 'expo-blur';
import { View as MotiView, Text as MotiText } from 'moti';
import { DashboardSkeleton } from '../../components/SkeletonLoader';

const PRIMARY = '#D97757';
const SECONDARY = '#6a9bcc';
const DARK = '#141413';
const CARD_BG = '#141413';
const LIGHT_BG = '#faf9f5';

const { width, height } = Dimensions.get('window');
const isWide = width > 900;

export default function Dashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 124500,
    pendingInvoices: 8,
    monthlyExpenses: 32500,
  });
  const [cashFlowData, setCashFlowData] = useState([
    { month: 'Jan', income: 45000, expenses: 32000 },
    { month: 'Feb', income: 52000, expenses: 28000 },
    { month: 'Mar', income: 48000, expenses: 35000 },
    { month: 'Apr', income: 61000, expenses: 31000 },
    { month: 'May', income: 55000, expenses: 29000 },
    { month: 'Jun', income: 67000, expenses: 33000 },
  ]);
  const [expenseCategories, setExpenseCategories] = useState([
    { name: 'Subscriptions', value: 8500, color: '#d97757' },
    { name: 'Marketing', value: 12000, color: '#6a9bcc' },
    { name: 'Travel', value: 6200, color: '#788c5d' },
    { name: 'Office', value: 5800, color: '#b0aea5' },
  ]);
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, client: 'TechCorp Ltd', description: 'Web Development Services', amount: 12500, status: 'Paid', date: '2024-06-15' },
    { id: 2, client: 'StartUp Hub', description: 'Consulting Retainer', amount: 8500, status: 'Overdue', date: '2024-06-14' },
    { id: 3, client: 'Digital Agency', description: 'Mobile App Design', amount: 18000, status: 'Paid', date: '2024-06-13' },
    { id: 4, client: 'E-commerce Store', description: 'SEO Optimization', amount: 6500, status: 'Draft', date: '2024-06-12' },
    { id: 5, client: 'SaaS Company', description: 'API Integration', amount: 9200, status: 'Paid', date: '2024-06-11' },
  ]);
  const [upcomingTasks, setUpcomingTasks] = useState([
    { id: 1, client: 'TechCorp Ltd', amount: 12500, dueDate: '2024-06-20', daysLeft: 2 },
    { id: 2, client: 'Marketing Agency', amount: 7800, dueDate: '2024-06-22', daysLeft: 4 },
    { id: 3, client: 'StartUp Hub', amount: 8500, dueDate: '2024-06-25', daysLeft: 7 },
  ]);

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return '#788c5d';
      case 'Overdue': return '#d97757';
      case 'Draft': return '#b0aea5';
      default: return '#6B7280';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Paid': return 'rgba(120, 140, 93, 0.1)';
      case 'Overdue': return 'rgba(217, 119, 87, 0.1)';
      case 'Draft': return 'rgba(176, 174, 165, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const renderSparkline = (data: number[], color: string) => {
    return (
      <View style={styles.sparklineContainer}>
        {data.map((value, index) => (
          <View
            key={index}
            style={[
              styles.sparklineBar,
              {
                height: `${(value / Math.max(...data)) * 100}%`,
                backgroundColor: color,
                opacity: 0.3 + (index / data.length) * 0.7,
              }
            ]}
          />
        ))}
      </View>
    );
  };

  const renderStatCard = (title: string, value: string, change: string, data: number[], color: string) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={[styles.statChange, { color }]}>{change}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {renderSparkline(data, color)}
    </View>
  );

  const renderCashFlowChart = () => (
    <View style={styles.chartCard}>
      <Text style={styles.sectionTitle}>Cash Flow - Last 6 Months</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: PRIMARY }]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: SECONDARY }]} />
            <Text style={styles.legendText}>Expenses</Text>
          </View>
        </View>
        <View style={styles.barChart}>
          {cashFlowData.map((item, index) => (
            <View key={index} style={styles.barGroup}>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar,
                    styles.incomeBar,
                    { height: `${(item.income / 70000) * 100}%` }
                  ]}
                />
                <View 
                  style={[
                    styles.bar,
                    styles.expenseBar,
                    { height: `${(item.expenses / 70000) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.month}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderExpenseBreakdown = () => (
    <View style={styles.chartCard}>
      <Text style={styles.sectionTitle}>Expense Breakdown</Text>
      <View style={styles.donutContainer}>
        <View style={styles.donutChart}>
          {expenseCategories.map((category, index) => {
            const startAngle = expenseCategories.slice(0, index).reduce((sum, cat) => sum + (cat.value / 38500) * 360, 0);
            const sweepAngle = (category.value / 38500) * 360;
            return (
              <View
                key={index}
                style={[
                  styles.donutSlice,
                  {
                    backgroundColor: category.color,
                    transform: [
                      { rotate: `${startAngle}deg` },
                    ],
                  }
                ]}
              />
            );
          })}
        </View>
        <View style={styles.donutLegend}>
          {expenseCategories.map((category, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: category.color }]} />
              <View>
                <Text style={styles.legendText}>{category.name}</Text>
                <Text style={styles.legendValue}>${category.value.toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderActivityTable = () => (
    <View style={styles.tableCard}>
      <View style={styles.tableHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <Text style={styles.tableHeaderText}>Client</Text>
          <Text style={styles.tableHeaderText}>Description</Text>
          <Text style={styles.tableHeaderText}>Amount</Text>
          <Text style={styles.tableHeaderText}>Status</Text>
        </View>
        {recentActivity.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.client}</Text>
            <Text style={styles.tableCell}>{item.description}</Text>
            <Text style={styles.tableCell}>${item.amount.toLocaleString()}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusBg(item.status) }]}>
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderUpcomingTasks = () => (
    <View style={styles.tasksCard}>
      <Text style={styles.sectionTitle}>Invoices Due This Week</Text>
      {upcomingTasks.map((task) => (
        <View key={task.id} style={styles.taskItem}>
          <View style={styles.taskInfo}>
            <Text style={styles.taskClient}>{task.client}</Text>
            <Text style={styles.taskAmount}>${task.amount.toLocaleString()}</Text>
          </View>
          <View style={styles.taskDue}>
            <Text style={styles.taskDate}>Due {task.dueDate}</Text>
            <Text style={[styles.taskDaysLeft, { color: task.daysLeft <= 3 ? PRIMARY : '#6B7280' }]}>
              {task.daysLeft} days left
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No session. Please log in.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/landing')}>
          <Text style={styles.primaryBtnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'there';

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { fontFamily: 'Poppins' }]}>{getGreeting()},</Text>
          <Text style={[styles.userName, { fontFamily: 'Poppins' }]}>{userName}</Text>
        </View>
        <TouchableOpacity style={styles.quickCreateBtn}>
          <Ionicons name="add" size={24} color="#faf9f5" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Stats - Horizontal Scroll */}
        <View style={styles.heroSection}>
          <Animated.FlatList
            data={[
              { title: 'Total Revenue', value: '$124,500', change: '+12.5%', data: [45, 52, 48, 61, 55, 67], color: PRIMARY },
              { title: 'Pending Invoices', value: '8', change: '-2', data: [12, 10, 8, 9, 8, 8], color: SECONDARY },
              { title: 'Monthly Expenses', value: '$32,500', change: '+8.2%', data: [32, 28, 35, 31, 29, 33], color: '#FFB800' },
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsContainer}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => renderStatCard(item.title, item.value, item.change, item.data, item.color)}
          />
        </View>

        {/* Charts Section */}
        <View style={styles.chartsSection}>
          {renderCashFlowChart()}
          {renderExpenseBreakdown()}
        </View>

        {/* Activity and Tasks */}
        <View style={styles.activitySection}>
          {renderActivityTable()}
          {renderUpcomingTasks()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_BG,
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    backgroundColor: '#faf9f5',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: DARK,
    marginTop: 2,
  },
  quickCreateBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Scroll Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Hero Stats
  heroSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  statsContainer: {
    paddingRight: 16,
  },
  statCard: {
    width: 200,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#faf9f5',
    marginBottom: 16,
  },
  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    gap: 2,
  },
  sparklineBar: {
    flex: 1,
    borderRadius: 2,
  },
  
  // Charts
  chartsSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 20,
  },
  chartCard: {
    backgroundColor: '#faf9f5',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK,
    fontFamily: 'Poppins',
    marginBottom: 20,
  },
  
  // Cash Flow Chart
  chartContainer: {
    alignItems: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 12,
    color: DARK,
    fontWeight: '600',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    width: '100%',
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 4,
    marginBottom: 8,
  },
  bar: {
    width: 12,
    borderRadius: 6,
  },
  incomeBar: {
    backgroundColor: PRIMARY,
  },
  expenseBar: {
    backgroundColor: SECONDARY,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // Donut Chart
  donutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  donutChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    padding: 20,
    position: 'relative',
  },
  donutSlice: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
  },
  donutLegend: {
    flex: 1,
    gap: 12,
  },
  
  // Activity Table
  activitySection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 20,
  },
  tableCard: {
    backgroundColor: '#faf9f5',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAll: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '600',
  },
  table: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: DARK,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Tasks
  tasksCard: {
    backgroundColor: '#faf9f5',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  taskInfo: {
    flex: 1,
  },
  taskClient: {
    fontSize: 14,
    fontWeight: '600',
    color: DARK,
    marginBottom: 2,
  },
  taskAmount: {
    fontSize: 13,
    color: '#6B7280',
  },
  taskDue: {
    alignItems: 'flex-end',
  },
  taskDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  taskDaysLeft: {
    fontSize: 12,
    fontWeight: '600',
  },
});
