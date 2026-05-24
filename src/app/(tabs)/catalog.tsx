import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { SearchBar } from '../../components/ui/SearchBar';
import { CategoryChip } from '../../components/catalog/CategoryChip';
import { ProductCard } from '../../components/catalog/ProductCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useProductsStore } from '../../store/products.store';

export default function CatalogScreen() {
  const {
    categories,
    loading,
    searchQuery,
    selectedCategory,
    fetchProducts,
    fetchCategories,
    searchProducts,
    selectCategory,
    getFilteredProducts,
  } = useProductsStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = getFilteredProducts();

  const allCategory = {
    id: 'all',
    name: 'Todos',
    slug: 'todos',
    order: -1,
    active: true,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo</Text>
        <Text style={styles.subtitle}>
          {filteredProducts.length} productos
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={searchProducts}
        placeholder="Buscar productos..."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScroll}
      >
        <CategoryChip
          category={allCategory}
          selected={!selectedCategory}
          onPress={() => selectCategory(null)}
        />
        {categories.map((cat) => (
          <CategoryChip
            key={cat.id}
            category={cat}
            selected={selectedCategory === cat.id}
            onPress={() =>
              selectCategory(selectedCategory === cat.id ? null : cat.id)
            }
          />
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchProducts}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="No encontramos productos"
            message={
              searchQuery
                ? `No hay resultados para "${searchQuery}"`
                : 'No hay productos disponibles en esta categoría'
            }
            actionLabel="Ver todos"
            onAction={() => {
              selectCategory(null);
              searchProducts('');
            }}
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
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  categoriesScroll: {
    maxHeight: 44,
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.base,
  },
  row: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: spacing['2xl'],
  },
});
