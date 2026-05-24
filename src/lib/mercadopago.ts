import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import appConfig from '../config/app.config';
import type { CartItem, Address } from '../types';

interface PaymentPreference {
  id: string;
  initPoint: string;
  sandboxInitPoint: string;
}

export async function createPaymentPreference(
  items: CartItem[],
  shippingAddress: Address,
  shippingCost: number,
): Promise<PaymentPreference> {
  const mpItems = items.map((item) => ({
    title: item.product.name,
    unit_price: item.product.price,
    quantity: item.quantity,
    currency_id: appConfig.currency,
    picture_url: item.product.images[0],
  }));

  const response = await fetch(
    `${appConfig.supabase.url}/functions/v1/create-payment`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: mpItems,
        shipping_cost: shippingCost,
        payer: {
          address: {
            street_name: shippingAddress.street,
            street_number: parseInt(shippingAddress.number, 10),
            zip_code: shippingAddress.zipCode,
          },
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Error al crear la preferencia de pago');
  }

  return response.json();
}

export async function openPaymentCheckout(
  preference: PaymentPreference,
): Promise<{ success: boolean; paymentId?: string }> {
  const url = __DEV__ ? preference.sandboxInitPoint : preference.initPoint;

  if (Platform.OS === 'web') {
    window.open(url, '_blank');
    return { success: true };
  }

  const result = await WebBrowser.openBrowserAsync(url, {
    dismissButtonStyle: 'close',
    showTitle: true,
  });

  return {
    success: result.type === 'cancel' || result.type === 'dismiss',
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat(appConfig.locale, {
    style: 'currency',
    currency: appConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
