import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type RouteProp, useRoute } from '@react-navigation/native';
import { Wrench } from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useTheme } from '@/hooks';
import type { Theme, VaultStackParamList } from '@/types';

import { DocumentListItem, VaultEmptyState, VaultSkeleton } from '../components';
import { useMaintenanceDocuments } from '../hooks';

const DETAIL_SECTIONS = ['Warranty', 'AMC', 'Invoice', 'Bills', 'Manual', 'Service History'];

export const MaintenanceDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<VaultStackParamList, 'MaintenanceDetails'>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { documents, loading } = useMaintenanceDocuments(route.params.applianceId);

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader title={route.params.applianceName} subtitle="Maintenance records" leftIcon={Wrench} />
        <View style={styles.sectionGrid}>
          {DETAIL_SECTIONS.map(section => (
            <View key={section} style={styles.pill}>
              <Text style={styles.pillText}>{section}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.heading}>Linked Documents</Text>
        {loading ? (
          <VaultSkeleton count={2} />
        ) : documents.length ? (
          <View style={styles.list}>
            {documents.map(document => (
              <DocumentListItem key={document.id} document={document} />
            ))}
          </View>
        ) : (
          <VaultEmptyState title="No maintenance files" message="Add maintenance documents with this appliance selected." />
        )}
      </View>
    </GradientPageView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.lg,
    },
    sectionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    pill: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 14,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    pillText: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
    },
    heading: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.lg,
    },
    list: {
      gap: theme.spacing.sm,
    },
  });
