import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { useOrdersStore } from '../store/orders.store';
import { formatPrice } from '../lib/mercadopago';
import type { Order } from '../types';

function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>Pedido #{order.id.slice(0, 8)}</Text>
          <Text style={styles.orderDate}>{date}</Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.cardItems}>
        {order.items.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.itemText} numberOfLines={1}>
            {item.quantity}x {item.productName}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{order.items.length - 2} productos más
          </Text>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
        {order.trackingCode && (
          <View style={styles.tracking}>
            <Ionicons name="locate" size={14} color={colors.accent} />
            <Text style={styles.trackingText}>{order.trackingCode}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, loading, fetchOrders } = useOrdersStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis pedidos</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchOrders}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => <OrderCard order={item} />}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="Sin pedidos"
            message="Todavía no realizaste ningún pedido"
            actionLabel="Ir a comprar"
            onAction={() => router.push('/catalog')}
          />
        }
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h4,
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderId: {
    ...typography.bodyBold,
    color: colors.text,
  },
  orderDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardItems: {
    marginBottom: spacing.md,
  },
  itemText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  moreItems: {
    ...typography.captionBold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  orderTotal: {
    ...typography.priceSmall,
    color: colors.primary,
  },
  tracking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  trackingText: {
    ...typography.captionBold,
    color: colors.accent,
  },
});
