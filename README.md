# 🛍️ Tienda App

Aplicación móvil e-commerce multiplataforma (Android, iOS y Web) construida con **React Native + Expo SDK 56**.

Diseñada para ser **reutilizable**: cambiá colores, branding y productos para adaptarla a cualquier emprendimiento.

## ✨ Funcionalidades

- 📱 **App nativa** para Android e iOS + versión web
- 🛒 **Catálogo completo** con categorías, búsqueda y filtros
- 🛍️ **Carrito de compras** persistente
- 💳 **Pagos con Mercado Pago** (tarjeta, débito, dinero en cuenta)
- 🚚 **Sistema de envíos** con múltiples opciones
- 👤 **Autenticación** (email/password + Google)
- 🔔 **Notificaciones push** (Expo Notifications)
- 🎨 **Diseño aesthetic y moderno** con gradientes y animaciones
- 📊 **Panel administrador** (dashboard, gestión de pedidos y productos)
- 🏗️ **Arquitectura escalable** con Zustand + Supabase

## 🛠️ Tech Stack

| Tecnología | Uso |
|---|---|
| React Native + Expo SDK 56 | Framework multiplataforma |
| TypeScript | Tipado estático |
| Expo Router v5 | Navegación file-based |
| Zustand | Estado global |
| Supabase | Backend (Auth, DB, Storage, Edge Functions) |
| Mercado Pago | Procesamiento de pagos |
| Expo Notifications | Notificaciones push |
| Expo Image | Imágenes optimizadas |

## 📁 Estructura del Proyecto

```
tienda-app/
├── src/
│   ├── app/                    # Pantallas (Expo Router)
│   │   ├── (tabs)/             # Tab navigation
│   │   │   ├── index.tsx       # Home
│   │   │   ├── catalog.tsx     # Catálogo
│   │   │   ├── cart.tsx        # Carrito
│   │   │   └── profile.tsx     # Perfil
│   │   ├── auth/               # Login / Registro
│   │   ├── product/[id].tsx    # Detalle de producto
│   │   ├── checkout.tsx        # Checkout (3 pasos)
│   │   ├── orders.tsx          # Mis pedidos
│   │   └── admin.tsx           # Panel admin
│   ├── components/             # Componentes reutilizables
│   │   ├── ui/                 # Button, Input, Badge, etc.
│   │   ├── catalog/            # ProductCard, CategoryChip, HeroBanner
│   │   └── cart/               # CartItemCard
│   ├── config/                 # Configuración white-label
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Supabase, Mercado Pago
│   ├── store/                  # Zustand stores
│   ├── theme/                  # Colores, tipografía, espaciado
│   └── types/                  # TypeScript types
├── supabase/
│   ├── schema.sql              # Schema de la base de datos
│   └── functions/              # Edge Functions (pagos)
├── assets/                     # Iconos y splash screen
├── app.json                    # Configuración Expo
├── eas.json                    # Configuración de builds
└── .env.example                # Variables de entorno
```

## 🚀 Instalación y Setup

### Prerrequisitos

- Node.js >= 20
- npm o yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)

### 1. Clonar e instalar

```bash
git clone https://github.com/morenaale/tienda-app.git
cd tienda-app
npm install
```

### 2. Configurar Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com)
2. Ejecutá el schema SQL en el SQL Editor:
   - Abrí `supabase/schema.sql` y ejecutalo en Supabase Dashboard → SQL Editor
3. Copiá la URL y la anon key del proyecto

### 3. Configurar Mercado Pago

1. Creá una app en [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Obtené las credenciales de prueba (sandbox)
3. Configurá la Edge Function:
   ```bash
   supabase secrets set MP_ACCESS_TOKEN=tu-access-token
   supabase functions deploy create-payment
   ```

### 4. Variables de entorno

```bash
cp .env.example .env
# Completá con tus credenciales
```

### 5. Ejecutar la app

```bash
# Desarrollo (web)
npm run web

# Con Expo Go (escanear QR)
npm start

# Android
npm run android

# iOS
npm run ios
```

## 📱 Compilar y Publicar

### Configuración inicial de EAS

```bash
# Login en Expo
eas login

# Configurar el proyecto
eas build:configure
```

### Compilar para Android

```bash
# APK de prueba (distribución interna)
eas build --platform android --profile preview

# AAB de producción (para Google Play)
eas build --platform android --profile production
```

### Compilar para iOS

```bash
# Build de desarrollo (simulador)
eas build --platform ios --profile development

# Build de producción (App Store)
eas build --platform ios --profile production
```

> ⚠️ Para iOS necesitás una cuenta de Apple Developer ($99/año).

### Publicar en las tiendas

#### Google Play Store

1. Creá una cuenta de desarrollador en [Google Play Console](https://play.google.com/console) ($25 una vez)
2. Creá la app en la consola
3. Subí el AAB:
   ```bash
   eas submit --platform android --profile production
   ```

#### Apple App Store

1. Tené una cuenta de [Apple Developer](https://developer.apple.com) ($99/año)
2. Creá la app en App Store Connect
3. Configurá `eas.json` con tu Apple ID y Team ID
4. Subí el build:
   ```bash
   eas submit --platform ios --profile production
   ```

### Actualizar la app sin recompilar (OTA)

```bash
# Publicar actualización over-the-air
eas update --branch production --message "Descripción del cambio"
```

## 🎨 Personalización (White-Label)

Para adaptar la app a otro emprendimiento:

### 1. Colores y branding

Editá `src/theme/colors.ts`:

```typescript
export const colors = {
  primary: '#TU_COLOR_PRIMARIO',
  secondary: '#TU_COLOR_SECUNDARIO',
  // ...
};
```

### 2. Configuración del negocio

Editá `src/config/app.config.ts`:

```typescript
const appConfig = {
  name: 'Tu Marca',
  currency: 'ARS',
  shipping: {
    freeShippingThreshold: 50000,
    baseShippingCost: 2500,
  },
  // ...
};
```

### 3. Iconos y splash screen

Reemplazá los archivos en `assets/`:
- `icon.png` (1024x1024)
- `favicon.png` (48x48)
- `android-icon-foreground.png`

### 4. Productos y categorías

Cargá tus productos desde el panel admin de Supabase o directamente desde la app (panel administrador).

## 📋 Variables de Entorno

| Variable | Descripción |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `EXPO_PUBLIC_MP_PUBLIC_KEY` | Clave pública de Mercado Pago |
| `MP_ACCESS_TOKEN` | Access token de Mercado Pago (solo backend) |

## 🗄️ Base de Datos

El schema de Supabase incluye:

- **profiles**: Usuarios con roles (customer/admin)
- **categories**: Categorías de productos
- **products**: Catálogo con variantes, stock, precios
- **orders**: Pedidos con estado y tracking
- **addresses**: Direcciones de envío
- **push_tokens**: Tokens para notificaciones push

Todas las tablas tienen **Row Level Security (RLS)** configurado.

## 📄 Licencia

MIT
