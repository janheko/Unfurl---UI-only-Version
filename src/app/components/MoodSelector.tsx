import React from 'react';
import { motion } from 'motion/react';
import { Cloud, Sprout, Flame } from 'lucide-react';
import { EnergyLevel } from '../types';

interface MoodSelectorProps {
  selectedMood: EnergyLevel;
  onMoodChange: (mood: EnergyLevel) => void;
}

const moods = [
  { id: 'fog' as EnergyLevel, icon: Cloud, label: 'Brain Fog', color: '#B2AC88', desc: 'Low energy tasks' },
  { id: 'steady' as EnergyLevel, icon: Sprout, label: 'Steady', color: '#2D5A27', desc: 'Balanced pace' },
  { id: 'hyperfocus' as EnergyLevel, icon: Flame, label: 'Hyperfocus', color: '#E2725B', desc: 'High energy mode' },
];

export function MoodSelector({ selectedMood, onMoodChange }: MoodSelectorProps) {
  return (
    <div className="mb-8">
      <h3 
        className="text-[#2D5A27] text-xs mb-4 text-center"
        style={{ fontFamily: 'Press Start 2P, monospace' }}
      >
        HOW'S YOUR ENERGY?
      </h3>
      <div className="flex gap-4 justify-center">
        {moods.map(({ id, icon: Icon, label, color, desc }) => {
          const isSelected = selectedMood === id;
          return (
            <motion.button
              key={id}
              onClick={() => onMoodChange(id)}
              className="flex flex-col items-center gap-3 p-5 rounded-3xl transition-all relative overflow-hidden"
              style={{
                backgroundColor: isSelected ? color : 'white',
                border: `4px solid ${color}`,
                minWidth: '120px',
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSelected && (
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
              <Icon 
                className="w-10 h-10 relative z-10" 
                style={{ color: isSelected ? 'white' : color }}
              />
              <div className="text-center relative z-10">
                <span
                  className="text-xs block mb-1"
                  style={{
                    fontFamily: 'Press Start 2P, monospace',
                    color: isSelected ? 'white' : color,
                  }}
                >
                  {label}
                </span>
                <span
                  className="text-xs block"
                  style={{
                    fontFamily: 'VT323, monospace',
                    fontSize: '14px',
                    color: isSelected ? 'white' : color,
                    opacity: isSelected ? 1 : 0.7,
                  }}
                >
                  {desc}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}