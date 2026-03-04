import React from 'react';
import { motion } from 'motion/react';
import { X, Clock, Calendar } from 'lucide-react';
import { CompletedTask } from '../types';

interface HistoryProps {
  completedTasks: CompletedTask[];
  onClose: () => void;
}

export function History({ completedTasks, onClose }: HistoryProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-[#FFE4E1] to-[#E6F7E6] rounded-3xl p-8 max-w-3xl w-full border-4 border-[#228B22] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 
              className="text-[#228B22] text-3xl mb-2"
              style={{ fontFamily: 'VT323, monospace' }}
            >
              TASK HISTORY
            </h2>
            <p 
              className="text-[#FF69B4]"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'} completed
            </p>
          </div>
          <motion.button
            onClick={onClose}
            className="p-3 hover:bg-white/50 rounded-2xl transition-colors border-3 border-[#228B22] bg-white"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6 text-[#228B22]" />
          </motion.button>
        </div>

        {/* Task List */}
        <div className="space-y-3 relative z-10">
          {completedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p
                className="text-[#FF69B4] text-2xl"
                style={{ fontFamily: 'VT323, monospace' }}
              >
                No tasks completed yet!
              </p>
              <p
                className="text-[#228B22] text-lg mt-2"
                style={{ fontFamily: 'VT323, monospace' }}
              >
                Start working on your tasks to see them here.
              </p>
            </div>
          ) : (
            [...completedTasks].reverse().map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/90 rounded-2xl p-5 border-3 border-[#FFB6C1] shadow-md"
              >
                <div className="flex items-start gap-4">
                  {/* Flower Icon */}
                  <div className="text-4xl">
                    {task.flowerType === 'rose' && '🌹'}
                    {task.flowerType === 'sunflower' && '🌻'}
                    {task.flowerType === 'daisy' && '🌼'}
                    {task.flowerType === 'lavender' && '💜'}
                  </div>

                  {/* Task Details */}
                  <div className="flex-1">
                    <p
                      className="text-[#228B22] mb-2"
                      style={{ 
                        fontFamily: 'VT323, monospace', 
                        fontSize: '24px',
                        textDecoration: 'line-through',
                        textDecorationColor: '#228B22',
                        textDecorationThickness: '2px'
                      }}
                    >
                      {task.name}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 text-[#FF69B4]" style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(task.timeSpent)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(task.completedAt)}
                      </span>
                      <span>•</span>
                      <span className="px-2 py-1 bg-[#FFE4E1] rounded-lg border-2 border-[#FFB6C1]">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#228B22]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#FF69B4]/10 to-transparent rounded-full blur-3xl" />
      </motion.div>
    </motion.div>
  );
}
