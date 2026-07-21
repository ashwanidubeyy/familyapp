import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import {
  BanknoteArrowDown,
  FilePlus,
  KeyRound,
  Plus,
  Search,
  Shield,
  UserCircle,
} from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useTheme } from '@/hooks';
import type { Theme, VaultStackParamList } from '@/types';

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
import { useVaultDocuments, useVaultModule } from '../hooks';
import type { MasterDataOption } from '../types';

const CREATE_ACTIONS = [
  {
    id: 'add-document',
    title: 'Add Document',
    icon: FilePlus,
  },
  {
    id: 'add-password',
    title: 'Add Password',
    icon: KeyRound,
  },
  {
    id: 'add-transaction',
    title: 'Add Income / Expense',
    icon: BanknoteArrowDown,
  },
] as const;

export const VaultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<VaultStackParamList>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const {
    visibility,
    setVisibility,
    masterData,
    loadingMasterData,
    error,
    staticData,
  } = useVaultModule();
  const { documents, loading: loadingRecentDocuments } = useVaultDocuments();

  const documentCounts = useMemo(
    () => getCountsByCategory(staticData.documents),
    [staticData.documents],
  );

  const maintenanceCounts = useMemo(
    () => getCountsByCategory(staticData.maintenance),
    [staticData.maintenance],
  );

  const navigateCreateAction = (id: (typeof CREATE_ACTIONS)[number]['id']) => {
    setIsCreateSheetOpen(false);

    if (id === 'add-document') {
      navigation.navigate('AddDocument');
      return;
    }

    if (id === 'add-password') {
      navigation.navigate('AddPassword');
      return;
    }

    navigation.navigate('AddTransaction');
  };

  return (
    <View style={styles.root}>
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
                  onPress={() => navigateCreateAction(action.id)}
                >
                  <Icon size={19} color={theme.colors.primary} strokeWidth={2.4} />
                  <Text style={styles.createActionText}>{action.title}</Text>
                </Pressable>
              );
            })}
          </View>


          <VaultSection title="Documents" onViewAll={() => navigation.navigate('DocumentList', {
            categoryId: 'all',
            categoryName: 'All Documents',
          })}>
            {loadingMasterData ? (
              <VaultSkeleton />
            ) : (
              <CategoryRail
                options={masterData.documentCategories}
                counts={documentCounts}
                emptyTitle="No document categories"
                emptyMessage="Add active document categories under master_data/document_categories/items."
                onPress={option =>
                  navigation.navigate('DocumentList', {
                    categoryId: option.id,
                    categoryName: option.name,
                  })
                }
              />
            )}
          </VaultSection>

          <VaultSection title="Finance" onViewAll={() => navigation.navigate('FinanceDashboard')}>
            <FinanceSummaryCard summary={staticData.financeSummary} />
            <VaultQuickActionGrid
              actions={staticData.financeActions}
              onPress={() => navigation.navigate('FinanceDashboard')}
            />
          </VaultSection>

          <VaultSection title="Maintenance" onViewAll={() => navigation.navigate('MaintenanceList', {})}>
            {loadingMasterData ? (
              <VaultSkeleton />
            ) : (
              <CategoryRail
                options={masterData.maintenanceCategories}
                counts={maintenanceCounts}
                emptyTitle="No maintenance categories"
                emptyMessage="Add active maintenance categories in Firestore master data."
                onPress={option =>
                  navigation.navigate('MaintenanceList', {
                    categoryId: option.id,
                    categoryName: option.name,
                  })
                }
              />
            )}
          </VaultSection>

          <VaultSection title="Password Manager">
            <PasswordManagerCard
              count={staticData.passwords.length}
              onPress={() => navigation.navigate('PasswordList')}
            />
          </VaultSection>

          <StorageUsageCard
            usedGb={staticData.storageUsedGb}
            limitGb={staticData.storageLimitGb}
          />

          <VaultSection title="Recent Documents" onViewAll={() => navigation.navigate('DocumentList', {
            categoryId: 'all',
            categoryName: 'Recent Documents',
          })}>
            <View style={styles.documentList}>
              {loadingRecentDocuments ? (
                <VaultSkeleton count={2} />
              ) : documents.length ? (
                documents.map(document => (
                  <DocumentListItem
                    key={document.id}
                    document={document}
                    onPress={() =>
                      navigation.navigate('DocumentDetails', {
                        documentId: document.id,
                        source: document.visibility,
                      })
                    }
                    onMenuPress={() => Alert.alert('Document options', 'Open the document to view, edit, share or delete.')}
                  />
                ))
              ) : (
                <VaultEmptyState
                  title="No documents here"
                  message="Upload a PDF, add an image, or capture a document to get started."
                />
              )}
            </View>
          </VaultSection>
        </View>
      </GradientPageView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create vault item"
        style={styles.fab}
        onPress={() => setIsCreateSheetOpen(true)}
      >
        <Plus size={30} color="#FFFFFF" strokeWidth={2.6} />
      </Pressable>

      <Modal
        visible={isCreateSheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCreateSheetOpen(false)}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close create menu"
          style={styles.sheetBackdrop}
          onPress={() => setIsCreateSheetOpen(false)}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Create in Vault</Text>
            {CREATE_ACTIONS.map(action => {
              const Icon = action.icon;

              return (
                <Pressable
                  key={action.id}
                  accessibilityRole="button"
                  style={styles.sheetAction}
                  onPress={() => navigateCreateAction(action.id)}
                >
                  <View style={styles.sheetIcon}>
                    <Icon size={22} color={theme.colors.primary} strokeWidth={2.4} />
                  </View>
                  <Text style={styles.sheetActionText}>{action.title}</Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
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
  onPress?: (option: MasterDataOption) => void;
}

const CategoryRail: React.FC<CategoryRailProps> = ({
  options,
  counts,
  emptyTitle,
  emptyMessage,
  onPress,
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
          onPress={() => onPress?.(option)}
        />
      ))}
    </ScrollView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
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
      right: 20,
      bottom: 100,
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
      zIndex: 999,
    },
    sheetBackdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(15, 23, 42, 0.35)',
    },
    sheet: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      backgroundColor: theme.colors.surface,
    },
    sheetHandle: {
      width: 44,
      height: 5,
      borderRadius: 3,
      alignSelf: 'center',
      backgroundColor: theme.colors.border,
    },
    sheetTitle: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.lg,
    },
    sheetAction: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    sheetIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    sheetActionText: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
    },
  });
