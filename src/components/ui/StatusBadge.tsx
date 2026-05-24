import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import type { OrderStatus } from '../../types';

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: 'Pendiente', color: colors.warning, bg: '#FFF8EC' },
  confirmed: { label: 'Confirmado', color: colors.info, bg: '#ECF4FF' },
  preparing: { label: 'Preparando', color: colors.primary, bg: '#F0EEFF' },
  shipped: { label: 'Enviado', color: colors.accent, bg: '#ECFFF8' },
  delivered: { label: 'Entregado', color: colors.success, bg: '#ECFFF4' },
  cancelled: { label: 'Cancelado', color: colors.error, bg: '#FFECEC' },
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    gap: spacing.xs + 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    ...typography.captionBold,
    fontSize: 12,
  },
});
