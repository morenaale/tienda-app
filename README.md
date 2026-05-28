# 🪺 Nido — Organiza tu vida, comparte tus planes

> Tu espacio para organizar, compartir y conectar. Calendarios, grupos, recuerdos y productividad en una sola plataforma.

## ✨ Concepto

Nido combina planificación personal + calendarios compartidos + grupos + recuerdos + llamadas en una sola plataforma con una estética cálida, relajante y moderna.

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Chambray | `#7A9CB3` | Productividad, focus, color principal |
| Terracotta | `#AD7556` | Botones, highlights, social/plans |
| Sandstone | `#DCCFB8` | Cards y fondos secundarios |
| Muslin | `#F1EFE6` | Fondo principal claro |
| Clove | `#53443D` | Textos y modo oscuro |

## 🛠️ Tech Stack

| Tecnología | Uso |
|---|---|
| Next.js 16 (App Router) | Framework web |
| TypeScript | Tipado estático |
| Tailwind CSS v4 | Estilos utility-first |
| Framer Motion | Animaciones fluidas |
| Lucide React | Iconografía |
| Zustand | Estado global (ready) |

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura

```
src/
├── app/
│   ├── page.tsx          # Dashboard
│   ├── calendar/         # Calendario personal + compartidos
│   ├── groups/           # Grupos y planes
│   ├── memories/         # Fotos, cápsulas de tiempo
│   └── profile/          # Perfil y configuración
├── components/
│   ├── layout/           # AppShell, Sidebar, ThemeProvider
│   └── ui/               # Card, Button (design system)
└── ...
```

## 📋 Funciones Principales

1. **Calendario Personal** — Tareas, eventos, rutinas, metas
2. **Calendarios Compartidos** — Múltiples usuarios, roles, reacciones
3. **Grupos** — Chat, calendario, fotos, llamadas
4. **Memories** — Fotos, videos, cápsulas de tiempo
5. **Llamadas & Watch Party** — Video, compartir pantalla
6. **Productividad** — Pomodoro, focus mode, estadísticas
7. **Social** — Amigos, disponibilidad, planes rápidos

## 🗺️ Roadmap

Ver [PLANNING.md](./PLANNING.md) para el roadmap completo, diseño de BD, estrategias de crecimiento y monetización.

## 📄 Licencia

MIT
