import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import { Button } from '../ui/Button';
import appConfig from '../../config/app.config';

const { width } = Dimensions.get('window');

interface HeroBannerProps {
  onExplore: () => void;
}

export function HeroBanner({ onExplore }: HeroBannerProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.subtitle}>Bienvenido a</Text>
          <Text style={styles.title}>{appConfig.name}</Text>
          <Text style={styles.description}>
            Descubrí los mejores productos con envío a todo el país
          </Text>
          <Button
            title="Explorar catálogo"
            onPress={onExplore}
            variant="outline"
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <View style={styles.decorCircle3} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
  },
  gradient: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    padding: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  subtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.textInverse,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.lg,
    maxWidth: width * 0.6,
  },
  button: {
    borderColor: 'rgba(255,255,255,0.6)',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: colors.textInverse,
  },
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -40,
  },
  decorCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -30,
    right: 40,
  },
  decorCircle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: 20,
    right: 60,
  },
});
