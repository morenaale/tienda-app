import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { HeroBanner } from '../../components/catalog/HeroBanner';
import { ProductCard } from '../../components/catalog/ProductCard';
import { useProductsStore } from '../../store/products.store';
import { useCartStore } from '../../store/cart.store';
import { Badge } from '../../components/ui/Badge';
import appConfig from '../../config/app.config';

export default function HomeScreen() {
  const router = useRouter();
  const {
    featured,
    products,
    categories,
    loading,
    fetchProducts,
    fetchCategories,
    fetchFeatured,
  } = useProductsStore();
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFeatured();
  }, [fetchProducts, fetchCategories, fetchFeatured]);

  const latestProducts = products.slice(0, 6);

  const handleRefresh = () => {
    fetchProducts();
    fetchCategories();
    fetchFeatured();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola! 👋</Text>
          <Text style={styles.storeName}>{appConfig.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/cart')}
          >
            <Ionicons name="bag-outline" size={24} color={colors.text} />
            <Badge count={itemCount} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <HeroBanner onExplore={() => router.push('/catalog')} />

        {categories.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categorías</Text>
              <TouchableOpacity onPress={() => router.push('/catalog')}>
                <Text style={styles.seeAll}>Ver todo</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryCard}
                  onPress={() => {
                    useProductsStore.getState().selectCategory(cat.id);
                    router.push('/catalog');
                  }}
                >
                  <View style={styles.categoryIcon}>
                    <Ionicons
                      name="pricetag"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {featured.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Destacados</Text>
              <TouchableOpacity onPress={() => router.push('/catalog')}>
                <Text style={styles.seeAll}>Ver todo</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featured}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProductCard product={item} compact />
              )}
            />
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nuevos productos</Text>
            <TouchableOpacity onPress={() => router.push('/catalog')}>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productGrid}>
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  greeting: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  storeName: {
    ...typography.h3,
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
  },
  seeAll: {
    ...typography.captionBold,
    color: colors.primary,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  categoryCard: {
    alignItems: 'center',
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  categoryName: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
  },
  horizontalList: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  bottomSpacing: {
    height: spacing['2xl'],
  },
});
