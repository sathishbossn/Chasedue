import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SkeletonProps {
  style?: any;
  children?: React.ReactNode;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ style, children }) => {
  return (
    <View style={[styles.skeleton, style]}>
      {children}
    </View>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonLoader style={[styles.skeletonLine, { height: 32, width: 160, marginBottom: 8 }]} />
        <SkeletonLoader style={[styles.skeletonLine, { height: 16, width: 224 }]} />
      </View>

      {/* Stats Cards Skeleton */}
      <View style={styles.statsGrid}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.statCard}>
            <SkeletonLoader style={[styles.skeletonLine, { height: 20, width: 64, marginBottom: 8 }]} />
            <SkeletonLoader style={[styles.skeletonLine, { height: 28, width: 96, marginBottom: 4 }]} />
            <SkeletonLoader style={[styles.skeletonLine, { height: 12, width: 112 }]} />
          </View>
        ))}
      </View>

      {/* Recent Activity Skeleton */}
      <View style={styles.activitySection}>
        <SkeletonLoader style={[styles.skeletonLine, { height: 20, width: 128, marginBottom: 16 }]} />
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.activityItem}>
            <SkeletonLoader style={[styles.skeletonCircle, { height: 40, width: 40, marginRight: 16 }]} />
            <View style={styles.activityContent}>
              <SkeletonLoader style={[styles.skeletonLine, { height: 16, width: 160, marginBottom: 8 }]} />
              <SkeletonLoader style={[styles.skeletonLine, { height: 12, width: 112 }]} />
            </View>
            <SkeletonLoader style={[styles.skeletonLine, { height: 16, width: 64 }]} />
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
      <View style={styles.invoiceHeader}>
        <SkeletonLoader style={[styles.skeletonLine, { height: 28, width: 144 }]} />
        <SkeletonLoader style={[styles.skeletonLine, { height: 40, width: 160, borderRadius: 8 }]} />
      </View>

      {/* Invoice List Skeleton */}
      <View style={styles.invoiceList}>
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} style={styles.invoiceCard}>
            <View style={styles.invoiceCardHeader}>
              <SkeletonLoader style={[styles.skeletonLine, { height: 20, width: 128 }]} />
              <SkeletonLoader style={[styles.skeletonLine, { height: 24, width: 80, borderRadius: 12 }]} />
            </View>
            <View style={styles.invoiceCardBody}>
              <SkeletonLoader style={[styles.skeletonLine, { height: 16, width: 160, marginBottom: 8 }]} />
              <SkeletonLoader style={[styles.skeletonLine, { height: 12, width: 112 }]} />
            </View>
            <SkeletonLoader style={[styles.skeletonLine, { height: 24, width: 96, alignSelf: 'flex-end' }]} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0D0D0D',
    minHeight: '100%',
  },
  skeleton: {
    backgroundColor: '#FAF9F5',
    borderRadius: 8,
    opacity: 0.3,
  },
  skeletonLine: {
    backgroundColor: '#FAF9F5',
    borderRadius: 4,
    opacity: 0.3,
  },
  skeletonCircle: {
    backgroundColor: '#FAF9F5',
    borderRadius: 20,
    opacity: 0.3,
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
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    width: '48%',
  },
  activitySection: {
    marginBottom: 32,
  },
  activityItem: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityContent: {
    flex: 1,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  invoiceList: {
    gap: 16,
  },
  invoiceCard: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
  },
  invoiceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceCardBody: {
    marginBottom: 12,
  },
});
