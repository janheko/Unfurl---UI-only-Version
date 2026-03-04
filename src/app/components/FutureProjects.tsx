import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight, Plus } from 'lucide-react';
import { Task } from '../types';

interface FutureProjectsProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onAddToToday: (task: Task) => void;
}

export function FutureProjects({ tasks, onSelectTask, onAddToToday }: FutureProjectsProps) {
  if (tasks.length === 0) return null;

  // Sort by deadline (earliest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue!';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    if (diffDays <= 30) return `Due in ${Math.floor(diffDays / 7)} weeks`;
    return `Due ${date.toLocaleDateString()}`;
  };

  return (
    <div className="mb-8">
      <h3
        className="text-[#228B22] text-2xl mb-4"
        style={{ fontFamily: 'VT323, monospace' }}
      >
        📅 Future Projects Due
      </h3>
      <p
        className="text-[#FF69B4] mb-4"
        style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
      >
        Tasks with deadlines but no subtasks. Complete them anytime!
      </p>

      <div className="grid gap-4">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-5 border-4 border-[#FFB6C1] hover:border-[#FF69B4] transition-all cursor-pointer group"
            onClick={() => onSelectTask(task)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4
                  className="text-[#228B22] mb-2"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
                >
                  {task.name}
                </h4>
                
                <div className="flex flex-wrap gap-3 mb-2">
                  {task.deadline && (
                    <div className="flex items-center gap-1 text-[#FF69B4]" style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}>
                      <Calendar className="w-4 h-4" />
                      <span>{formatDeadline(task.deadline)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-[#228B22]" style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}>
                    <Clock className="w-4 h-4" />
                    <span>{task.estimatedMinutes} min</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-3 py-1 bg-[#FFB6C1] text-white rounded-full text-sm"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}
                  >
                    {task.category}
                  </span>
                  <span
                    className="text-[#FF69B4]"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}
                  >
                    Difficulty: {task.importance}/10
                  </span>
                </div>

                {/* Add to Today Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToToday(task);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] text-white rounded-xl border-3 border-[#C71585] hover:from-[#FF1493] hover:to-[#FF69B4] transition-all"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  Add to Today
                </motion.button>
              </div>

              <motion.div
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#228B22] text-white group-hover:bg-[#FF69B4] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}