import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import type { Category } from '../../types';

interface CategoryChipProps {
  category: Category;
  selected: boolean;
  onPress: () => void;
}

export function CategoryChip({
  category,
  selected,
  onPress,
}: CategoryChipProps) {
  if (selected) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.chip}
        >
          <Text style={[styles.label, styles.selectedLabel]}>
            {category.name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, styles.unselected]}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  unselected: {
    backgroundColor: colors.surfaceElevated,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  selectedLabel: {
    color: colors.textInverse,
  },
});
