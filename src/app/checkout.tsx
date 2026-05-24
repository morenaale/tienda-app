import React, { useState, useEffect } from 'react';
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
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';
import { useOrdersStore } from '../store/orders.store';
import { formatPrice } from '../lib/mercadopago';
import { createPaymentPreference, openPaymentCheckout } from '../lib/mercadopago';
import type { Address, ShippingOption } from '../types';

type Step = 'address' | 'shipping' | 'payment';

export default function CheckoutScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { items, getSubtotal, clearCart } = useCartStore();
  const { createOrder, getShippingOptions, fetchAddresses, addresses } =
    useOrdersStore();

  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [address, setAddress] = useState<Partial<Address>>({
    name: user?.name || '',
    street: '',
    number: '',
    floor: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Argentina',
  });

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const shippingOptions = getShippingOptions();
  const subtotal = getSubtotal();
  const shippingCost = selectedShipping?.price || 0;
  const total = subtotal + shippingCost;

  const handleAddressSubmit = () => {
    if (!address.street || !address.number || !address.city || !address.state || !address.zipCode) {
      Alert.alert('Error', 'Completá todos los campos obligatorios');
      return;
    }
    setStep('shipping');
  };

  const handleShippingSubmit = () => {
    if (!selectedShipping) {
      Alert.alert('Error', 'Seleccioná un método de envío');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const fullAddress: Address = {
        id: '',
        userId: user.id,
        name: address.name || '',
        street: address.street || '',
        number: address.number || '',
        floor: address.floor,
        apartment: address.apartment,
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        country: address.country || 'Argentina',
        isDefault: addresses.length === 0,
      };

      const preference = await createPaymentPreference(
        items,
        fullAddress,
        shippingCost,
      );

      const result = await openPaymentCheckout(preference);

      if (result.success) {
        await createOrder({
          userId: user.id,
          items: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.images[0] || '',
            price: item.product.price,
            quantity: item.quantity,
            variant: item.variant,
          })),
          subtotal,
          shippingCost,
          total,
          status: 'pending',
          shippingAddress: fullAddress,
          paymentMethod: 'mercadopago',
          paymentId: preference.id,
        });

        clearCart();
        Alert.alert(
          '¡Pedido realizado!',
          'Tu pedido fue creado exitosamente. Te enviaremos actualizaciones por email.',
          [{ text: 'Ver pedidos', onPress: () => router.replace('/orders') }],
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Hubo un error al procesar el pago',
      );
    } finally {
      setLoading(false);
    }
  };

  const stepConfig = {
    address: { title: 'Dirección de envío', number: 1 },
    shipping: { title: 'Método de envío', number: 2 },
    payment: { title: 'Pago', number: 3 },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (step === 'address') router.back();
            else if (step === 'shipping') setStep('address');
            else setStep('shipping');
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.steps}>
        {(['address', 'shipping', 'payment'] as Step[]).map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                (step === s || i < stepConfig[step].number - 1) &&
                  styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  (step === s || i < stepConfig[step].number - 1) &&
                    styles.stepNumberActive,
                ]}
              >
                {i < stepConfig[step].number - 1 ? '✓' : i + 1}
              </Text>
            </View>
            <Text style={styles.stepLabel}>{stepConfig[s].title}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 'address' && (
          <View>
            {addresses.length > 0 && (
              <View style={styles.savedAddresses}>
                <Text style={styles.sectionTitle}>Direcciones guardadas</Text>
                {addresses.map((addr) => (
                  <TouchableOpacity
                    key={addr.id}
                    style={styles.addressCard}
                    onPress={() =>
                      setAddress({
                        name: addr.name,
                        street: addr.street,
                        number: addr.number,
                        floor: addr.floor,
                        apartment: addr.apartment,
                        city: addr.city,
                        state: addr.state,
                        zipCode: addr.zipCode,
                        country: addr.country,
                      })
                    }
                  >
                    <Ionicons name="location" size={20} color={colors.primary} />
                    <View style={styles.addressInfo}>
                      <Text style={styles.addressName}>{addr.name}</Text>
                      <Text style={styles.addressDetail}>
                        {addr.street} {addr.number}, {addr.city}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.sectionTitle}>Nueva dirección</Text>
            <Input
              label="Nombre del destinatario"
              value={address.name || ''}
              onChangeText={(text) => setAddress({ ...address, name: text })}
              icon="person-outline"
            />
            <View style={styles.row}>
              <Input
                label="Calle"
                value={address.street || ''}
                onChangeText={(text) => setAddress({ ...address, street: text })}
                containerStyle={styles.flex3}
              />
              <Input
                label="Número"
                value={address.number || ''}
                onChangeText={(text) => setAddress({ ...address, number: text })}
                containerStyle={styles.flex1}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.row}>
              <Input
                label="Piso"
                value={address.floor || ''}
                onChangeText={(text) => setAddress({ ...address, floor: text })}
                containerStyle={styles.flex1}
              />
              <Input
                label="Depto"
                value={address.apartment || ''}
                onChangeText={(text) =>
                  setAddress({ ...address, apartment: text })
                }
                containerStyle={styles.flex1}
              />
            </View>
            <Input
              label="Ciudad"
              value={address.city || ''}
              onChangeText={(text) => setAddress({ ...address, city: text })}
            />
            <View style={styles.row}>
              <Input
                label="Provincia"
                value={address.state || ''}
                onChangeText={(text) => setAddress({ ...address, state: text })}
                containerStyle={styles.flex1}
              />
              <Input
                label="Código postal"
                value={address.zipCode || ''}
                onChangeText={(text) =>
                  setAddress({ ...address, zipCode: text })
                }
                containerStyle={styles.flex1}
                keyboardType="numeric"
              />
            </View>

            <Button
              title="Continuar"
              onPress={handleAddressSubmit}
              fullWidth
              size="lg"
            />
          </View>
        )}

        {step === 'shipping' && (
          <View>
            <Text style={styles.sectionTitle}>Seleccioná el envío</Text>
            {shippingOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.shippingCard,
                  selectedShipping?.id === option.id &&
                    styles.shippingCardSelected,
                ]}
                onPress={() => setSelectedShipping(option)}
              >
                <View style={styles.shippingInfo}>
                  <Ionicons
                    name={
                      option.id === 'pickup'
                        ? 'storefront'
                        : option.id === 'express'
                          ? 'rocket'
                          : 'car'
                    }
                    size={24}
                    color={
                      selectedShipping?.id === option.id
                        ? colors.primary
                        : colors.textSecondary
                    }
                  />
                  <View style={styles.shippingDetails}>
                    <Text style={styles.shippingName}>{option.name}</Text>
                    <Text style={styles.shippingDesc}>
                      {option.description}
                    </Text>
                    <Text style={styles.shippingCarrier}>
                      {option.carrier} · {option.estimatedDays}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.shippingPrice,
                    option.price === 0 && styles.freePrice,
                  ]}
                >
                  {option.price === 0 ? 'Gratis' : formatPrice(option.price)}
                </Text>
              </TouchableOpacity>
            ))}

            <Button
              title="Continuar al pago"
              onPress={handleShippingSubmit}
              fullWidth
              size="lg"
              style={{ marginTop: spacing.xl }}
            />
          </View>
        )}

        {step === 'payment' && (
          <View>
            <Text style={styles.sectionTitle}>Resumen del pedido</Text>

            <View style={styles.orderSummary}>
              {items.map((item) => (
                <View
                  key={`${item.product.id}-${item.variant || ''}`}
                  style={styles.summaryItem}
                >
                  <Text style={styles.summaryItemName} numberOfLines={1}>
                    {item.product.name} x{item.quantity}
                  </Text>
                  <Text style={styles.summaryItemPrice}>
                    {formatPrice(item.product.price * item.quantity)}
                  </Text>
                </View>
              ))}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  {formatPrice(subtotal)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>
                  Envío ({selectedShipping?.name})
                </Text>
                <Text style={styles.summaryValue}>
                  {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatPrice(total)}</Text>
              </View>
            </View>

            <View style={styles.paymentMethod}>
              <View style={styles.mpLogo}>
                <Ionicons name="card" size={24} color="#009EE3" />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Mercado Pago</Text>
                <Text style={styles.paymentDesc}>
                  Pagá con tarjeta, débito o dinero en cuenta
                </Text>
              </View>
            </View>

            <Button
              title={`Pagar ${formatPrice(total)}`}
              onPress={handlePayment}
              loading={loading}
              fullWidth
              size="lg"
            />

            <View style={styles.securityNote}>
              <Ionicons name="lock-closed" size={14} color={colors.textTertiary} />
              <Text style={styles.securityText}>
                Pago seguro procesado por Mercado Pago
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
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
  steps: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    gap: spacing['2xl'],
  },
  stepItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepNumber: {
    ...typography.captionBold,
    color: colors.textTertiary,
    fontSize: 12,
  },
  stepNumberActive: {
    color: colors.textInverse,
  },
  stepLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.base,
  },
  savedAddresses: {
    marginBottom: spacing.xl,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  addressDetail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  flex3: {
    flex: 3,
  },
  shippingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: spacing.md,
  },
  shippingCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F8F7FF',
  },
  shippingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  shippingDetails: {
    flex: 1,
  },
  shippingName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  shippingDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  shippingCarrier: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: 2,
  },
  shippingPrice: {
    ...typography.bodyBold,
    color: colors.text,
  },
  freePrice: {
    color: colors.success,
  },
  orderSummary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryItemName: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    marginRight: spacing.md,
  },
  summaryItemPrice: {
    ...typography.body,
    color: colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  totalLabel: {
    ...typography.h4,
    color: colors.text,
  },
  totalValue: {
    ...typography.price,
    color: colors.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  mpLogo: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: '#E8F4FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  paymentDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  securityText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
});
