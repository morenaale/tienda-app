"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Timer,
  CheckSquare,
  TrendingUp,
  Users,
  Plus,
  Play,
  BookOpen,
  Zap,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const todayEvents = [
  { time: "09:00", title: "Reunión de equipo", color: "bg-chambray" },
  { time: "11:30", title: "Estudiar para examen", color: "bg-terracotta" },
  { time: "14:00", title: "Almuerzo con amigos", color: "bg-chambray-light" },
  { time: "16:00", title: "Gym", color: "bg-terracotta-light" },
  { time: "19:00", title: "Watch party - película", color: "bg-chambray-dark" },
];

const quickActions = [
  { icon: Plus, label: "Nuevo evento", color: "bg-chambray" },
  { icon: Users, label: "Crear grupo", color: "bg-terracotta" },
  { icon: Timer, label: "Focus mode", color: "bg-chambray-dark" },
  { icon: Calendar, label: "Plan rápido", color: "bg-terracotta-dark" },
];

const habits = [
  { name: "Meditar", done: true, streak: 12 },
  { name: "Ejercicio", done: true, streak: 5 },
  { name: "Leer 30 min", done: false, streak: 8 },
  { name: "Journaling", done: false, streak: 3 },
];

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={item} className="space-y-1">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--foreground)]">
          Buenos días, Alejandra
        </h1>
        <p className="text-sm text-[var(--foreground)] opacity-60">
          Tienes 5 eventos hoy y 2 tareas pendientes
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <motion.button
            key={action.label}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] card-shadow hover:card-shadow-hover transition-all"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
              <action.icon size={18} className="text-white" />
            </div>
            <span className="text-sm font-medium text-[var(--foreground)]">
              {action.label}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Schedule */}
        <motion.div variants={item} className="md:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                Hoy
              </h2>
              <Button variant="ghost" size="sm">
                Ver todo
              </Button>
            </div>
            <div className="space-y-3">
              {todayEvents.map((event, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-xs font-mono text-[var(--foreground)] opacity-50 w-12">
                    {event.time}
                  </span>
                  <div className={`w-1 h-8 rounded-full ${event.color}`} />
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {event.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Pomodoro Timer */}
        <motion.div variants={item}>
          <Card className="h-full flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 56 * 0.75} ${2 * Math.PI * 56}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono text-[var(--foreground)]">
                  18:45
                </span>
                <span className="text-xs text-[var(--foreground)] opacity-50">
                  Focus
                </span>
              </div>
            </div>
            <Button variant="accent" icon={<Play size={16} />}>
              Iniciar Pomodoro
            </Button>
            <p className="text-xs text-[var(--foreground)] opacity-50 mt-3">
              3/4 pomodoros hoy
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Habits */}
        <motion.div variants={item}>
          <Card>
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-4">
              Hábitos
            </h2>
            <div className="space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <motion.button
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        habit.done
                          ? "bg-chambray border-chambray"
                          : "border-[var(--border-color)]"
                      }`}
                      whileTap={{ scale: 0.8 }}
                    >
                      {habit.done && (
                        <CheckSquare size={14} className="text-white" />
                      )}
                    </motion.button>
                    <span
                      className={`text-sm ${
                        habit.done
                          ? "line-through opacity-50"
                          : ""
                      } text-[var(--foreground)]`}
                    >
                      {habit.name}
                    </span>
                  </div>
                  <span className="text-xs text-terracotta font-medium">
                    {habit.streak} 🔥
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Productivity Stats */}
        <motion.div variants={item}>
          <Card>
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-4">
              Productividad
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-chambray/10">
                <Timer size={20} className="text-chambray mx-auto mb-1" />
                <p className="text-lg font-bold text-[var(--foreground)]">4.5h</p>
                <p className="text-xs text-[var(--foreground)] opacity-50">Focus hoy</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-terracotta/10">
                <TrendingUp size={20} className="text-terracotta mx-auto mb-1" />
                <p className="text-lg font-bold text-[var(--foreground)]">87%</p>
                <p className="text-xs text-[var(--foreground)] opacity-50">Completado</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-chambray/10">
                <Zap size={20} className="text-chambray mx-auto mb-1" />
                <p className="text-lg font-bold text-[var(--foreground)]">12</p>
                <p className="text-xs text-[var(--foreground)] opacity-50">Racha días</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-terracotta/10">
                <BookOpen size={20} className="text-terracotta mx-auto mb-1" />
                <p className="text-lg font-bold text-[var(--foreground)]">3</p>
                <p className="text-xs text-[var(--foreground)] opacity-50">Sesiones</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Friends Activity */}
        <motion.div variants={item}>
          <Card>
            <h2 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-4">
              Amigos
            </h2>
            <div className="space-y-3">
              {[
                { name: "María", status: "Estudiando", emoji: "📚" },
                { name: "Lucas", status: "Libre", emoji: "☀️" },
                { name: "Sofía", status: "Trabajando", emoji: "💼" },
                { name: "Martín", status: "En el gym", emoji: "💪" },
              ].map((friend) => (
                <div
                  key={friend.name}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sandstone to-chambray-light flex items-center justify-center">
                    <span className="text-xs font-bold text-clove">
                      {friend.name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {friend.name}
                    </p>
                    <p className="text-xs text-[var(--foreground)] opacity-50">
                      {friend.status} {friend.emoji}
                    </p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              ¿Quién está libre?
            </Button>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
