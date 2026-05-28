"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Settings,
  Edit3,
  Calendar,
  Users,
  Camera,
  Timer,
  TrendingUp,
  Award,
  Heart,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stats = [
  { label: "Eventos", value: "128", icon: Calendar },
  { label: "Grupos", value: "5", icon: Users },
  { label: "Memories", value: "89", icon: Camera },
  { label: "Focus hrs", value: "234", icon: Timer },
];

const badges = [
  { name: "Focus Master", emoji: "🎯", desc: "100+ horas de focus" },
  { name: "Social Star", emoji: "⭐", desc: "50+ planes creados" },
  { name: "Early Bird", emoji: "🌅", desc: "30 días madrugando" },
  { name: "Organizadora", emoji: "📋", desc: "Racha de 12 días" },
];

const friends = [
  { name: "María López", status: "online", mutual: 12 },
  { name: "Lucas García", status: "online", mutual: 8 },
  { name: "Sofía Martínez", status: "offline", mutual: 15 },
  { name: "Martín Rodríguez", status: "online", mutual: 6 },
  { name: "Ana Fernández", status: "offline", mutual: 10 },
];

const productivityData = [
  0.8, 0.6, 0.3, 0.9, 0.5, 0.2, 0.7,
  0.4, 0.8, 0.1, 0.6, 0.9, 0.3, 0.5,
  0.7, 0.2, 0.8, 0.4, 0.6, 0.1, 0.9,
  0.5, 0.3, 0.7, 0.8, 0.6, 0.4, 0.2,
];

export default function ProfilePage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-6 max-w-4xl mx-auto space-y-6"
    >
      {/* Profile Header */}
      <motion.div variants={item}>
        <Card className="!p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-terracotta to-chambray flex items-center justify-center">
                <span className="text-3xl font-bold text-white">A</span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-chambray rounded-xl flex items-center justify-center border-2 border-[var(--surface)]">
                <Edit3 size={12} className="text-white" />
              </button>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[var(--surface)]" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-serif text-2xl font-bold text-[var(--foreground)]">
                Alejandra Rivera
              </h1>
              <p className="text-sm text-[var(--foreground)] opacity-60 mt-1">
                @alerivera · Diseñadora UX/UI
              </p>
              <p className="text-sm text-[var(--foreground)] opacity-80 mt-2">
                Organizando mi vida, un plan a la vez ✨
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <div className="flex items-center gap-1 text-xs text-[var(--foreground)] opacity-50">
                  <MapPin size={12} />
                  <span>Buenos Aires, Argentina</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--foreground)] opacity-50">
                  <LinkIcon size={12} />
                  <span>alerivera.design</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={<Settings size={14} />} onClick={() => toast("Editar perfil \u2014 pr\u00f3ximamente")}>
                Editar
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border-color)]">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon size={18} className="text-chambray mx-auto mb-1" />
                <p className="text-lg font-bold text-[var(--foreground)]">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--foreground)] opacity-50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Badges */}
        <motion.div variants={item}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                Logros
              </h2>
              <Award size={18} className="text-terracotta" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <motion.div
                  key={badge.name}
                  className="p-3 rounded-xl bg-[var(--surface-hover)] text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <p className="text-xs font-medium text-[var(--foreground)] mt-1">
                    {badge.name}
                  </p>
                  <p className="text-[10px] text-[var(--foreground)] opacity-50 mt-0.5">
                    {badge.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Friends */}
        <motion.div variants={item}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                Amigos
              </h2>
              <Button variant="ghost" size="sm" onClick={() => toast("Lista completa de amigos \u2014 pr\u00f3ximamente")}>
                Ver todos
              </Button>
            </div>
            <div className="space-y-3">
              {friends.map((friend) => (
                <div
                  key={friend.name}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sandstone to-chambray-light flex items-center justify-center">
                      <span className="text-xs font-bold text-clove">
                        {friend.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--surface)] ${
                        friend.status === "online"
                          ? "bg-green-400"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {friend.name}
                    </p>
                    <p className="text-xs text-[var(--foreground)] opacity-50">
                      {friend.mutual} amigos en común
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toast(`Perfil de ${friend.name}`)}>
                    <Heart size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Productivity Overview */}
      <motion.div variants={item}>
        <Card>
          <h2 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-4">
            Resumen de productividad
          </h2>
          <div className="grid grid-cols-7 gap-1">
            {productivityData.map((intensity, i) => (
                <motion.div
                  key={i}
                  className="aspect-square rounded-md"
                  style={{
                    backgroundColor:
                      intensity > 0.7
                        ? "var(--primary)"
                        : intensity > 0.4
                        ? "var(--accent)"
                        : intensity > 0.2
                        ? "var(--muted)"
                        : "var(--surface-hover)",
                    opacity: 0.4 + intensity * 0.6,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                />
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-[var(--foreground)] opacity-50">
              Últimas 4 semanas
            </span>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-xs font-medium text-green-500">
                +23% vs mes anterior
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
