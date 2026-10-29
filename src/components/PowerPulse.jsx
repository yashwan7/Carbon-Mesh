import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Leaf,
  Clock,
  TrendingDown,
  Info,
  Power,
  Flame,
  CheckCircle2,
  Activity,
  Shield,
  Gauge,
} from 'lucide-react';

export const PowerPulse = () => {
  const { powerPulse, toggleEcoMode, hardware, toggleRelayLoadShed } = useApp();
  const [hoveredHour, setHoveredHour] = useState(null);

  // Peak hourly load data
  const maxKwh = Math.max(...powerPulse.hourlyHistory.map((h) => h.kwh));

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 ambient-mint pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-mint/10 border border-brand-mint/30 flex items-center justify-center text-brand-mint shadow-glow-mint">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-bold text-white">Power Pulse</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-mint/15 text-brand-mint border border-brand-mint/25 font-semibold">
                Smart Grid Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Household load telemetry & dynamic carbon accounting • BESCOM 0.70 kg CO₂e / kWh
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleEcoMode}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              powerPulse.ecoMode
                ? 'bg-brand-mint/20 border-brand-mint/40 text-brand-mint shadow-glow-mint'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>{powerPulse.ecoMode ? 'Eco Mode Active (-25%)' : 'Enable Eco Mode'}</span>
          </button>

          <button
            onClick={toggleRelayLoadShed}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              hardware.meshRelayStatus === 'SHED_ACTIVE'
                ? 'bg-brand-coral/20 border-brand-coral/40 text-brand-coral shadow-glow-coral'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{hardware.meshRelayStatus === 'SHED_ACTIVE' ? 'Relay Load Shed: ON' : 'Cut Peak Load'}</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Live Power Draw</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-display font-extrabold text-white">
              {hardware.connected ? powerPulse.currentKwh : 0.0}
            </span>
            <span className="text-xs font-semibold text-brand-mint">kW</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {hardware.connected ? `Sensor node draw: ${hardware.liveWatts} W` : 'Sensor disconnected'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <span className="text-xs text-slate-400 font-medium block mb-1">Today's Cumulative Energy</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-display font-extrabold text-white">
              {powerPulse.todayTotalKwh}
            </span>
            <span className="text-xs font-semibold text-brand-sky">kWh</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Monthly sum: {powerPulse.monthlyTotalKwh} kWh
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-brand-coral/10 border border-brand-coral/20">
          <span className="text-xs text-brand-coral font-medium block mb-1">Electricity Carbon Load</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-display font-extrabold text-brand-coral">
              {powerPulse.carbonLoadKg}
            </span>
            <span className="text-xs font-semibold text-brand-coral">kg CO₂e</span>
          </div>
          <span className="text-[11px] text-slate-300 mt-1 block">
            At Karnataka 0.70 factor
          </span>
        </div>
      </div>

      {/* Vibrant Multi-Colored 24-Hour Glowing Load Distribution Chart */}
      <div className="p-5 rounded-2xl bg-canvas-dark/60 border border-white/5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-mint" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              24-Hour Load Profile & Grid Peak Distribution
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-brand-mint">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand-mint" /> Normal Load
            </span>
            <span className="flex items-center gap-1.5 text-brand-coral">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand-coral" /> Peak Grid Stress
            </span>
          </div>
        </div>

        {/* Bar & Trend Chart */}
        <div className="h-44 flex items-end gap-2 pt-6 pb-2 px-1 border-b border-white/5">
          {powerPulse.hourlyHistory.map((item, idx) => {
            const heightPct = Math.round((item.kwh / maxKwh) * 100);
            const isHovered = hoveredHour === idx;
            return (
              <div
                key={item.hour}
                onMouseEnter={() => setHoveredHour(idx)}
                onMouseLeave={() => setHoveredHour(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-10 bg-canvas-card border border-white/10 px-2.5 py-1 rounded-lg text-[10px] text-white font-mono whitespace-nowrap shadow-glass z-20">
                    <span className="font-bold">{item.kwh} kWh</span> • {item.hour}
                    {item.peak && <span className="text-brand-coral ml-1 font-bold">(Peak)</span>}
                  </div>
                )}

                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-lg transition-all duration-300 relative ${
                    item.peak
                      ? 'bg-gradient-to-t from-brand-coral/40 to-brand-coral group-hover:brightness-125 shadow-glow-coral'
                      : 'bg-gradient-to-t from-brand-mint/30 to-brand-mint group-hover:brightness-125 shadow-glow-mint'
                  }`}
                >
                  <div className="absolute top-1 inset-x-0 mx-auto w-1 h-1 rounded-full bg-white/60" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-2 group-hover:text-slate-300">
                  {item.hour.split(':')[0]}h
                </span>
              </div>
            );
          })}
        </div>

        {/* Peak Shift Advisory */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-amber" />
            Peak pricing windows: 08:00–10:00 & 18:00–21:00
          </span>
          <span className="text-brand-mint font-semibold">
            {powerPulse.ecoMode ? 'Automatic Solar Load Shifting Active' : 'Shift 1.4 kWh to save ₹14 and 1.0 kg CO₂e'}
          </span>
        </div>
      </div>

      {/* Relay Automated Shedding Banner */}
      <div className="p-4 rounded-2xl bg-canvas-dark/40 border border-white/5 flex items-center justify-between flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-brand-mint" />
          <span className="text-slate-300">
            NXP MCXN236 / ESP32 Hardware Relay:
            <strong className="text-white ml-1 font-mono">
              {hardware.meshRelayStatus === 'SHED_ACTIVE' ? 'Non-critical Loads Shed (-1400W)' : 'All Channels Energized (Normal)'}
            </strong>
          </span>
        </div>
        <button
          onClick={toggleRelayLoadShed}
          className="text-brand-mint hover:underline font-bold"
        >
          {hardware.meshRelayStatus === 'SHED_ACTIVE' ? 'Deactivate Shedding' : 'Trigger Automated Shedding'}
        </button>
      </div>
    </div>
  );
};
export const UrjaMeter = PowerPulse;

