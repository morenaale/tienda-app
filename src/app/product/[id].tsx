import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components/ui/Button';
import { useProductsStore } from '../../store/products.store';
import { useCartStore } from '../../store/cart.store';
import { formatPrice } from '../../lib/mercadopago';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = useProductsStore((s) => s.getProductById(id));
  const addItem = useCartStore((s) => s.addItem);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Producto no encontrado</Text>
          <Button title="Volver" onPress={() => router.back()} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    router.push('/cart');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <Image
            source={{ uri: product.images[currentImage] || 'https://via.placeholder.com/400' }}
            style={styles.mainImage}
            contentFit="cover"
            transition={300}
          />

          <SafeAreaView style={styles.topBar} edges={['top']}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons
                name="share-outline"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </SafeAreaView>

          {discount > 0 && (
            <View style={styles.discountTag}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}

          {product.images.length > 1 && (
            <View style={styles.thumbnails}>
              {product.images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImage(index)}
                  style={[
                    styles.thumbnail,
                    index === currentImage && styles.thumbnailActive,
                  ]}
                >
                  <Image
                    source={{ uri: img }}
                    style={styles.thumbnailImage}
                    contentFit="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceSection}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.compareAtPrice && (
              <Text style={styles.comparePrice}>
                {formatPrice(product.compareAtPrice)}
              </Text>
            )}
          </View>

          {product.stock <= 5 && product.stock > 0 && (
            <View style={styles.stockWarning}>
              <Ionicons name="alert-circle" size={16} color={colors.warning} />
              <Text style={styles.stockWarningText}>
                ¡Solo quedan {product.stock} unidades!
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{product.description}</Text>

          {product.tags.length > 0 && (
            <View style={styles.tags}>
              {product.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={20} color={colors.accent} />
              <Text style={styles.featureText}>Compra segura</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="car" size={20} color={colors.accent} />
              <Text style={styles.featureText}>Envío a todo el país</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="refresh" size={20} color={colors.accent} />
              <Text style={styles.featureText}>30 días de devolución</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() =>
              setQuantity(Math.min(product.stock, quantity + 1))
            }
          >
            <Ionicons name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={product.stock === 0}
          activeOpacity={0.8}
          style={styles.addButtonContainer}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.addButton,
              product.stock === 0 && styles.disabledButton,
            ]}
          >
            <Ionicons name="bag-add" size={20} color={colors.textInverse} />
            <Text style={styles.addButtonText}>
              {product.stock === 0
                ? 'Sin stock'
                : `Agregar ${formatPrice(product.price * quantity)}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base,
  },
  notFoundText: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  imageSection: {
    position: 'relative',
  },
  mainImage: {
    width,
    height: width,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountTag: {
    position: 'absolute',
    top: spacing['5xl'],
    left: spacing.base,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  discountText: {
    ...typography.captionBold,
    color: colors.textInverse,
  },
  thumbnails: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: spacing.base,
    alignSelf: 'center',
    gap: spacing.sm,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing.xl,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -spacing.lg,
  },
  category: {
    ...typography.small,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  price: {
    ...typography.price,
    color: colors.primary,
    fontSize: 28,
  },
  comparePrice: {
    ...typography.body,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
    fontSize: 18,
  },
  stockWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FFF8EC',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  stockWarningText: {
    ...typography.captionBold,
    color: colors.warning,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tag: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  tagText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  features: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    gap: spacing.md,
    marginBottom: spacing['3xl'],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    ...typography.body,
    color: colors.text,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.md,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    ...typography.bodyBold,
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  addButtonContainer: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md + 2,
  },
  addButtonText: {
    ...typography.button,
    color: colors.textInverse,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
