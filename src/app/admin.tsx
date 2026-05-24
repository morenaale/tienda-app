import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/auth.store';
import { useOrdersStore } from '../store/orders.store';
import { useProductsStore } from '../store/products.store';
import { formatPrice } from '../lib/mercadopago';
import type { Order, OrderStatus } from '../types';

type AdminTab = 'dashboard' | 'orders' | 'products';

function StatCard({
  icon,
  label,
  value,
  gradientColors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  gradientColors: readonly [string, string, ...string[]];
}) {
  return (
    <View style={styles.statCard}>
      <LinearGradient
        colors={gradientColors}
        style={styles.statIcon}
      >
        <Ionicons name={icon} size={20} color={colors.textInverse} />
      </LinearGradient>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function AdminOrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}) {
  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'shipped',
    shipped: 'delivered',
    delivered: null,
    cancelled: null,
  };

  const next = nextStatus[order.status];

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>#{order.id.slice(0, 8)}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.createdAt).toLocaleDateString('es-AR')}
          </Text>
        </View>
        <StatusBadge status={order.status} />
      </View>
      <Text style={styles.orderItems}>
        {order.items.length} producto{order.items.length > 1 ? 's' : ''} ·{' '}
        {formatPrice(order.total)}
      </Text>
      <View style={styles.orderActions}>
        {next && (
          <Button
            title={`Marcar como ${next}`}
            onPress={() => onUpdateStatus(order.id, next)}
            size="sm"
          />
        )}
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <Button
            title="Cancelar"
            onPress={() => onUpdateStatus(order.id, 'cancelled')}
            variant="ghost"
            size="sm"
            textStyle={{ color: colors.error }}
          />
        )}
      </View>
    </View>
  );
}

export default function AdminScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { orders, loading: ordersLoading, fetchOrders, updateOrderStatus } =
    useOrdersStore();
  const { products, fetchProducts } = useProductsStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    if (user?.role !== 'admin') {
      Alert.alert('Acceso denegado', 'No tenés permisos de administrador');
      router.back();
    }
    fetchOrders();
    fetchProducts();
  }, [user, router, fetchOrders, fetchProducts]);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  const tabs: { key: AdminTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'stats-chart' },
    { key: 'orders', label: 'Pedidos', icon: 'receipt' },
    { key: 'products', label: 'Productos', icon: 'cube' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={
                activeTab === tab.key ? colors.primary : colors.textTertiary
              }
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'dashboard' && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.statsGrid}>
            <StatCard
              icon="wallet"
              label="Ingresos totales"
              value={formatPrice(totalRevenue)}
              gradientColors={colors.gradient.primary}
            />
            <StatCard
              icon="receipt"
              label="Total pedidos"
              value={String(orders.length)}
              gradientColors={colors.gradient.secondary}
            />
            <StatCard
              icon="time"
              label="Pendientes"
              value={String(pendingOrders)}
              gradientColors={colors.gradient.accent}
            />
            <StatCard
              icon="cube"
              label="Productos"
              value={String(products.length)}
              gradientColors={colors.gradient.dark}
            />
          </View>

          <Text style={styles.sectionTitle}>Pedidos recientes</Text>
          {orders.slice(0, 5).map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </ScrollView>
      )}

      {activeTab === 'orders' && (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={ordersLoading}
              onRefresh={fetchOrders}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <AdminOrderCard
              order={item}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        />
      )}

      {activeTab === 'products' && (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Productos ({products.length})</Text>
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  {formatPrice(product.price)} · Stock: {product.stock}
                </Text>
              </View>
              <View
                style={[
                  styles.stockIndicator,
                  product.stock <= 5 && styles.lowStock,
                  product.stock === 0 && styles.noStock,
                ]}
              >
                <Text style={styles.stockText}>
                  {product.stock === 0 ? 'Sin stock' : product.stock}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
  headerTitle: {
    ...typography.h4,
    color: colors.text,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.base,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
  },
  tabActive: {
    backgroundColor: '#F0EEFF',
  },
  tabLabel: {
    ...typography.captionBold,
    color: colors.textTertiary,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  orderId: {
    ...typography.bodyBold,
    color: colors.text,
  },
  orderDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  orderItems: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  orderActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  productMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stockIndicator: {
    backgroundColor: '#ECFFF4',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  lowStock: {
    backgroundColor: '#FFF8EC',
  },
  noStock: {
    backgroundColor: '#FFECEC',
  },
  stockText: {
    ...typography.captionBold,
    color: colors.success,
  },
});
