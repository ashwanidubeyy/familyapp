import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useTheme } from '@/hooks';
import type { Theme } from '@/types';

export interface AppHeaderAction {
  icon: LucideIcon;
  accessibilityLabel: string;
  onPress?: () => void;
  badgeCount?: number;
}

interface AppHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  leftIcon?: LucideIcon;
  actions?: AppHeaderAction[];
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  eyebrow,
  subtitle,
  leftIcon: LeftIcon,
  actions = [],
  style,
}) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leading}>
        {LeftIcon ? (
          <View style={styles.iconTile}>
            <LeftIcon size={26} color={theme.colors.primary} strokeWidth={2.6} />
          </View>
        ) : null}
        <View style={styles.titleGroup}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {actions.length ? (
        <View style={styles.actions}>
          {actions.map(action => {
            const Icon = action.icon;

            return (
              <Pressable
                key={action.accessibilityLabel}
                accessibilityRole="button"
                accessibilityLabel={action.accessibilityLabel}
                onPress={action.onPress}
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed,
                ]}
              >
                <Icon
                  size={24}
                  color={theme.colors.primary}
                  strokeWidth={2.4}
                />
                {action.badgeCount ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {Math.min(action.badgeCount, 9)}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    leading: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    iconTile: {
      width: 46,
      height: 46,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#1B2740' : '#EAF1FF',
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: isDark ? 0.16 : 0.12,
      shadowRadius: 10,
      elevation: 3,
    },
    titleGroup: {
      flex: 1,
      minWidth: 0,
    },
    eyebrow: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.semiBold,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
    },
    title: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xxl,
      lineHeight: theme.typography.lineHeight.xxl,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.lineHeight.sm,
      marginTop: 2,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    actionButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#1D2434' : '#FFFFFF',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      shadowColor: '#3B4A6B',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: isDark ? 0.18 : 0.1,
      shadowRadius: 10,
      elevation: 2,
    },
    actionButtonPressed: {
      opacity: 0.72,
    },
    badge: {
      position: 'absolute',
      top: 4,
      right: 4,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.error,
      paddingHorizontal: 4,
    },
    badgeText: {
      color: '#FFFFFF',
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: 10,
      lineHeight: 12,
    },
  });
