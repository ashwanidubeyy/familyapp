import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type NavigationProp, type RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Wrench } from 'lucide-react-native';

import { AppHeader, GradientPageView } from '@/components';
import { useTheme } from '@/hooks';
import type { Theme, VaultStackParamList } from '@/types';

import { getVaultIcon } from '../components/vaultIconMap';
import { vaultStaticData } from '../data/vaultStaticData';

export const MaintenanceListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<VaultStackParamList>>();
  const route = useRoute<RouteProp<VaultStackParamList, 'MaintenanceList'>>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <GradientPageView scroll>
      <View style={styles.content}>
        <AppHeader
          title={route.params.categoryName ?? 'Maintenance'}
          subtitle="Assets, warranty, AMC and service documents"
          leftIcon={Wrench}
        />
        <View style={styles.grid}>
          {vaultStaticData.maintenanceAppliances.map(appliance => {
            const Icon = getVaultIcon(appliance.icon);

            return (
              <Pressable
                key={appliance.id}
                accessibilityRole="button"
                style={styles.card}
                onPress={() => navigation.navigate('MaintenanceDetails', {
                  applianceId: appliance.id,
                  applianceName: appliance.name,
                })}
              >
                <View style={styles.iconWrap}>
                  <Icon size={24} color={theme.colors.primary} strokeWidth={2.4} />
                </View>
                <Text style={styles.title}>{appliance.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </GradientPageView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      gap: theme.spacing.lg,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    card: {
      width: '48%',
      minHeight: 118,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily.bold,
      textAlign: 'center',
    },
  });
