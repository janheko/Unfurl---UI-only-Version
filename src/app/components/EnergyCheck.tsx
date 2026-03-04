import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cloud, Sprout, Flame } from 'lucide-react';
import { EnergyLevel } from '../types';

interface EnergyCheckProps {
  onSelectEnergy: (energy: EnergyLevel) => void;
}

const moods = [
  { 
    id: 'fog' as EnergyLevel, 
    icon: Cloud, 
    label: 'Brain Fog', 
    color: '#B2AC88',
    desc: 'Low energy, need simple tasks',
    emoji: '☁️'
  },
  { 
    id: 'steady' as EnergyLevel, 
    icon: Sprout, 
    label: 'Steady', 
    color: '#228B22',
    desc: 'Balanced, ready to work',
    emoji: '🌱'
  },
  { 
    id: 'hyperfocus' as EnergyLevel, 
    icon: Flame, 
    label: 'Hyperfocus', 
    color: '#FF69B4',
    desc: 'High energy, bring it on!',
    emoji: '🔥'
  },
];

export function EnergyCheck({ onSelectEnergy }: EnergyCheckProps) {
  const [hoveredId, setHoveredId] = useState<EnergyLevel | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE4E1] via-[#FFF0F5] to-[#E6F7E6] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle, #FF69B4 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 max-w-3xl"
      >
        {/* Decorative pot at top */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto relative">
            {/* Cute pot */}
            <div className="absolute bottom-0 w-full h-20 bg-gradient-to-b from-[#FFB6C1] to-[#FF69B4] rounded-2xl border-4 border-[#228B22]">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#8B7355] rounded-full" />
            </div>
            {/* Plant sprouting */}
            <motion.div 
              className="absolute bottom-16 left-1/2 -translate-x-1/2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-5xl">🌱</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-[#228B22] mb-4"
          style={{ fontFamily: 'VT323, monospace', fontSize: '48px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          How's your energy today?
        </motion.h1>

        <motion.p
          className="text-[#FF69B4] mb-12"
          style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          I'll suggest tasks that match your vibe
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moods.map(({ id, icon: Icon, label, color, desc, emoji }, index) => {
            const isHovered = hoveredId === id;
            return (
              <motion.button
                key={id}
                onClick={() => onSelectEnergy(id)}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative p-8 rounded-3xl transition-all overflow-hidden"
                style={{
                  backgroundColor: 'white',
                  border: `4px solid ${color}`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Background glow on hover */}
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundColor: color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div className="relative z-10">
                  <motion.div
                    animate={isHovered ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
                    className="text-6xl mb-4"
                  >
                    {emoji}
                  </motion.div>

                  <h3
                    className="mb-2"
                    style={{ 
                      fontFamily: 'VT323, monospace', 
                      fontSize: '28px',
                      color: color 
                    }}
                  >
                    {label}
                  </h3>

                  <p
                    style={{ 
                      fontFamily: 'VT323, monospace', 
                      fontSize: '18px',
                      color: '#B2AC88'
                    }}
                  >
                    {desc}
                  </p>
                </div>

                {/* Corner decorations */}
                <div 
                  className="absolute top-2 left-2 w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color, opacity: 0.5 }}
                />
                <div 
                  className="absolute top-2 right-2 w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color, opacity: 0.5 }}
                />
                <div 
                  className="absolute bottom-2 left-2 w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color, opacity: 0.5 }}
                />
                <div 
                  className="absolute bottom-2 right-2 w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color, opacity: 0.5 }}
                />
              </motion.button>
            );
          })}
        </div>

        <motion.p
          className="mt-8 text-[#FF69B4]"
          style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ✨ Don't worry, you can change this anytime ✨
        </motion.p>
      </motion.div>
    </div>
  );
}