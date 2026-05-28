"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Calendar,
} from "lucide-react";
import { clsx } from "clsx";
import { toast } from "@/components/ui/Toast";

type ViewMode = "day" | "week" | "month";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const sampleEvents = [
  { id: 1, title: "Reunión de equipo", time: "09:00 - 10:00", day: 15, color: "bg-chambray" },
  { id: 2, title: "Estudiar para examen", time: "11:30 - 13:00", day: 15, color: "bg-terracotta" },
  { id: 3, title: "Almuerzo con amigos", time: "14:00 - 15:00", day: 16, color: "bg-chambray-light" },
  { id: 4, title: "Gym", time: "16:00 - 17:00", day: 17, color: "bg-terracotta-light" },
  { id: 5, title: "Watch party", time: "19:00 - 21:00", day: 18, color: "bg-chambray-dark" },
  { id: 6, title: "Brunch grupal", time: "11:00 - 13:00", day: 20, color: "bg-terracotta" },
  { id: 7, title: "Deadline proyecto", time: "23:59", day: 22, color: "bg-terracotta-dark" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(15);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date().getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const dayEvents = selectedDay
    ? sampleEvents.filter((e) => e.day === selectedDay)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-2xl font-bold text-[var(--foreground)]">
            Calendario
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
            >
              <ChevronLeft size={18} className="text-[var(--foreground)]" />
            </button>
            <span className="text-sm font-medium text-[var(--foreground)] min-w-[140px] text-center">
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
            >
              <ChevronRight size={18} className="text-[var(--foreground)]" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--surface)] rounded-xl border border-[var(--border-color)] p-1">
            {(["day", "week", "month"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  viewMode === mode
                    ? "bg-chambray text-white"
                    : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                )}
              >
                {mode === "day" ? "Día" : mode === "week" ? "Semana" : "Mes"}
              </button>
            ))}
          </div>
          <Button variant="accent" size="sm" icon={<Plus size={16} />} onClick={() => toast("Crear evento — próximamente")}>
            Evento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Calendar Grid */}
        <Card className="md:col-span-2">
          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-[var(--foreground)] opacity-50 py-2"
              >
                {day}
              </div>
            ))}
          </div>
          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === today && month === new Date().getMonth();
              const isSelected = day === selectedDay;
              const hasEvents = sampleEvents.some((e) => e.day === day);

              return (
                <motion.button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={clsx(
                    "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-colors",
                    isSelected
                      ? "bg-chambray text-white"
                      : isToday
                      ? "bg-terracotta/10 text-terracotta font-bold"
                      : "hover:bg-[var(--surface-hover)] text-[var(--foreground)]"
                  )}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-sm">{day}</span>
                  {hasEvents && !isSelected && (
                    <div className="absolute bottom-1.5 flex gap-0.5">
                      <div className="w-1 h-1 rounded-full bg-terracotta" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </Card>

        {/* Day Detail */}
        <Card>
          <h3 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-4">
            {selectedDay ? `${selectedDay} de ${MONTHS[month]}` : "Selecciona un día"}
          </h3>
          <AnimatePresence mode="wait">
            {dayEvents.length > 0 ? (
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {dayEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className="p-3 rounded-xl border border-[var(--border-color)] hover:bg-[var(--surface-hover)] transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-1.5 h-full min-h-[40px] rounded-full ${event.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={12} className="text-[var(--foreground)] opacity-50" />
                          <span className="text-xs text-[var(--foreground)] opacity-50">
                            {event.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <Calendar className="w-12 h-12 text-[var(--foreground)] opacity-20 mx-auto mb-2" />
                <p className="text-sm text-[var(--foreground)] opacity-50">
                  No hay eventos este día
                </p>
                <Button variant="outline" size="sm" className="mt-3" icon={<Plus size={14} />} onClick={() => toast("Crear evento — próximamente")}>
                  Agregar evento
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Shared Calendars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-3">
          Calendarios compartidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: "Amigos cercanos", members: 6, color: "from-chambray to-chambray-dark" },
            { name: "Facultad - Grupo A", members: 12, color: "from-terracotta to-terracotta-dark" },
            { name: "Viaje Bariloche", members: 4, color: "from-chambray-light to-terracotta" },
          ].map((cal) => (
            <Card key={cal.name} hover onClick={() => toast(`Abriendo ${cal.name}`)} >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cal.color} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">
                    {cal.members}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {cal.name}
                  </p>
                  <p className="text-xs text-[var(--foreground)] opacity-50">
                    {cal.members} miembros
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
