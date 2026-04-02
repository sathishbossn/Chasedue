import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  width = '100%', 
  height = 20, 
  style 
}) => {
  return (
    <View 
      style={[
        styles.skeleton, 
        { width, height },
        style
      ]} 
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonLoader width={150} height={32} style={styles.titleSkeleton} />
        <SkeletonLoader width={200} height={16} style={styles.subtitleSkeleton} />
      </View>

      {/* Stats Cards Skeleton */}
      <View style={styles.statsGrid}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.statCard}>
            <SkeletonLoader width={60} height={24} />
            <SkeletonLoader width={80} height={32} style={styles.amountSkeleton} />
            <SkeletonLoader width={100} height={14} style={styles.labelSkeleton} />
          </View>
        ))}
      </View>

      {/* Recent Activity Skeleton */}
      <View style={styles.section}>
        <SkeletonLoader width={120} height={20} style={styles.sectionTitleSkeleton} />
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.activityItem}>
            <SkeletonLoader width={40} height={40} style={styles.avatarSkeleton} />
            <View style={styles.activityContent}>
              <SkeletonLoader width={150} height={16} />
              <SkeletonLoader width={100} height={14} style={styles.activitySubtitleSkeleton} />
            </View>
            <SkeletonLoader width={60} height={16} style={styles.amountSkeleton} />
          </View>
        ))}
      </View>
    </View>
  );
};

export const InvoicesSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonLoader width={120} height={28} style={styles.titleSkeleton} />
        <SkeletonLoader width={140} height={36} style={styles.buttonSkeleton} />
      </View>

      {/* Invoice List Skeleton */}
      <View style={styles.invoiceList}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <SkeletonLoader width={120} height={20} />
              <SkeletonLoader width={80} height={24} style={styles.statusSkeleton} />
            </View>
            <View style={styles.invoiceContent}>
              <SkeletonLoader width={140} height={16} />
              <SkeletonLoader width={100} height={14} style={styles.subtitleSkeleton} />
            </View>
            <SkeletonLoader width={80} height={24} style={styles.amountSkeleton} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0D0D0D',
  },
  skeleton: {
    backgroundColor: '#FAF9F5',
    borderRadius: 8,
    opacity: 0.3,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  subtitleSkeleton: {
    marginBottom: 24,
  },
  sectionTitleSkeleton: {
    marginBottom: 16,
  },
  amountSkeleton: {
    marginVertical: 4,
  },
  labelSkeleton: {
    marginTop: 4,
  },
  buttonSkeleton: {
    borderRadius: 8,
  },
  header: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  section: {
    marginBottom: 32,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 12,
  },
  avatarSkeleton: {
    borderRadius: 20,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activitySubtitleSkeleton: {
    marginTop: 4,
  },
  invoiceList: {
    gap: 16,
  },
  invoiceCard: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceContent: {
    marginBottom: 12,
  },
  statusSkeleton: {
    borderRadius: 12,
  },
});
