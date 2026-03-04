import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Subtask } from '../types';

interface SubtaskDecisionModalProps {
  isOpen: boolean;
  task: Task;
  currentSubtask: Subtask;
  onNextSubtask: () => void;
  onSwitchTask: () => void;
}

export function SubtaskDecisionModal({
  isOpen,
  task,
  currentSubtask,
  onNextSubtask,
  onSwitchTask,
}: SubtaskDecisionModalProps) {
  const remainingSubtasks = task.subtasks?.filter(st => !st.completed) || [];
  const hasMoreSubtasks = remainingSubtasks.length > 0;

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
          className="bg-gradient-to-br from-white to-[#FFE4E1] rounded-3xl p-8 border-4 border-[#FF69B4] shadow-2xl max-w-lg w-full"
        >
          {/* Success Message */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-6xl mb-4"
            >
              ✨
            </motion.div>
            <h2
              className="text-[#228B22] mb-2"
              style={{ fontFamily: 'VT323, monospace', fontSize: '36px' }}
            >
              SUBTASK COMPLETE!
            </h2>
            <p
              className="text-[#FF69B4]"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              {currentSubtask.name}
            </p>
          </div>

          {/* Task Info */}
          <div className="bg-white/80 rounded-2xl p-4 mb-6 border-3 border-[#FFB6C1]">
            <p
              className="text-[#228B22] mb-2"
              style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
            >
              {task.name}
            </p>
            <p
              className="text-[#FF69B4]"
              style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
            >
              {hasMoreSubtasks
                ? `${remainingSubtasks.length} subtask${remainingSubtasks.length > 1 ? 's' : ''} remaining`
                : 'All subtasks complete! 🎉'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {hasMoreSubtasks && (
              <motion.button
                onClick={onNextSubtask}
                className="w-full px-8 py-4 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] hover:from-[#1a6b1a] hover:to-[#228B22] text-white rounded-2xl border-4 border-[#0f4d0f] shadow-lg"
                style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                NEXT SUBTASK →
              </motion.button>
            )}

            <motion.button
              onClick={onSwitchTask}
              className="w-full px-8 py-4 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF69B4] text-white rounded-2xl border-4 border-[#C71585] shadow-lg"
              style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {hasMoreSubtasks ? 'SWITCH TO NEXT MAIN TASK' : 'BACK TO QUEUE'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
