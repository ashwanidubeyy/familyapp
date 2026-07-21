import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { type NavigationProp, type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Folder } from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useTheme } from '@/hooks';
import type { Theme, VaultStackParamList } from '@/types';

import { DocumentListItem, VaultEmptyState, VaultSkeleton } from '../components';
import { useVaultDocuments } from '../hooks';
import { vaultFirestoreService } from '../services/firestoreService';

export const DocumentListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<VaultStackParamList>>();
  const route = useRoute<RouteProp<VaultStackParamList, 'DocumentList'>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const category = route.params.categoryId === 'all' ? undefined : route.params.categoryId;
  const { documents, loading, error } = useVaultDocuments(category);

  const openMenu = (documentId: string) => {
    Alert.alert('Document options', 'Choose an action', [
      {
        text: 'View',
        onPress: () => navigation.navigate('DocumentDetails', {
          documentId,
          source: 'private',
        }),
      },
      {
        text: 'Edit',
        onPress: () => navigation.navigate('AddDocument'),
      },
      {
        text: 'Share',
        onPress: () => Alert.alert('Share', 'Public sharing is available from the details screen.'),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => vaultFirestoreService.deleteDocument(documentId),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader
          title={route.params.categoryName}
          subtitle="Private vault documents"
          leftIcon={Folder}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? (
          <VaultSkeleton count={3} />
        ) : documents.length ? (
          <View style={styles.list}>
            {documents.map(document => (
              <DocumentListItem
                key={document.id}
                document={document}
                onPress={() =>
                  navigation.navigate('DocumentDetails', {
                    documentId: document.id,
                    source: document.visibility,
                  })
                }
                onMenuPress={() => openMenu(document.id)}
              />
            ))}
          </View>
        ) : (
          <VaultEmptyState
            title="No documents found"
            message="Upload a document in this category and it will appear here automatically."
          />
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
    list: {
      gap: theme.spacing.sm,
    },
    error: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
    },
  });
