import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, List, Clock, ChevronDown, ChevronUp, CheckCircle2, Circle, Plus } from 'lucide-react';
import { Task, Subtask } from '../types';

interface GlobalTasksProps {
  tasks: Task[];
  onWorkOnTask: (task: Task) => void;
  onAddSubtaskToToday: (taskId: string, subtask: Subtask) => void;
}

export function GlobalTasks({ tasks, onWorkOnTask, onAddSubtaskToToday }: GlobalTasksProps) {
  const [expandedTaskId, setExpandedTaskId] = React.useState<string | null>(null);

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

    if (diffDays < 0) return { text: 'Overdue!', color: '#FF1493' };
    if (diffDays === 0) return { text: 'Due today', color: '#FF69B4' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: '#FF69B4' };
    if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: '#FFB6C1' };
    return { text: `Due in ${diffDays} days`, color: '#228B22' };
  };

  const getCompletedSubtasksCount = (task: Task) => {
    if (!task.subtasks) return 0;
    return task.subtasks.filter(st => st.completed).length;
  };

  const getProgressPercentage = (task: Task) => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    return (getCompletedSubtasksCount(task) / task.subtasks.length) * 100;
  };

  return (
    <div className="mb-8">
      <h3
        className="text-[#228B22] text-2xl mb-4"
        style={{ fontFamily: 'VT323, monospace' }}
      >
        🌍 Global Tasks
      </h3>
      <p
        className="text-[#FF69B4] mb-4"
        style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
      >
        Big projects with subtasks. Work on them daily until the deadline!
      </p>

      <div className="grid gap-4">
        {sortedTasks.map((task, index) => {
          const deadline = task.deadline ? formatDeadline(task.deadline) : null;
          const progress = getProgressPercentage(task);
          const completedCount = getCompletedSubtasksCount(task);
          const totalCount = task.subtasks?.length || 0;
          const isExpanded = expandedTaskId === task.id;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-[#FFE4E1] to-white rounded-2xl p-5 border-4 border-[#228B22] hover:border-[#FF69B4] transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h4
                    className="text-[#228B22] mb-2"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
                  >
                    {task.name}
                  </h4>
                  
                  <div className="flex flex-wrap gap-3 mb-3">
                    {deadline && (
                      <div 
                        className="flex items-center gap-1" 
                        style={{ fontFamily: 'VT323, monospace', fontSize: '18px', color: deadline.color }}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>{deadline.text}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-[#228B22]" style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}>
                      <List className="w-4 h-4" />
                      <span>{completedCount}/{totalCount} subtasks done</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-4 bg-white rounded-full border-3 border-[#FFB6C1] overflow-hidden mb-3">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#228B22] to-[#90EE90]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1 bg-[#228B22] text-white rounded-full text-sm"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}
                    >
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expand/Collapse Button */}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-3 border-[#FFB6C1] rounded-xl text-[#228B22] hover:bg-[#FFE4E1] transition-colors"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isExpanded ? 'Hide' : 'View'} Subtasks
                </motion.button>

                <motion.button
                  onClick={() => onWorkOnTask(task)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] text-white rounded-xl border-3 border-[#0f4d0f] hover:from-[#1a6b1a] hover:to-[#228B22] transition-all"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Work on this today 🌱
                </motion.button>
              </div>

              {/* Subtasks List */}
              <AnimatePresence>
                {isExpanded && task.subtasks && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="bg-white rounded-xl p-4 border-3 border-[#FFB6C1]">
                      <h5
                        className="text-[#FF69B4] mb-3"
                        style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                      >
                        Subtasks:
                      </h5>
                      <div className="space-y-2">
                        {task.subtasks.map((subtask, idx) => (
                          <div
                            key={subtask.id}
                            className={`flex items-center gap-3 p-3 rounded-lg ${
                              subtask.completed ? 'bg-[#E6F7E6]' : 'bg-[#FFF5F7]'
                            }`}
                          >
                            {subtask.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-[#228B22]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#FFB6C1]" />
                            )}
                            <span
                              className={`flex-1 ${
                                subtask.completed ? 'text-[#228B22] line-through' : 'text-[#FF69B4]'
                              }`}
                              style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                            >
                              {idx + 1}. {subtask.name}
                            </span>
                            {!subtask.completed && (
                              <motion.button
                                onClick={() => onAddSubtaskToToday(task.id, subtask)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] text-white rounded-xl border-3 border-[#0f4d0f] hover:from-[#1a6b1a] hover:to-[#228B22] transition-all"
                                style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Plus className="w-4 h-4" />
                                Add to Today
                              </motion.button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}