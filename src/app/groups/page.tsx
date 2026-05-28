"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Plus,
  MessageCircle,
  Calendar,
  Camera,
  Phone,
  MoreHorizontal,
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

const groups = [
  {
    id: 1,
    name: "Amigos de siempre",
    category: "amigos",
    members: 8,
    lastMessage: "María: ¿Quién viene el sábado?",
    unread: 3,
    gradient: "from-chambray to-chambray-dark",
    avatar: "wave",
  },
  {
    id: 2,
    name: "Facultad - Ingeniería",
    category: "facultad",
    members: 15,
    lastMessage: "Lucas: Subí los apuntes al drive",
    unread: 7,
    gradient: "from-terracotta to-terracotta-dark",
    avatar: "books",
  },
  {
    id: 3,
    name: "Trabajo - Equipo Design",
    category: "trabajo",
    members: 6,
    lastMessage: "Sofía: La presentación está lista",
    unread: 0,
    gradient: "from-chambray-light to-chambray",
    avatar: "briefcase",
  },
  {
    id: 4,
    name: "Viaje a Europa 2025",
    category: "viaje",
    members: 4,
    lastMessage: "Martín: Encontré vuelos baratos!",
    unread: 12,
    gradient: "from-terracotta-light to-terracotta",
    avatar: "plane",
  },
  {
    id: 5,
    name: "Study Group - Finales",
    category: "facultad",
    members: 5,
    lastMessage: "Ana: Sesión de estudio mañana?",
    unread: 2,
    gradient: "from-chambray-dark to-chambray",
    avatar: "target",
  },
];

const initialPlans = [
  { title: "Cine este viernes", group: "Amigos de siempre", votes: 5, total: 8, voted: false },
  { title: "Sesión de estudio - Álgebra", group: "Study Group", votes: 4, total: 5, voted: false },
  { title: "Asado de fin de cursada", group: "Facultad", votes: 10, total: 15, voted: false },
];

const avatarMap: Record<string, string> = {
  wave: "🌊",
  books: "📚",
  briefcase: "💼",
  plane: "✈️",
  target: "🎯",
};

export default function GroupsPage() {
  const [plans, setPlans] = useState(initialPlans);

  const votePlan = (index: number, attending: boolean) => {
    setPlans((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        if (p.voted) return p;
        return {
          ...p,
          voted: true,
          votes: attending ? p.votes + 1 : p.votes,
        };
      })
    );
    toast(attending ? "Te apuntaste al plan!" : "Marcaste que no podés");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--foreground)]">
            Grupos
          </h1>
          <p className="text-sm text-[var(--foreground)] opacity-60">
            {groups.length} grupos activos
          </p>
        </div>
        <Button variant="accent" icon={<Plus size={16} />} onClick={() => toast("Crear grupo — próximamente")}>
          Nuevo grupo
        </Button>
      </motion.div>

      {/* Upcoming Plans */}
      <motion.div variants={item}>
        <h2 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-3">
          Planes pendientes
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {plans.map((plan, index) => (
            <Card key={plan.title} className="min-w-[250px] flex-shrink-0">
              <p className="text-sm font-medium text-[var(--foreground)]">
                {plan.title}
              </p>
              <p className="text-xs text-[var(--foreground)] opacity-50 mt-1">
                {plan.group}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-[var(--surface-hover)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-chambray to-terracotta rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(plan.votes / plan.total) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
                <span className="text-xs font-medium text-[var(--foreground)]">
                  {plan.votes}/{plan.total}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                {plan.voted ? (
                  <span className="text-xs text-chambray font-medium py-1.5">Ya votaste</span>
                ) : (
                  <>
                    <Button variant="primary" size="sm" onClick={() => votePlan(index, true)}>
                      Me apunto
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => votePlan(index, false)}>
                      No puedo
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Groups List */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
          Mis grupos
        </h2>
        {groups.map((group) => (
          <motion.div
            key={group.id}
            variants={item}
            whileHover={{ x: 4 }}
          >
            <Card className="!p-3">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${group.gradient} flex items-center justify-center text-xl`}>
                  {avatarMap[group.avatar] ?? "📌"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--foreground)] truncate">
                      {group.name}
                    </h3>
                    {group.unread > 0 && (
                      <span className="px-1.5 py-0.5 bg-terracotta text-white text-[10px] font-bold rounded-full flex-shrink-0">
                        {group.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--foreground)] opacity-50 truncate mt-0.5">
                    {group.lastMessage}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toast(`Chat de ${group.name} — próximamente`)}
                    className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <MessageCircle size={16} className="text-[var(--foreground)] opacity-60" />
                  </button>
                  <button
                    onClick={() => toast(`Llamando a ${group.name}...`)}
                    className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <Phone size={16} className="text-[var(--foreground)] opacity-60" />
                  </button>
                  <button
                    onClick={() => toast("Más opciones — próximamente")}
                    className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <MoreHorizontal size={16} className="text-[var(--foreground)] opacity-60" />
                  </button>
                </div>
              </div>
              {/* Group Quick Stats */}
              <div className="flex items-center gap-4 mt-3 pl-16">
                <div className="flex items-center gap-1 text-xs text-[var(--foreground)] opacity-50">
                  <Users size={12} />
                  <span>{group.members}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--foreground)] opacity-50">
                  <Calendar size={12} />
                  <span>3 eventos</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[var(--foreground)] opacity-50">
                  <Camera size={12} />
                  <span>12 fotos</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
