import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { Task, Subtask } from '../types';

interface ContinueSubtaskModalProps {
  isOpen: boolean;
  globalTask: Task | null;
  nextSubtask: Subtask | null;
  onContinue: () => void;
  onFinish: () => void;
}

export function ContinueSubtaskModal({ 
  isOpen, 
  globalTask, 
  nextSubtask, 
  onContinue, 
  onFinish 
}: ContinueSubtaskModalProps) {
  if (!isOpen || !globalTask || !nextSubtask) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-[#FFE4E1] to-[#E6F7E6] rounded-3xl p-10 max-w-xl w-full border-4 border-[#FF69B4] shadow-2xl relative"
        >
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-4xl">🌻</div>
          <div className="absolute bottom-4 left-4 text-3xl">✨</div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-center mb-6"
            >
              <h2
                className="text-[#228B22] mb-2"
                style={{ fontFamily: 'VT323, monospace', fontSize: '36px' }}
              >
                GREAT PROGRESS!
              </h2>
              <p
                className="text-[#FF69B4]"
                style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
              >
                You've completed today's tasks!
              </p>
            </motion.div>

            {/* Global Task Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border-3 border-[#228B22]"
            >
              <p
                className="text-[#FF69B4] mb-3"
                style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
              >
                From your global task:
              </p>
              <h3
                className="text-[#228B22] mb-4"
                style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}
              >
                {globalTask.name}
              </h3>
              
              <div className="bg-gradient-to-r from-[#FFB6C1]/30 to-[#E6F7E6]/30 rounded-xl p-4 border-2 border-[#FF69B4]">
                <p
                  className="text-[#FF69B4] mb-2"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                >
                  Next subtask available:
                </p>
                <p
                  className="text-[#228B22]"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
                >
                  {nextSubtask.name}
                </p>
              </div>
            </motion.div>

            {/* Question */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-[#228B22] mb-8"
              style={{ fontFamily: 'VT323, monospace', fontSize: '26px' }}
            >
              Do you want to keep working on this today?
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              <motion.button
                onClick={onContinue}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] hover:from-[#1a6b1a] hover:to-[#228B22] text-white rounded-3xl border-4 border-[#0f4d0f] shadow-lg"
                style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="w-6 h-6" />
                YES, CONTINUE!
              </motion.button>

              <motion.button
                onClick={onFinish}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white hover:bg-[#FFE4E1] border-4 border-[#FF69B4] text-[#FF69B4] rounded-3xl shadow-lg"
                style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-6 h-6" />
                DONE FOR TODAY
              </motion.button>
            </motion.div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#228B22]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tr from-[#FF69B4]/10 to-transparent rounded-full blur-3xl" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
