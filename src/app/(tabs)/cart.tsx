import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { CartItemCard } from '../../components/cart/CartItemCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { formatPrice } from '../../lib/mercadopago';
import appConfig from '../../config/app.config';

export default function CartScreen() {
  const router = useRouter();
  const { items, getSubtotal, getShippingCost, getTotal, clearCart } =
    useCartStore();
  const user = useAuthStore((s) => s.user);

  const subtotal = getSubtotal();
  const shippingCost = getShippingCost();
  const total = getTotal();
  const freeShippingRemaining =
    appConfig.shipping.freeShippingThreshold - subtotal;

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Carrito</Text>
        </View>
        <EmptyState
          icon="bag-outline"
          title="Tu carrito está vacío"
          message="Agregá productos desde el catálogo para comenzar tu compra"
          actionLabel="Ir al catálogo"
          onAction={() => router.push('/catalog')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Carrito</Text>
          <Text style={styles.subtitle}>
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </Text>
        </View>
        <Button
          title="Vaciar"
          onPress={clearCart}
          variant="ghost"
          size="sm"
        />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => `${item.product.id}-${item.variant || ''}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CartItemCard item={item} />}
      />

      <View style={styles.summary}>
        {freeShippingRemaining > 0 && (
          <View style={styles.freeShippingBanner}>
            <Text style={styles.freeShippingText}>
              ¡Sumá {formatPrice(freeShippingRemaining)} más para envío gratis!
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      (subtotal / appConfig.shipping.freeShippingThreshold) *
                        100,
                      100,
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Envío</Text>
          <Text
            style={[
              styles.summaryValue,
              shippingCost === 0 && styles.freeShipping,
            ]}
          >
            {shippingCost === 0 ? '¡Gratis!' : formatPrice(shippingCost)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>

        <Button
          title="Continuar compra"
          onPress={handleCheckout}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
  },
  summary: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  freeShippingBanner: {
    backgroundColor: '#F0EEFF',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  freeShippingText: {
    ...typography.caption,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  freeShipping: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  totalLabel: {
    ...typography.h4,
    color: colors.text,
  },
  totalValue: {
    ...typography.price,
    color: colors.primary,
  },
});
