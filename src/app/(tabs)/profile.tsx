import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth.store';
import appConfig from '../../config/app.config';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  badge?: string;
  destructive?: boolean;
}

function MenuItem({ icon, label, onPress, badge, destructive }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View
        style={[
          styles.menuIcon,
          destructive && { backgroundColor: '#FFECEC' },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? colors.error : colors.primary}
        />
      </View>
      <Text
        style={[styles.menuLabel, destructive && { color: colors.error }]}
      >
        {label}
      </Text>
      <View style={styles.menuRight}>
        {badge && (
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textTertiary}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que querés cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: signOut,
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loginPrompt}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.avatarPlaceholder}
          >
            <Ionicons name="person" size={48} color={colors.textInverse} />
          </LinearGradient>
          <Text style={styles.loginTitle}>¡Bienvenido!</Text>
          <Text style={styles.loginMessage}>
            Iniciá sesión para acceder a tu cuenta, ver tus pedidos y más
          </Text>
          <Button
            title="Iniciar sesión"
            onPress={() => router.push('/auth/login')}
            fullWidth
            size="lg"
          />
          <Button
            title="Crear cuenta"
            onPress={() => router.push('/auth/register')}
            variant="outline"
            fullWidth
            size="lg"
            style={{ marginTop: spacing.md }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Mi cuenta</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="receipt"
              label="Mis pedidos"
              onPress={() => router.push('/orders')}
            />
            <MenuItem
              icon="location"
              label="Mis direcciones"
              onPress={() => {}}
            />
            <MenuItem
              icon="notifications"
              label="Notificaciones"
              onPress={() => {}}
            />
          </View>
        </View>

        {user.role === 'admin' && (
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Administración</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="settings"
                label="Panel de administración"
                onPress={() => router.push('/admin')}
                badge="Admin"
              />
            </View>
          </View>
        )}

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Soporte</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="help-circle"
              label="Ayuda y FAQ"
              onPress={() => {}}
            />
            <MenuItem
              icon="chatbubble"
              label="Contactar soporte"
              onPress={() => {}}
            />
            <MenuItem
              icon="logo-whatsapp"
              label="WhatsApp"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.menuCard}>
            <MenuItem
              icon="log-out"
              label="Cerrar sesión"
              onPress={handleSignOut}
              destructive
            />
          </View>
        </View>

        <Text style={styles.version}>
          {appConfig.name} v1.0.0
        </Text>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loginPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  loginTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  loginMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.h1,
    color: colors.textInverse,
  },
  userName: {
    ...typography.h3,
    color: colors.text,
  },
  userEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuSection: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
  },
  menuSectionTitle: {
    ...typography.captionBold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuBadge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  menuBadgeText: {
    ...typography.small,
    color: colors.textInverse,
  },
  version: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  bottomSpacing: {
    height: spacing['2xl'],
  },
});
