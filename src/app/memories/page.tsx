"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Camera,
  Heart,
  MessageCircle,
  Plus,
  Sparkles,
  Lock,
} from "lucide-react";
import { clsx } from "clsx";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

const memories = [
  {
    id: 1,
    type: "photo" as const,
    caption: "Atardecer en la playa",
    group: "Amigos de siempre",
    date: "Hace 2 días",
    likes: 8,
    comments: 3,
    color: "from-terracotta to-chambray",
    height: "h-64",
  },
  {
    id: 2,
    type: "photo" as const,
    caption: "Noche de estudio",
    group: "Study Group",
    date: "Hace 5 días",
    likes: 4,
    comments: 1,
    color: "from-chambray to-chambray-dark",
    height: "h-48",
  },
  {
    id: 3,
    type: "capsule" as const,
    caption: "Cápsula de tiempo - Fin de año",
    group: "Amigos de siempre",
    date: "Se abre en 45 días",
    likes: 0,
    comments: 0,
    color: "from-sandstone-dark to-clove",
    height: "h-48",
  },
  {
    id: 4,
    type: "photo" as const,
    caption: "Road trip Mendoza",
    group: "Viaje a Europa 2025",
    date: "Hace 1 semana",
    likes: 12,
    comments: 6,
    color: "from-terracotta-light to-terracotta",
    height: "h-72",
  },
  {
    id: 5,
    type: "photo" as const,
    caption: "Graduación de Sofi!",
    group: "Facultad",
    date: "Hace 2 semanas",
    likes: 24,
    comments: 15,
    color: "from-chambray-light to-terracotta-light",
    height: "h-56",
  },
  {
    id: 6,
    type: "photo" as const,
    caption: "Asado de cumpleaños",
    group: "Amigos de siempre",
    date: "Hace 3 semanas",
    likes: 16,
    comments: 8,
    color: "from-terracotta to-sandstone-dark",
    height: "h-64",
  },
];

const throwbacks = [
  { title: "Hace 1 año hicieron este plan", event: "Viaje a la costa", group: "Amigos" },
  { title: "Hace 6 meses", event: "Primera sesión de estudio", group: "Study Group" },
];

type Tab = "all" | "photos" | "capsules";

export default function MemoriesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const filtered = memories.filter((m) => {
    if (activeTab === "photos") return m.type === "photo";
    if (activeTab === "capsules") return m.type === "capsule";
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--foreground)]">
            Memories
          </h1>
          <p className="text-sm text-[var(--foreground)] opacity-60">
            Guarda y revive tus mejores momentos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Lock size={14} />}>
            Cápsula
          </Button>
          <Button variant="accent" size="sm" icon={<Plus size={14} />}>
            Subir
          </Button>
        </div>
      </div>

      {/* Throwbacks */}
      {throwbacks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {throwbacks.map((tb) => (
            <Card key={tb.title} glass className="min-w-[280px] flex-shrink-0 !p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta/20 to-chambray/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-terracotta" />
                </div>
                <div>
                  <p className="text-xs font-medium text-terracotta">
                    {tb.title}
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {tb.event}
                  </p>
                  <p className="text-xs text-[var(--foreground)] opacity-50">
                    {tb.group}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-1 w-fit">
        {([
          { key: "all", label: "Todos" },
          { key: "photos", label: "Fotos" },
          { key: "capsules", label: "Cápsulas" },
        ] as { key: Tab; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-chambray text-white"
                : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
      >
        <AnimatePresence>
          {filtered.map((memory) => (
            <motion.div
              key={memory.id}
              variants={item}
              layout
              className="break-inside-avoid"
            >
              <Card className="overflow-hidden !p-0 group">
                {/* Image Placeholder */}
                <div
                  className={clsx(
                    "relative bg-gradient-to-br w-full flex items-center justify-center",
                    memory.color,
                    memory.height
                  )}
                >
                  {memory.type === "capsule" ? (
                    <div className="text-center text-white">
                      <Lock size={32} className="mx-auto mb-2 opacity-80" />
                      <p className="text-sm font-medium opacity-80">
                        Cápsula de tiempo
                      </p>
                      <p className="text-xs opacity-60 mt-1">
                        {memory.date}
                      </p>
                    </div>
                  ) : (
                    <Camera size={32} className="text-white opacity-30" />
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {memory.caption}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[var(--foreground)] opacity-50">
                        {memory.group}
                      </span>
                      <span className="text-xs text-[var(--foreground)] opacity-30">
                        ·
                      </span>
                      <span className="text-xs text-[var(--foreground)] opacity-50">
                        {memory.date}
                      </span>
                    </div>
                  </div>
                  {memory.type === "photo" && (
                    <div className="flex items-center gap-4 mt-2">
                      <button className="flex items-center gap-1 text-xs text-[var(--foreground)] opacity-60 hover:opacity-100 hover:text-terracotta transition-colors">
                        <Heart size={14} />
                        <span>{memory.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-xs text-[var(--foreground)] opacity-60 hover:opacity-100 transition-colors">
                        <MessageCircle size={14} />
                        <span>{memory.comments}</span>
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
