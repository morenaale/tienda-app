# 🌿 NIDO — Tu espacio para organizar, compartir y conectar

## Propuestas de Nombre

| Nombre | Concepto |
|--------|----------|
| **Nido** | Hogar, calidez, comunidad. "Tu nido digital" |
| **Marea** | Flujo natural, conexión, movimiento orgánico |
| **Orbita** | Círculos sociales, planetas = grupos, gravedad = conexión |
| **Trama** | Tejer conexiones, hilos de vida, tapiz colaborativo |
| **Brisa** | Ligereza, frescura, simplicidad |

**Recomendación principal: NIDO**
- Evoca calidez y pertenencia
- Fácil de recordar en cualquier idioma
- Posibilidades de branding orgánico/natural
- Tagline: *"Organiza tu vida, comparte tus planes, guarda tus recuerdos"*

---

## Branding Completo

### Identidad Visual
- **Logo:** Forma abstracta de nido/hogar con líneas curvas suaves
- **Iconografía:** Line icons con bordes redondeados, 2px stroke
- **Ilustraciones:** Estilo flat con texturas grain sutiles
- **Fotografía:** Tonos cálidos, filtros earth-tone

### Tipografías
- **Títulos:** `Playfair Display` (serif elegante)
- **Interfaz:** `Inter` (sans minimalista, excelente legibilidad)
- **Monospace (código/timers):** `JetBrains Mono`

### Tono de Voz
- Cercano pero no infantil
- Inspirador sin ser motivational-speaker
- Cálido y natural
- Ejemplos: "¿Listo para planear algo increíble?", "Hace 1 año vivieron este momento"

---

## Arquitectura General del Proyecto

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│         Next.js 14 (App Router) + TypeScript         │
│         Tailwind CSS + Framer Motion                │
└─────────────────────┬───────────────────────────────┘
                      │ REST + WebSocket
┌─────────────────────┴───────────────────────────────┐
│                   BACKEND                            │
│            Node.js + Express + Socket.io            │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ Auth     │ │ Calendar │ │ Real-time/Chat   │   │
│  │ Service  │ │ Service  │ │ Service          │   │
│  └──────────┘ └──────────┘ └──────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ Groups   │ │ Memories │ │ Calls/WebRTC     │   │
│  │ Service  │ │ Service  │ │ Service          │   │
│  └──────────┘ └──────────┘ └──────────────────┘   │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────┐
│                 DATA LAYER                           │
│  PostgreSQL (principal) + Redis (cache/sessions)    │
│  S3/Cloudflare R2 (media) + Firebase (push notif)  │
└─────────────────────────────────────────────────────┘
```

### Stack Tecnológico

| Capa | Tecnología | Razón |
|------|-----------|-------|
| Frontend | Next.js 14 + TypeScript | SSR, routing, performance |
| Styling | Tailwind CSS + CSS Modules | Utility-first, customizable |
| Animaciones | Framer Motion | Animaciones declarativas fluidas |
| State | Zustand + React Query | Ligero, performante |
| Backend | Node.js + Express | Ecosistema, velocidad de desarrollo |
| Real-time | Socket.io | Bidireccional, fallbacks automáticos |
| DB | PostgreSQL + Prisma ORM | Relacional, tipado, migraciones |
| Cache | Redis | Sessions, pub/sub, rate limiting |
| Auth | NextAuth.js | Google, Apple, Email, OAuth |
| Video | WebRTC + Mediasoup | P2P + SFU para grupos |
| Storage | Cloudflare R2 | Económico, compatible S3 |
| Push | Firebase Cloud Messaging | Cross-platform |
| Deploy | Vercel (front) + Railway (back) | Escalable, DX excelente |

---

## Diseño de Base de Datos

### Entidades Principales

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  status ENUM('libre', 'ocupado', 'estudiando', 'trabajando'),
  theme_preference ENUM('light', 'dark', 'system'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Amistades
CREATE TABLE friendships (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  friend_id UUID REFERENCES users(id),
  status ENUM('pending', 'accepted', 'blocked'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Calendarios
CREATE TABLE calendars (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  type ENUM('personal', 'shared'),
  color VARCHAR(7),
  invite_code VARCHAR(20) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Miembros de calendario
CREATE TABLE calendar_members (
  calendar_id UUID REFERENCES calendars(id),
  user_id UUID REFERENCES users(id),
  role ENUM('admin', 'editor', 'viewer'),
  PRIMARY KEY (calendar_id, user_id)
);

-- Eventos
CREATE TABLE events (
  id UUID PRIMARY KEY,
  calendar_id UUID REFERENCES calendars(id),
  creator_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  all_day BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  color VARCHAR(7),
  location TEXT,
  type ENUM('task', 'event', 'routine', 'reminder', 'goal'),
  status ENUM('pending', 'completed', 'cancelled'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Grupos
CREATE TABLE groups (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  category ENUM('amigos', 'facultad', 'trabajo', 'viaje', 'otro'),
  invite_code VARCHAR(20) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Miembros de grupo
CREATE TABLE group_members (
  group_id UUID REFERENCES groups(id),
  user_id UUID REFERENCES users(id),
  role ENUM('admin', 'member'),
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- Mensajes de chat
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  type ENUM('text', 'image', 'video', 'file', 'system'),
  reply_to UUID REFERENCES messages(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Memories
CREATE TABLE memories (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  creator_id UUID REFERENCES users(id),
  type ENUM('photo', 'video', 'capsule'),
  media_url TEXT NOT NULL,
  caption TEXT,
  event_id UUID REFERENCES events(id),
  unlock_date TIMESTAMP, -- para cápsulas de tiempo
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reacciones
CREATE TABLE reactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  target_type ENUM('event', 'memory', 'message'),
  target_id UUID,
  emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sesiones de productividad
CREATE TABLE productivity_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type ENUM('pomodoro', 'focus', 'study'),
  duration_minutes INT,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

-- Hábitos
CREATE TABLE habits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(100),
  frequency ENUM('daily', 'weekly', 'custom'),
  streak INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  title VARCHAR(200),
  body TEXT,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Estructura de Pantallas y UX Flow

### Navegación Principal (Mobile Bottom Tab / Desktop Sidebar)
1. **Inicio** — Dashboard personalizado
2. **Calendario** — Vista personal + compartidos
3. **Grupos** — Lista de grupos y chats
4. **Memories** — Galería de recuerdos
5. **Perfil** — Configuración y social

### Flow Principal del Usuario

```
Onboarding → Dashboard → [Calendario | Grupos | Memories | Social]
     │
     ├── Crear cuenta (Google/Apple/Email)
     ├── Elegir avatar y nombre
     ├── Seleccionar intereses
     ├── Tutorial interactivo (3 pantallas)
     └── Invitar amigos
```

### Pantallas Detalladas

| Pantalla | Elementos Clave |
|----------|----------------|
| Dashboard | Resumen del día, próximos eventos, quick actions, widgets |
| Calendario Personal | Vista día/semana/mes, drag&drop, filtros, mini-widgets |
| Calendario Compartido | Eventos de múltiples personas, colores por usuario |
| Grupo | Chat, calendario, fotos, miembros, llamadas |
| Memories Feed | Scroll infinito, "Hace X tiempo...", reacciones |
| Memory Detail | Foto/video full, comentarios, info del evento |
| Perfil | Avatar, stats, amigos, configuración |
| Focus Mode | Timer, música ambiente, stats en vivo |
| Llamada | Video grid, chat lateral, compartir pantalla |
| Watch Party | Video sincronizado, reactions, chat |

---

## Sistema de Notificaciones

### Tipos de Notificaciones
1. **Push** — Eventos próximos, invitaciones, mensajes
2. **In-app** — Badge en navegación, feed de actividad
3. **Email** — Resumen semanal, invitaciones pendientes

### Reglas de Prioridad
- **Alta:** Llamada entrante, evento en 5 min
- **Media:** Nuevo mensaje, invitación a grupo
- **Baja:** Reacciones, memories antiguos

### Smart Notifications
- No molestar durante Focus Mode
- Agrupar notificaciones del mismo grupo
- "Hace 1 año hicieron este plan" — memories automáticos
- Sugerencias: "3 amigos están libres el sábado"

---

## Sistema de Gamificación

### Elementos
- **Rachas:** Días consecutivos usando la app
- **Badges:** "Organizador experto", "Alma del grupo", "Focus master"
- **Niveles de productividad:** Basados en horas de focus
- **Achievements grupales:** "100 planes juntos", "1 año de grupo"

### Mechanics
- XP por completar tareas, crear eventos, subir memories
- Leaderboard amistoso entre amigos
- Desafíos semanales: "Completa 5 pomodoros" 
- Plantas virtuales que crecen con productividad (aesthetic)

---

## Estrategia de Crecimiento

### Ideas Virales para TikTok/Reels
1. "POV: organizas tu vida con aesthetic vibes" — mostrar la UI
2. "Mi grupo de amigos planea TODO aquí" — demo de calendarios compartidos
3. "Hace 1 año..." — feature de memories (emocional)
4. "Study with me usando Nido" — Focus mode + timer
5. "Cómo organizo mi semana en 2 minutos" — speed setup
6. "El grupo de WhatsApp pero aesthetic" — comparación
7. "Watch party con mis amigos a distancia" — feature demo
8. Challenges: "#MiNidoChallenge — muestra tu setup"

### Estrategia de Lanzamiento
1. **Waitlist con early access** — crear FOMO
2. **Invite-only al inicio** — exclusividad
3. **Influencers de productividad y lifestyle**
4. **Contenido orgánico:** templates, tips, aesthetic setups
5. **Referral system:** invita 3 amigos = 1 mes de "Expandí tu Nido ✨"

### Crecimiento Orgánico
- Los calendarios compartidos son inherentemente virales
- Cada grupo nuevo = más usuarios invitados
- Memories compartidos = contenido shareable
- Study rooms públicas = descubrimiento

---

## Ideas de Monetización

### Filosofía: "Expandí tu Nido ✨"

La versión gratuita debe sentirse **completa, cómoda y usable**. Sin anuncios para nadie — los ads rompen la esencia cálida e íntima de Nido. El premium no bloquea funciones básicas: se siente como "quiero expandir mi experiencia", no como "me están limitando". La gente paga porque ama la experiencia, no porque la app los frena.

### Modelo Freemium

| Feature | Free | Expandí tu Nido ✨ ($4.99/mes) |
|---------|------|-------------------------------|
| Calendarios personales | ✅ | ✅ |
| Calendarios compartidos | 4 | Ilimitados |
| Grupos | 4 | Ilimitados |
| Sin anuncios | ✅ | ✅ |
| Memories storage | 2 GB | 50 GB |
| Watch party / rooms | 4 personas | 20 personas |
| Themes aesthetic | 3 básicos | Colección completa + exclusivos |
| Widgets avanzados | Básicos (Pomodoro, hábitos) | Todos (mood tracker, stats, music) |
| Estadísticas de productividad | Resumen semanal | Detalladas + historial + insights |
| Cápsulas de tiempo | 2/mes | Ilimitadas |
| IA y personalización | ❌ | ✅ (sugerencias, recap, smart scheduling) |

### Por qué este modelo funciona
- **No frena el crecimiento:** 4 grupos y 4 calendarios compartidos gratis = la gente invita amigos sin toparse con un paywall. Lo viral de Nido es que cada grupo nuevo trae más usuarios.
- **Sin ads para todos:** La app se siente como "tu espacio", no como una red social corporativa. Protege la identidad cálida y aesthetic.
- **Premium aspiracional:** El usuario quiere más porque ama la experiencia, no porque le faltan cosas básicas. "Expandí tu Nido" suena a crecimiento personal, no a desbloquear features.

### Revenue Streams Adicionales
- **Nido Teams** ($9.99/mes) — para empresas/universidades con admin panel, analytics y roles avanzados
- **Marketplace de themes** — packs aesthetic creados por la comunidad (Nido se queda con comisión)
- **API para integraciones** — Spotify, Netflix, Google Calendar, etc.

---

## Funciones Innovadoras

1. **"¿Quién está libre?"** — ver disponibilidad de amigos y proponer planes
2. **Cápsulas de tiempo** — contenido que se desbloquea en una fecha futura
3. **Mood Calendar** — registro diario de estado de ánimo con colores
4. **Playlist compartida** — música de fondo para study sessions
5. **Plan Templates** — "Noche de películas", "Sesión de estudio", "Road trip"
6. **AI Suggestions** — "Basado en tu horario, el mejor momento para ver a María es..."
7. **Recap semanal** — resumen visual de la semana (stories-style)
8. **Quick Plans** — crear un plan en 2 taps y enviar a amigos
9. **Collaborative To-do** — listas compartidas dentro de grupos
10. **Virtual Study Café** — rooms públicas temáticas para estudiar

---

## Roadmap: MVP → App Completa

### Fase 1 — MVP (Semanas 1-4)
- [x] Design system y componentes base
- [ ] Auth (Google + Email)
- [ ] Calendario personal (CRUD eventos)
- [ ] Dashboard con widgets básicos
- [ ] Perfil de usuario
- [ ] Modo oscuro/claro

### Fase 2 — Social (Semanas 5-8)
- [ ] Sistema de amigos
- [ ] Calendarios compartidos
- [ ] Grupos básicos (crear, invitar, chat)
- [ ] Notificaciones push

### Fase 3 — Memories & Media (Semanas 9-12)
- [ ] Subir fotos/videos
- [ ] Feed de memories
- [ ] Cápsulas de tiempo
- [ ] Recuerdos automáticos

### Fase 4 — Comunicación (Semanas 13-16)
- [ ] Chat en tiempo real
- [ ] Videollamadas (WebRTC)
- [ ] Watch party básico
- [ ] Study rooms

### Fase 5 — Productividad (Semanas 17-20)
- [ ] Pomodoro timer
- [ ] Focus mode
- [ ] Estadísticas
- [ ] Hábitos y rachas
- [ ] Gamificación

### Fase 6 — Polish & Launch (Semanas 21-24)
- [ ] Onboarding completo
- [ ] Performance optimization
- [ ] PWA / Mobile optimization
- [ ] Beta testing
- [ ] Launch público

---

## Experiencia Mobile vs Desktop

### Mobile (Primary)
- Bottom tab navigation
- Gestos swipe para navegar
- Pull-to-refresh
- Floating action button para crear
- Compact cards
- Full-screen modals

### Desktop
- Sidebar navigation expandible
- Multi-panel layout
- Keyboard shortcuts
- Drag & drop avanzado
- Hover states
- Split view (calendario + chat)

---

## Onboarding Experience

1. **Pantalla de bienvenida** — Animación del logo + tagline
2. **"¿Cómo quieres usar Nido?"** — Selección: productividad, social, ambos
3. **Crear perfil** — Foto, nombre, bio corta
4. **Conectar calendario** — Importar de Google Calendar (opcional)
5. **Invitar amigos** — Contactos, link, QR
6. **Tour interactivo** — 3 tooltips mostrando features clave
7. **"¡Listo! Tu nido está preparado"** — Confetti + dashboard

---

## Diseño de Widgets Aesthetic/Productivity

### Widget: Pomodoro Timer
- Círculo animado con progreso
- Colores Chambray (focus) / Terracotta (break)
- Sonido ambient opcional
- Stats: "3/4 pomodoros hoy"

### Widget: Habit Tracker
- Grid estilo GitHub contributions
- Colores que van de Sandstone (vacío) a Chambray (completo)
- Animación satisfactoria al completar

### Widget: Quick Notes
- Sticky note style con Sandstone background
- Handwriting-style font opcional
- Drag para reordenar

### Widget: Mood Tracker
- Emoji selector diario
- Mini gráfico semanal
- Correlación con productividad

### Widget: Today's Schedule
- Timeline vertical minimalista
- Color coding por tipo de evento
- "Siguiente en 45 min: Reunión equipo"

### Widget: Friends Activity
- "María está estudiando 🎯"
- "Lucas creó un plan para el sábado"
- Dots de actividad en tiempo real
