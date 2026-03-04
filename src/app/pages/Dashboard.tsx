import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { Mic, BookOpen, Sparkles, Trash2, Shuffle, ArrowRight, History as HistoryIcon, Eye, Flower2 } from 'lucide-react';
import { AppContext } from '../layouts/MainLayout';
import { parseTaskDump, getPrioritizedTasks, shuffleTasks, getTaskType } from '../utils/taskUtils';
import { BrainDumpModal } from '../components/BrainDumpModal';
import { VoiceTaskInput } from '../components/VoiceTaskInput';
import { BouquetView } from '../components/BouquetView';
import { PixelSprout } from '../components/PixelArt';
import { FutureProjects } from '../components/FutureProjects';
import { GlobalTasks } from '../components/GlobalTasks';
import { Task, Subtask } from '../types';
import { ContinueSubtaskModal } from '../components/ContinueSubtaskModal';

export function Dashboard() {
  const navigate = useNavigate();
  const {
    energyLevel,
    allTasks,
    setAllTasks,
    prioritizedTasks,
    setPrioritizedTasks,
    currentTaskIndex,
    setCurrentTaskIndex,
    completedTasks,
    customCategories,
    setCustomCategories,
    isPrioritized,
    setIsPrioritized,
    todaysBouquet,
    todaysTasks,
    setTodaysTasks,
  } = useContext(AppContext);

  const [isBrainDumpOpen, setIsBrainDumpOpen] = useState(false);
  const [isVoiceInputOpen, setIsVoiceInputOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPeek, setShowPeek] = useState(false);
  const [showContinueSubtaskModal, setShowContinueSubtaskModal] = useState(false);
  const [currentGlobalTaskForContinue, setCurrentGlobalTaskForContinue] = useState<Task | null>(null);
  const [nextSubtaskForContinue, setNextSubtaskForContinue] = useState<Subtask | null>(null);

  const handleBrainDump = (input: string) => {
    const newTasks = parseTaskDump(input);
    setAllTasks([...allTasks, ...newTasks]);
  };

  const handleAddSingleTask = (task: any) => {
    setAllTasks([...allTasks, task]);
  };

  const handleAddCategory = (category: string) => {
    if (!customCategories.includes(category)) {
      setCustomCategories([...customCategories, category]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setAllTasks(allTasks.filter(t => t.id !== taskId));
  };

  const handleGeneratePrioritizedList = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const prioritized = getPrioritizedTasks(allTasks, energyLevel!, allTasks.length);
      setPrioritizedTasks(prioritized);
      setCurrentTaskIndex(0);
      setIsPrioritized(true);
      setIsGenerating(false);
      // Navigate to queue page
      navigate('/queue');
    }, 1500);
  };

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

  // Categorize tasks
  const globalTasks = allTasks.filter(task => getTaskType(task) === 'global');
  const futureTasks = allTasks.filter(task => getTaskType(task) === 'future');
  const regularTasks = allTasks.filter(task => getTaskType(task) === 'regular');

  const handleWorkOnGlobalTask = (task: Task) => {
    // Add the entire task object to today's tasks
    const taskAlreadyAdded = todaysTasks.some(t => t.id === task.id);
    if (!taskAlreadyAdded) {
      setTodaysTasks([...todaysTasks, task]);
    }
    
    // Mark all incomplete subtasks as added to today
    const updatedTasks = allTasks.map(t => {
      if (t.id === task.id && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.map(st =>
            !st.completed
              ? { ...st, addedToToday: true, scheduledDate: new Date().toISOString() }
              : st
          ),
        };
      }
      return t;
    });
    setAllTasks(updatedTasks);
    
    // Regenerate prioritized list to include the global task
    if (isPrioritized) {
      const prioritized = getPrioritizedTasks(updatedTasks, energyLevel!, updatedTasks.length);
      setPrioritizedTasks(prioritized);
    }
  };

  const handleSelectFutureTask = (task: Task) => {
    // Navigate to focus page for this future task
    navigate(`/focus/${task.id}`);
  };

  const handleAddFutureTaskToToday = (task: Task) => {
    // Convert future task to regular task by setting deadline to today
    const taskForToday: Task = {
      ...task,
      deadline: new Date().toISOString(),
    };
    
    // Update the task in allTasks
    const updatedTasks = allTasks.map(t => 
      t.id === task.id ? taskForToday : t
    );
    setAllTasks(updatedTasks);
    
    // If prioritized view is active, regenerate
    if (isPrioritized) {
      const prioritized = getPrioritizedTasks(updatedTasks, energyLevel!, updatedTasks.length);
      setPrioritizedTasks(prioritized);
    }
  };

  const handleAddSubtaskToToday = (taskId: string, subtask: Subtask) => {
    // Mark the subtask as added to today
    const updatedTasks = allTasks.map(task => {
      if (task.id === taskId && task.subtasks) {
        return {
          ...task,
          subtasks: task.subtasks.map(st =>
            st.id === subtask.id
              ? { ...st, addedToToday: true, scheduledDate: new Date().toISOString() }
              : st
          ),
        };
      }
      return task;
    });
    setAllTasks(updatedTasks);
    
    // Regenerate prioritized list to include this subtask
    if (isPrioritized) {
      const prioritized = getPrioritizedTasks(updatedTasks, energyLevel!, updatedTasks.length);
      setPrioritizedTasks(prioritized);
    }
  };

  const currentTask = prioritizedTasks[currentTaskIndex];
  const isFirstTask = currentTaskIndex === 0 && completedTasks.length === 0;
  const top3Tasks = prioritizedTasks.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE4E1] via-[#FFF0F5] to-[#E6F7E6] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle, #FF69B4 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        {/* Left side buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#FFE4E1] border-4 border-[#228B22] rounded-3xl transition-all shadow-lg"
            style={{ fontFamily: 'VT323, monospace', fontSize: '20px', color: '#228B22' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HistoryIcon className="w-5 h-5" />
            HISTORY
          </motion.button>

          <motion.button
            onClick={() => navigate('/garden')}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#FFE4E1] border-4 border-[#FF69B4] rounded-3xl transition-all shadow-lg"
            style={{ fontFamily: 'VT323, monospace', fontSize: '20px', color: '#FF69B4' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Flower2 className="w-5 h-5" />
            GARDEN
          </motion.button>
        </div>

        {/* Right side buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={() => setIsVoiceInputOpen(true)}
            className="p-4 bg-white hover:bg-[#FFE4E1] border-4 border-[#228B22] rounded-3xl transition-all shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-6 h-6 text-[#228B22]" />
          </motion.button>

          <motion.button
            onClick={() => setIsBrainDumpOpen(true)}
            className="p-4 bg-white hover:bg-[#FFE4E1] border-4 border-[#FF69B4] rounded-3xl transition-all shadow-lg flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-6 h-6 text-[#FF69B4]" />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-20 max-w-7xl mx-auto">
        {/* Today's Bouquet Section */}
        <section className="mb-8">
          <motion.div
            onClick={() => navigate(`/bouquet/today`)}
            className="cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BouquetView completedTasks={todaysBouquet} />
          </motion.div>
          {todaysBouquet.length > 0 && (
            <p
              className="text-center text-[#FF69B4] mt-3"
              style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
            >
              Tap to see today's bouquet details
            </p>
          )}
        </section>

        {/* Global Tasks Section */}
        {globalTasks.length > 0 && (
          <GlobalTasks 
            tasks={globalTasks} 
            onWorkOnTask={handleWorkOnGlobalTask}
            onAddSubtaskToToday={handleAddSubtaskToToday}
          />
        )}

        {/* Future Projects Section */}
        {futureTasks.length > 0 && (
          <FutureProjects 
            tasks={futureTasks} 
            onSelectTask={handleSelectFutureTask}
            onAddToToday={handleAddFutureTaskToToday}
          />
        )}

        {/* Whoosh Animation */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-[#FF69B4]/20 to-[#228B22]/20 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1.5, 1], rotate: [0, 360, 720] }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              >
                <Sparkles className="w-32 h-32 text-[#FF69B4]" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute text-[#228B22] text-3xl mt-40"
                style={{ fontFamily: 'VT323, monospace' }}
              >
                Prioritizing your tasks...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prioritized View - Show ONE task at a time */}
        {isPrioritized && currentTask && (
          <motion.section
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 border-4 border-[#FF69B4] shadow-2xl text-center max-w-2xl mx-auto relative"
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
        )}

        {/* Task List View - Not Prioritized Yet */}
        {!isPrioritized && regularTasks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border-4 border-[#FF69B4] shadow-2xl max-w-3xl mx-auto"
          >
            <h2
              className="text-[#228B22] text-center mb-6"
              style={{ fontFamily: 'VT323, monospace', fontSize: '36px' }}
            >
              YOUR TASKS
            </h2>

            <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
              {regularTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#FFE4E1] to-[#E6F7E6] rounded-2xl border-3 border-[#FFB6C1]"
                >
                  <span
                    className="text-[#FF69B4] text-2xl font-bold min-w-[40px]"
                    style={{ fontFamily: 'VT323, monospace' }}
                  >
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <p
                      className="text-[#228B22]"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
                    >
                      {task.name}
                    </p>
                    <p
                      className="text-[#FF69B4]"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                    >
                      {task.estimatedTime} {task.timeUnit || 'min'}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 hover:bg-white rounded-xl transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-5 h-5 text-[#FF69B4]" />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={handleGeneratePrioritizedList}
              className="w-full flex items-center justify-center gap-3 px-10 py-6 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF69B4] text-white rounded-3xl border-4 border-[#C71585] shadow-lg"
              style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-7 h-7" />
              GENERATE PRIORITIZED LIST
            </motion.button>
          </motion.section>
        )}

        {/* Empty State */}
        {allTasks.length === 0 && !isPrioritized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-4 border-[#FF69B4] shadow-xl max-w-3xl mx-auto"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-6"
            >
              <PixelSprout state="sleeping" className="w-32 h-32 mx-auto" />
            </motion.div>
            <h2
              className="text-[#228B22] text-3xl mb-4"
              style={{ fontFamily: 'VT323, monospace' }}
            >
              READY TO BLOOM?
            </h2>
            <p
              className="text-[#FF69B4] text-lg mb-8 max-w-md mx-auto"
              style={{ fontFamily: 'VT323, monospace', fontSize: '26px' }}
            >
              Add tasks one by one with your voice, or dump everything from your brain!
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => setIsVoiceInputOpen(true)}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] hover:from-[#1a6b1a] hover:to-[#228B22] text-white rounded-3xl transition-all border-4 border-[#0f4d0f] shadow-lg"
                style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className="w-6 h-6" />
                SPEAK
              </motion.button>
              <motion.button
                onClick={() => setIsBrainDumpOpen(true)}
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF69B4] text-white rounded-3xl transition-all border-4 border-[#C71585] shadow-lg"
                style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-6 h-6" />
                DUMP
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isBrainDumpOpen && (
          <BrainDumpModal
            isOpen={isBrainDumpOpen}
            onClose={() => setIsBrainDumpOpen(false)}
            onSubmit={handleBrainDump}
          />
        )}
        
        {isVoiceInputOpen && (
          <VoiceTaskInput
            isOpen={isVoiceInputOpen}
            onClose={() => setIsVoiceInputOpen(false)}
            onAddTask={handleAddSingleTask}
            customCategories={customCategories}
            onAddCategory={handleAddCategory}
          />
        )}

        {showContinueSubtaskModal && (
          <ContinueSubtaskModal
            isOpen={showContinueSubtaskModal}
            globalTask={currentGlobalTaskForContinue}
            nextSubtask={nextSubtaskForContinue}
            onContinue={() => {
              // Add the next subtask to today
              if (currentGlobalTaskForContinue && nextSubtaskForContinue) {
                handleAddSubtaskToToday(currentGlobalTaskForContinue.id, nextSubtaskForContinue);
              }
              setShowContinueSubtaskModal(false);
            }}
            onFinish={() => {
              setShowContinueSubtaskModal(false);
              // Bouquet is complete for today
            }}
          />
        )}
      </AnimatePresence>

      {/* Mascot with speech bubble */}
      <motion.div
        className="fixed bottom-8 left-8 z-50 group"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Speech bubble - appears on hover, extends off-screen to left */}
        <motion.div
          className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={{ x: -20, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative bg-white border-3 border-[#228B22] rounded-2xl px-4 py-2 shadow-lg whitespace-nowrap -translate-x-[30%]">
            <p
              className="text-[#228B22]"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              hover over me~ I'll run away!
            </p>
            {/* Speech bubble tail */}
            <div className="absolute top-full left-[35%] -mt-1">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#228B22]" />
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white absolute top-[-12px] left-1/2 -translate-x-1/2" />
            </div>
          </div>
        </motion.div>
        
        <PixelSprout state="idle" className="w-24 h-24 drop-shadow-xl cursor-pointer" />
      </motion.div>

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