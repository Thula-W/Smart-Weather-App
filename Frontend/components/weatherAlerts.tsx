import React, { useState } from "react";
import { WeatherAlert } from "@/types";

interface Props {
  alerts?: WeatherAlert[];
}

const formatDateTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const WeatherAlerts: React.FC<Props> = ({ alerts }) => {
  const [index, setIndex] = useState(0);

  if (!alerts || alerts.length === 0) return null;

  const alert = alerts[index];

  const next = () => {
    setIndex((prev) => (prev + 1) % alerts.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? alerts.length - 1 : prev - 1
    );
  };

  return (
    <div className="glass rounded-3xl p-6 border border-red-500  relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-red-400 font-bold uppercase text-sm tracking-wider">
          Weather Alert
        </h3>

        {alerts.length > 1 && (
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <button
              onClick={prev}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
            >
              ←
            </button>
            <span>
              {index + 1} / {alerts.length}
            </span>
            <button
              onClick={next}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Event Title */}
      <h4 className="text-lg font-bold text-white mb-2">
        {alert.event}
      </h4>

      {/* Sender */}
      <p className="text-xs text-white/50 mb-3">
        Issued by {alert.sender_name}
      </p>

      {/* Time */}
      <div className="text-xs text-white/60 mb-4">
        <p>Start: {formatDateTime(alert.start)}</p>
        <p>End: {formatDateTime(alert.end)}</p>
      </div>

      {/* Description */}
      <p className="text-sm text-white/80 leading-relaxed">
        {alert.description}
      </p>

      {/* Tags */}
      {alert.tags?.length > 0 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {alert.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherAlerts;
