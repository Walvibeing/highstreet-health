"use client";

import { useState } from "react";
import type { BusinessHours, TimePeriod } from "@/types/google-business";
import Button from "@/components/ui/button";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function formatTime(t: { hours: number; minutes: number }) {
  return `${String(t.hours).padStart(2, "0")}:${String(t.minutes).padStart(2, "0")}`;
}

function parseTime(s: string): { hours: number; minutes: number } {
  const [h, m] = s.split(":").map(Number);
  return { hours: h || 0, minutes: m || 0 };
}

export default function HoursEditor({
  hours,
  locationId,
}: {
  hours?: BusinessHours;
  locationId: string;
}) {
  const [periods, setPeriods] = useState<TimePeriod[]>(
    hours?.periods || []
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function getPeriodForDay(day: string) {
    return periods.find((p) => p.openDay === day);
  }

  function toggleDay(day: string) {
    const existing = getPeriodForDay(day);
    if (existing) {
      setPeriods(periods.filter((p) => p.openDay !== day));
    } else {
      setPeriods([
        ...periods,
        {
          openDay: day,
          openTime: { hours: 9, minutes: 0 },
          closeDay: day,
          closeTime: { hours: 17, minutes: 0 },
        },
      ]);
    }
  }

  function updateTime(
    day: string,
    field: "openTime" | "closeTime",
    value: string
  ) {
    setPeriods(
      periods.map((p) =>
        p.openDay === day ? { ...p, [field]: parseTime(value) } : p
      )
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/google/locations/${locationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: { regularHours: { periods } },
          updateMask: "regularHours",
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setMessage("Hours saved");
    } catch {
      setMessage("Failed to save hours");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Opening Hours</h3>
      {DAYS.map((day) => {
        const period = getPeriodForDay(day);
        return (
          <div key={day} className="flex items-center gap-4">
            <label className="flex w-28 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!period}
                onChange={() => toggleDay(day)}
                className="rounded border-gray-300"
              />
              {day.charAt(0) + day.slice(1).toLowerCase()}
            </label>
            {period ? (
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="time"
                  value={formatTime(period.openTime)}
                  onChange={(e) => updateTime(day, "openTime", e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="time"
                  value={formatTime(period.closeTime)}
                  onChange={(e) => updateTime(day, "closeTime", e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400">Closed</span>
            )}
          </div>
        );
      })}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Hours"}
        </Button>
        {message && (
          <span
            className={`text-sm ${message.includes("Failed") ? "text-red-500" : "text-green-600"}`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
