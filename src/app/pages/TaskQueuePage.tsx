import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Shuffle, Eye } from 'lucide-react';
import { AppContext } from '../layouts/MainLayout';
import { shuffleTasks } from '../utils/taskUtils';

export function TaskQueuePage() {
  const navigate = useNavigate();
  const {
    energyLevel,
    allTasks,
    prioritizedTasks,
    setPrioritizedTasks,
    currentTaskIndex,
    setCurrentTaskIndex,
    completedTasks,
  } = useContext(AppContext);

  const [showPeek, setShowPeek] = useState(false);

  const handleDoNext = () => {
    if (currentTaskIndex < prioritizedTasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const handleShuffle = () => {
    const newPrioritized = shuffleTasks(allTasks, prioritizedTasks, energyLevel!);
    setPrioritizedTasks(newPrioritized);
    setCurrentTaskIndex(0);
  };

  const currentTask = prioritizedTasks[currentTaskIndex];
  const isFirstTask = currentTaskIndex === 0 && completedTasks.length === 0;
  const top3Tasks = prioritizedTasks.slice(0, 3);

  if (!currentTask) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE4E1] via-[#FFF0F5] to-[#E6F7E6] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle, #FF69B4 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#FFE4E1] border-4 border-[#228B22] rounded-3xl transition-all shadow-lg"
          style={{ fontFamily: 'VT323, monospace', fontSize: '20px', color: '#228B22' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          BACK TO DASHBOARD
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-20 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 border-4 border-[#FF69B4] shadow-2xl text-center max-w-2xl w-full relative"
        >
          <motion.h2
            className="text-[#228B22] mb-8"
            style={{ fontFamily: 'VT323, monospace', fontSize: '42px' }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {isFirstTask ? 'DO THIS FIRST' : 'DO THIS NEXT'}
          </motion.h2>

          <motion.div
            className="bg-gradient-to-br from-[#FFE4E1] to-[#FFB6C1] p-8 rounded-3xl border-4 border-[#FF69B4] mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <p
              className="text-[#228B22] mb-4"
              style={{ fontFamily: 'VT323, monospace', fontSize: '32px', lineHeight: '1.4' }}
            >
              {currentTask.name}
            </p>
            <div className="flex items-center justify-center gap-4 text-[#FF69B4]" style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}>
              <span>⏱️ {currentTask.estimatedTime} {currentTask.timeUnit || 'min'}</span>
              <span>•</span>
              <span>⚡ {currentTask.energyRequired}/10</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <motion.button
              onClick={() => navigate(`/focus/${currentTask.id}`)}
              className="w-full px-10 py-6 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] hover:from-[#1a6b1a] hover:to-[#228B22] text-white rounded-3xl border-4 border-[#0f4d0f] shadow-lg"
              style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              START THIS TASK
            </motion.button>

            <div className="flex gap-4">
              {currentTaskIndex < prioritizedTasks.length - 1 && (
                <motion.button
                  onClick={handleDoNext}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-[#FFE4E1] border-4 border-[#FF69B4] rounded-3xl transition-all"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '22px', color: '#FF69B4' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Skip <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}

              <motion.button
                onClick={handleShuffle}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-[#FFE4E1] border-4 border-[#228B22] rounded-3xl transition-all"
                style={{ fontFamily: 'VT323, monospace', fontSize: '22px', color: '#228B22' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shuffle className="w-5 h-5" /> Shuffle
              </motion.button>
            </div>

            <p
              className="text-[#FF69B4] mt-2"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              {currentTaskIndex + 1} of {prioritizedTasks.length} tasks in queue
            </p>

            {/* Peek Button */}
            <motion.button
              onClick={() => setShowPeek(!showPeek)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-[#FFE4E1] to-[#FFB6C1] hover:from-[#FFB6C1] hover:to-[#FFE4E1] border-4 border-[#FF69B4] rounded-3xl transition-all mx-auto"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px', color: '#228B22' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-5 h-5" />
              {showPeek ? 'HIDE NEXT 3' : 'PEEK AT NEXT 3'}
            </motion.button>
          </div>

          {/* Peek Panel */}
          <AnimatePresence>
            {showPeek && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="bg-gradient-to-br from-[#E6F7E6] to-[#FFE4E1] rounded-2xl p-6 border-3 border-[#228B22]">
                  <p
                    className="text-[#228B22] mb-4"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
                  >
                    NEXT UP:
                  </p>
                  <div className="space-y-2">
                    {top3Tasks.slice(currentTaskIndex + 1, currentTaskIndex + 4).map((task, index) => (
                      <div
                        key={task.id}
                        className="bg-white/80 p-3 rounded-xl border-2 border-[#FFB6C1] text-left"
                      >
                        <p
                          className="text-[#FF69B4]"
                          style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                        >
                          {currentTaskIndex + index + 2}. {task.name}
                        </p>
                      </div>
                    ))}
                    {prioritizedTasks.length > currentTaskIndex + 4 && (
                      <p
                        className="text-[#FF69B4] text-center pt-2"
                        style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                      >
                        + {prioritizedTasks.length - currentTaskIndex - 4} more tasks
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      {/* Floating decorations */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          style={{
            top: `${15 + i * 20}%`,
            left: `${10 + i * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          {i % 2 === 0 ? '🌸' : '✨'}
        </motion.div>
      ))}
    </div>
  );
}
