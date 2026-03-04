import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

interface SubtaskScheduleModalProps {
  isOpen: boolean;
  task: Task;
  remainingSubtasksCount: number;
  onScheduleToday: () => void;
  onScheduleLater: () => void;
}

export function SubtaskScheduleModal({
  isOpen,
  task,
  remainingSubtasksCount,
  onScheduleToday,
  onScheduleLater,
}: SubtaskScheduleModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-white to-[#E6F7E6] rounded-3xl p-8 border-4 border-[#228B22] shadow-2xl max-w-lg w-full"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-6xl mb-4"
            >
              🌱
            </motion.div>
            <h2
              className="text-[#228B22] mb-3"
              style={{ fontFamily: 'VT323, monospace', fontSize: '36px' }}
            >
              WHAT ABOUT THE REST?
            </h2>
            <p
              className="text-[#FF69B4] mb-2"
              style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
            >
              {task.name}
            </p>
            <p
              className="text-[#228B22]"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              has {remainingSubtasksCount} subtask{remainingSubtasksCount > 1 ? 's' : ''} left
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 mb-6 border-3 border-[#FFB6C1]">
            <p
              className="text-[#228B22] text-center"
              style={{ fontFamily: 'VT323, monospace', fontSize: '18px', lineHeight: '1.4' }}
            >
              Do you want to finish the remaining subtasks today, or work on them later?
            </p>
          </div>

          <div className="space-y-3">
            <motion.button
              onClick={onScheduleToday}
              className="w-full px-8 py-4 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF69B4] text-white rounded-2xl border-4 border-[#C71585] shadow-lg"
              style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              FINISH TODAY ☀️
            </motion.button>

            <motion.button
              onClick={onScheduleLater}
              className="w-full px-8 py-4 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] hover:from-[#1a6b1a] hover:to-[#228B22] text-white rounded-2xl border-4 border-[#0f4d0f] shadow-lg"
              style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              DO LATER 🌙
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
