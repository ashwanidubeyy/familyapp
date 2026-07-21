import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Download, Edit3, FileText, Share2, Trash2 } from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useTheme } from '@/hooks';
import type { Theme, VaultStackParamList } from '@/types';

import { vaultFirestoreService } from '../services/firestoreService';
import type { VaultDocument } from '../types';

export const DocumentDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<VaultStackParamList, 'DocumentDetails'>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [document, setDocument] = useState<VaultDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    vaultFirestoreService
      .getDocument(route.params.documentId, route.params.source)
      .then(setDocument)
      .catch(nextError => setError(nextError.message));
  }, [route.params.documentId, route.params.source]);

  const fileUrl = document?.fileUrl ?? document?.url ?? '';
  const isImage = document?.fileType?.startsWith('image');

  const deleteDocument = async () => {
    await vaultFirestoreService.deleteDocument(route.params.documentId);
    navigation.goBack();
  };

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader title="Document" leftIcon={FileText} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {document ? (
          <>
            <View style={styles.preview}>
              {isImage && fileUrl ? (
                <Image source={{ uri: fileUrl }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={styles.pdfPreview}>
                  <FileText size={54} color={theme.colors.primary} strokeWidth={2.2} />
                  <Text style={styles.previewText}>PDF Preview</Text>
                </View>
              )}
            </View>

            <Text style={styles.title}>{document.title}</Text>
            <View style={styles.metaCard}>
              <InfoRow label="Category" value={document.categoryName} />
              <InfoRow label="File Type" value={document.fileType ?? 'Document'} />
              <InfoRow label="File Size" value={String(document.size ?? '-')} />
              <InfoRow label="Expiry Date" value={document.expiryDate ?? '-'} />
              <InfoRow label="Reminder" value={document.reminder ?? document.reminderDate ?? '-'} />
              <InfoRow label="Description" value={document.description || '-'} />
              <InfoRow label="Uploaded Date" value={formatDate(document.createdAt)} />
            </View>

            <View style={styles.actions}>
              <ActionButton title="Download" icon={Download} onPress={() => openUrl(fileUrl)} />
              <ActionButton title="Share" icon={Share2} onPress={() => Alert.alert('Share', 'Share flow ready for integration.')} />
              <ActionButton title="Edit" icon={Edit3} onPress={() => Alert.alert('Edit', 'Edit flow opens Add Document with existing data next.')} />
              <ActionButton title="Delete" icon={Trash2} danger onPress={deleteDocument} />
            </View>
          </>
        ) : null}
      </View>
    </GradientPageView>
  );
};

const openUrl = (url: string) => {
  if (!url) {
    Alert.alert('File unavailable', 'No file URL was found for this document.');
    return;
  }

  Linking.openURL(url);
};

const formatDate = (date: string) => new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date(date));

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const ActionButton: React.FC<{
  title: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  onPress: () => void;
  danger?: boolean;
}> = ({ title, icon: Icon, onPress, danger = false }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.actionButton}>
      <Icon size={18} color={danger ? theme.colors.error : theme.colors.primary} strokeWidth={2.3} />
      <Text style={danger ? styles.actionTextDanger : styles.actionText}>{title}</Text>
    </Pressable>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.lg,
    },
    preview: {
      minHeight: 210,
      borderRadius: 22,
      overflow: 'hidden',
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    image: {
      width: '100%',
      height: 240,
    },
    pdfPreview: {
      flex: 1,
      minHeight: 210,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    previewText: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xxl,
    },
    metaCard: {
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    infoRow: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider,
    },
    infoLabel: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
    },
    infoValue: {
      flex: 1,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      textAlign: 'right',
    },
    actions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    actionButton: {
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 14,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    actionText: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.bold,
    },
    actionTextDanger: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.bold,
    },
    error: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
    },
  });
