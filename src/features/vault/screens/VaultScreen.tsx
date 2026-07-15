import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  FileUp,
  ImagePlus,
  Plus,
  Search,
  Shield,
  UserCircle,
} from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

import {
  DocumentListItem,
  FinanceSummaryCard,
  PasswordManagerCard,
  StorageUsageCard,
  VaultCategoryCard,
  VaultEmptyState,
  VaultQuickActionGrid,
  VaultSection,
  VaultSegmentedControl,
  VaultSkeleton,
} from '../components';
import { useVaultModule } from '../hooks';
import type { MasterDataOption } from '../types';

const CREATE_ACTIONS = [
  {
    id: 'upload-pdf',
    title: 'Upload PDF',
    icon: FileUp,
  },
  {
    id: 'upload-image',
    title: 'Upload Image',
    icon: ImagePlus,
  },
  {
    id: 'capture',
    title: 'Camera Capture',
    icon: Camera,
  },
];

export const VaultScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    visibility,
    setVisibility,
    masterData,
    loadingMasterData,
    error,
    documents,
    staticData,
  } = useVaultModule();

  const documentCounts = useMemo(
    () => getCountsByCategory(staticData.documents),
    [staticData.documents],
  );
  const maintenanceCounts = useMemo(
    () => getCountsByCategory(staticData.maintenance),
    [staticData.maintenance],
  );

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader
          title="Vault"
          leftIcon={Shield}
          actions={[
            {
              icon: Search,
              accessibilityLabel: 'Search vault',
            },
            {
              icon: UserCircle,
              accessibilityLabel: 'Vault profile',
            },
          ]}
        />

        <VaultSegmentedControl value={visibility} onChange={setVisibility} />

        <View style={styles.createRow}>
          {CREATE_ACTIONS.map(action => {
            const Icon = action.icon;

            return (
              <Pressable
                key={action.id}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.createAction,
                  pressed && styles.createActionPressed,
                ]}
              >
                <Icon size={19} color={theme.colors.primary} strokeWidth={2.4} />
                <Text style={styles.createActionText}>{action.title}</Text>
              </Pressable>
            );
          })}
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <VaultSection title="Documents" onViewAll={() => undefined}>
          {loadingMasterData ? (
            <VaultSkeleton />
          ) : (
            <CategoryRail
              options={masterData.documentCategories}
              counts={documentCounts}
              emptyTitle="No document categories"
              emptyMessage="Add active document categories under master_data/document_categories/items."
            />
          )}
        </VaultSection>

        <VaultSection title="Finance" onViewAll={() => undefined}>
          <FinanceSummaryCard summary={staticData.financeSummary} />
          <VaultQuickActionGrid actions={staticData.financeActions} />
        </VaultSection>

        <VaultSection title="Maintenance" onViewAll={() => undefined}>
          {loadingMasterData ? (
            <VaultSkeleton />
          ) : (
            <CategoryRail
              options={masterData.maintenanceCategories}
              counts={maintenanceCounts}
              emptyTitle="No maintenance categories"
              emptyMessage="Add active maintenance categories in Firestore master data."
            />
          )}
        </VaultSection>

        <VaultSection title="Password Manager">
          <PasswordManagerCard count={staticData.passwords.length} />
        </VaultSection>

        <StorageUsageCard
          usedGb={staticData.storageUsedGb}
          limitGb={staticData.storageLimitGb}
        />

        <VaultSection title="Recent Documents" onViewAll={() => undefined}>
          <View style={styles.documentList}>
            {documents.length ? (
              documents.map(document => (
                <DocumentListItem key={document.id} document={document} />
              ))
            ) : (
              <VaultEmptyState
                title="No documents here"
                message="Upload a PDF, add an image, or capture a document to get started."
              />
            )}
          </View>
        </VaultSection>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create vault item"
          style={styles.fab}
        >
          <Plus size={30} color="#FFFFFF" strokeWidth={2.6} />
        </Pressable>
      </View>
    </GradientPageView>
  );
};

interface CountableCategoryItem {
  categoryId: string;
}

const getCountsByCategory = (items: CountableCategoryItem[]): Record<string, number> => {
  return items.reduce<Record<string, number>>((counts, item) => {
    counts[item.categoryId] = (counts[item.categoryId] ?? 0) + 1;
    return counts;
  }, {});
};

interface CategoryRailProps {
  options: MasterDataOption[];
  counts: Record<string, number>;
  emptyTitle: string;
  emptyMessage: string;
}

const CategoryRail: React.FC<CategoryRailProps> = ({
  options,
  counts,
  emptyTitle,
  emptyMessage,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!options.length) {
    return <VaultEmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryRail}
    >
      {options.map(option => (
        <VaultCategoryCard
          key={option.id}
          option={option}
          count={counts[option.id] ?? 0}
        />
      ))}
    </ScrollView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      flex: 1,
      gap: theme.spacing.lg,
    },
    createRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    createAction: {
      flex: 1,
      minHeight: 58,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: 16,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    createActionPressed: {
      opacity: 0.72,
    },
    createActionText: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
      textAlign: 'center',
    },
    errorCard: {
      padding: theme.spacing.md,
      borderRadius: 16,
      backgroundColor: '#FEF2F2',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: '#FCA5A5',
    },
    errorText: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    categoryRail: {
      gap: theme.spacing.sm,
      paddingVertical: 2,
      paddingRight: theme.spacing.md,
    },
    documentList: {
      gap: theme.spacing.sm,
    },
    fab: {
      position: 'absolute',
      right: theme.spacing.sm,
      bottom: 24,
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#B77451',
      shadowColor: '#8F5139',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.28,
      shadowRadius: 14,
      elevation: 10,
    },
  });
