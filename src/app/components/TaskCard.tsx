import React from 'react';
import { motion } from 'motion/react';
import { Clock, HelpCircle, Briefcase, Heart, Home, Palette, Users } from 'lucide-react';
import { Task, TaskCategory } from '../types';
import { PixelSeedPacket } from './PixelArt';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  index: number;
}

const categoryIcons: Record<TaskCategory, React.ComponentType<{ className?: string }>> = {
  work: Briefcase,
  selfcare: Heart,
  chores: Home,
  creative: Palette,
  social: Users,
};

const categoryColors: Record<TaskCategory, string> = {
  work: '#4A90E2',
  selfcare: '#E2725B',
  chores: '#B2AC88',
  creative: '#9B59B6',
  social: '#F39C12',
};

export function TaskCard({ task, onClick, index }: TaskCardProps) {
  const Icon = categoryIcons[task.category];
  const color = categoryColors[task.category];
  const isMystery = !task.isRevealed;

  return (
    <motion.button
      onClick={onClick}
      className="relative w-full h-48 rounded-3xl border-4 overflow-hidden group"
      style={{
        borderColor: '#2D5A27',
        backgroundColor: isMystery ? 'rgba(178, 172, 136, 0.15)' : 'white',
      }}
      initial={{ opacity: 0, y: 20, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: index * 0.15, type: 'spring' }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 p-6 flex flex-col">
        {isMystery ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <PixelSeedPacket 
              revealed={false} 
              category={task.category}
              className="w-24 h-32 mb-3"
            />
            <div className="flex items-center gap-3 px-4 py-2 bg-white/80 rounded-xl border-3 border-[#2D5A27]">
              <Icon className="w-5 h-5" style={{ color }} />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2D5A27]" />
                <span
                  style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '12px', color: '#2D5A27' }}
                >
                  {task.estimatedMinutes}m
                </span>
              </div>
            </div>
            <p
              className="text-[#B2AC88] text-xs mt-3"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              TAP TO REVEAL
            </p>
          </div>
        ) : (
          <>
            {/* Category Badge */}
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-xl self-start mb-4"
              style={{ 
                backgroundColor: color,
                border: '3px solid #2D5A27'
              }}
            >
              <Icon className="w-5 h-5 text-white" />
              <span
                className="text-white text-xs uppercase"
                style={{ fontFamily: 'Press Start 2P, monospace' }}
              >
                {task.category}
              </span>
            </div>

            {/* Task Name */}
            <p
              className="text-left text-[#2D5A27] mb-auto leading-snug flex-1"
              style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
            >
              {task.name}
            </p>

            {/* Time Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F5DC] rounded-xl self-start border-3 border-[#2D5A27]">
              <Clock className="w-5 h-5 text-[#2D5A27]" />
              <span
                style={{ fontFamily: 'Press Start 2P, monospace', fontSize: '14px', color: '#2D5A27' }}
              >
                {task.estimatedMinutes} MIN
              </span>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D5A27]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </>
        )}
      </div>

      {/* Pixel border effect */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-[#2D5A27]" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-[#2D5A27]" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#2D5A27]" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#2D5A27]" />
    </motion.button>
  );
}