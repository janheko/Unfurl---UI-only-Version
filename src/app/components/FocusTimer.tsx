import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Check, SkipForward, ArrowRight } from 'lucide-react';
import { Task, Subtask } from '../types';
import { PixelSprout } from './PixelArt';

interface FocusTimerProps {
  task: Task;
  onClose: () => void;
  onComplete: (timeSpent: number, subtaskId?: string) => void;
  onSkip: () => void; // Skip to next task entirely
  onPauseLater: () => void; // Move to end of today's queue
  onPauseTomorrow: () => void; // Push to tomorrow
}

export function FocusTimer({ task, onClose, onComplete, onSkip, onPauseLater, onPauseTomorrow }: FocusTimerProps) {
  const [seconds, setSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [showPauseMenu, setShowPauseMenu] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [flowerType, setFlowerType] = React.useState<'rose' | 'daisy' | 'sunflower' | 'lavender'>('daisy');
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = React.useState(0);

  // Get subtasks that are added to today (for global tasks)
  const todaysSubtasks = React.useMemo(() => {
    if (!task.subtasks) return null;
    return task.subtasks.filter(st => st.addedToToday && !st.completed);
  }, [task.subtasks]);

  const isGlobalTask = todaysSubtasks && todaysSubtasks.length > 0;
  const currentSubtask = isGlobalTask ? todaysSubtasks[currentSubtaskIndex] : null;

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  React.useEffect(() => {
    // Determine flower type based on task
    if (task.energyRequired >= 8) {
      setFlowerType('rose');
    } else if (task.estimatedMinutes >= 60) {
      setFlowerType('sunflower');
    } else if (task.energyRequired <= 4) {
      setFlowerType('lavender');
    } else {
      setFlowerType('daisy');
    }
  }, [task]);

  const progress = Math.min((seconds / (task.estimatedMinutes * 60)) * 100, 100);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  // Worker walks back and forth on the ground
  const walkCycle = seconds % 20; // Complete walk cycle every 20 seconds
  const workerX = walkCycle < 10 
    ? 10 + (walkCycle * 8) // Walking right: 10% to 90%
    : 90 - ((walkCycle - 10) * 8); // Walking left: 90% back to 10%
  const workerY = 75; // Stay on ground level
  const isWalkingRight = walkCycle < 10;

  const handleCheckClick = () => {
    setIsRunning(false);
    setShowConfirmation(true);
  };

  const handleConfirmYes = () => {
    setShowConfirmation(false);
    setIsCompleted(true);
    setTimeout(() => {
      onComplete(seconds, currentSubtask?.id);
    }, 3000);
  };

  const handleConfirmNo = () => {
    setShowConfirmation(false);
    setIsRunning(true);
  };

  const handlePauseClick = () => {
    setIsRunning(false);
    setShowPauseMenu(true);
  };

  const handleMoveToNextSubtask = () => {
    if (!isGlobalTask || !todaysSubtasks) return;
    
    // Mark current subtask as complete
    setIsCompleted(true);
    setTimeout(() => {
      if (currentSubtaskIndex < todaysSubtasks.length - 1) {
        // Move to next subtask
        onComplete(seconds, currentSubtask?.id);
        setCurrentSubtaskIndex(currentSubtaskIndex + 1);
        setSeconds(0);
        setIsCompleted(false);
        setIsRunning(false);
      } else {
        // Last subtask complete
        onComplete(seconds, currentSubtask?.id);
      }
    }, 2000);
  };

  const getFlowerEmoji = () => {
    switch (flowerType) {
      case 'rose': return '🌹';
      case 'sunflower': return '🌻';
      case 'lavender': return '💜';
      default: return '🌼';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: isCompleted ? 1.1 : 1, y: 0 }}
        className="bg-gradient-to-br from-[#FFE4E1] to-[#E6F7E6] rounded-3xl p-8 max-w-2xl w-full border-4 border-[#FF69B4] shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h3
              className="text-[#228B22] mb-1"
              style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}
            >
              PLANTING IN PROGRESS
            </h3>
            <p
              className="text-[#FF69B4]"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              Growing: {getFlowerEmoji()}
            </p>
            {isGlobalTask && todaysSubtasks && (
              <p
                className="text-[#228B22]"
                style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
              >
                Subtask {currentSubtaskIndex + 1} of {todaysSubtasks.length}
              </p>
            )}
          </div>
          <motion.button
            onClick={onClose}
            className="p-3 hover:bg-white/50 rounded-2xl transition-colors border-3 border-[#FF69B4] bg-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6 text-[#FF69B4]" />
          </motion.button>
        </div>

        {/* Task Name */}
        <div className="bg-white/80 rounded-2xl p-4 mb-6 border-3 border-[#FF69B4] relative z-10">
          <p
            className="text-[#228B22] text-center mb-2"
            style={{ fontFamily: 'VT323, monospace', fontSize: '24px', lineHeight: '1.4' }}
          >
            {task.name}
          </p>
          {currentSubtask && (
            <p
              className="text-[#FF69B4] text-center"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px', lineHeight: '1.4' }}
            >
              → {currentSubtask.name}
            </p>
          )}
        </div>

        {/* Worker Animation Scene */}
        <div className="relative h-80 mb-6 bg-gradient-to-b from-sky-100 to-[#E6F7E6] rounded-2xl p-6 border-3 border-[#228B22] overflow-hidden">
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#8B4513] border-t-4 border-[#654321]" />
          
          {/* Digging area - shows progress */}
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#654321] rounded-lg border-4 border-[#4a2f1a]"
            initial={{ width: 60, height: 0 }}
            animate={{ 
              width: 60 + progress * 2, 
              height: Math.min(progress * 0.8, 60) 
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Dirt piles */}
          {isRunning && (
            <>
              <motion.div
                className="absolute bottom-20 left-1/3 w-8 h-6 bg-[#8B4513] rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-20 right-1/3 w-10 h-8 bg-[#8B4513] rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          {/* Growing flower in center */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center">
            {progress > 10 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${progress * 1.5}px` }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Stem */}
                <div 
                  className="w-3 bg-gradient-to-b from-[#228B22] to-[#1a6b1a] mx-auto border-2 border-[#0f4d0f]" 
                  style={{ height: '100%' }} 
                />
                
                {/* Flower appears at 60% */}
                {progress > 60 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl"
                  >
                    {getFlowerEmoji()}
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Green Man Worker moving around the scene */}
          {isRunning && (
            <motion.div
              className="absolute bottom-24 z-40"
              animate={{
                left: isWalkingRight ? ['10%', '90%'] : ['90%', '10%'],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear'
              }}
            >
              <motion.div
                style={{
                  transform: isWalkingRight ? 'scaleX(1)' : 'scaleX(-1)',
                }}
                animate={{ 
                  y: [0, -3, 0, -3, 0], // Bob up and down for stepping effect
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <PixelSprout state="working" className="w-16 h-16 drop-shadow-lg" />
              </motion.div>
            </motion.div>
          )}

          {/* Shovel/tool animation */}
          {isRunning && progress < 60 && (
            <motion.div
              className="absolute bottom-28 left-1/2 -translate-x-1/2 text-3xl"
              animate={{ 
                rotate: [-45, -25, -45],
                y: [0, 5, 0]
              }}
              transition={{ 
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              ⛏️
            </motion.div>
          )}

          {/* Sparkles when flower appears */}
          {progress > 60 && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${45 + Math.random() * 10}%`,
                    top: `${20 + Math.random() * 20}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    y: [0, -20, -40],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-10 bg-white border-4 border-[#FF69B4] rounded-2xl overflow-hidden mb-4 relative z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#228B22] to-[#90EE90]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[#228B22] drop-shadow-lg font-bold"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Timer Display - COUNT UP */}
        <div className="text-center mb-6 bg-white/90 rounded-2xl p-4 border-3 border-[#FF69B4] relative z-10">
          <p
            className="text-[#FF69B4] text-sm mb-2"
            style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
          >
            TIME SPENT
          </p>
          <span
            className="text-[#228B22] text-5xl block"
            style={{ fontFamily: 'VT323, monospace' }}
          >
            {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
          </span>
          <p
            className="text-[#FF69B4] text-sm mt-2"
            style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
          >
            Estimated: {task.estimatedTime} {task.timeUnit || 'minutes'}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center relative z-10 mb-4">
          <motion.button
            onClick={() => setIsRunning(!isRunning)}
            className="p-5 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] hover:from-[#1a6b1a] hover:to-[#228B22] text-white rounded-2xl transition-all border-3 border-[#0f4d0f] shadow-lg"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRunning ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7" />
            )}
          </motion.button>

          <motion.button
            onClick={handleCheckClick}
            disabled={seconds < 10}
            className="p-5 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF69B4] text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-3 border-[#C71585] shadow-lg"
            whileHover={{ scale: seconds >= 10 ? 1.1 : 1, y: seconds >= 10 ? -2 : 0 }}
            whileTap={{ scale: seconds >= 10 ? 0.95 : 1 }}
          >
            <Check className="w-7 h-7" />
          </motion.button>
        </div>

        {/* Additional Action Buttons */}
        <div className="flex gap-3 justify-center relative z-10">
          {isGlobalTask && currentSubtaskIndex < (todaysSubtasks?.length || 0) - 1 && (
            <motion.button
              onClick={handleMoveToNextSubtask}
              disabled={seconds < 10}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] hover:from-[#1a6b1a] hover:to-[#228B22] text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-3 border-[#0f4d0f] shadow-lg"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
              whileHover={{ scale: seconds >= 10 ? 1.05 : 1 }}
              whileTap={{ scale: seconds >= 10 ? 0.95 : 1 }}
            >
              <ArrowRight className="w-5 h-5" />
              NEXT SUBTASK
            </motion.button>
          )}

          <motion.button
            onClick={handlePauseClick}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#FFE4E1] border-4 border-[#FF69B4] text-[#FF69B4] rounded-2xl transition-all shadow-lg"
            style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SkipForward className="w-5 h-5" />
            PAUSE/SKIP
          </motion.button>
        </div>

        <p
          className="text-center text-[#FF69B4] mt-4 relative z-10"
          style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
        >
          {isRunning ? 'Worker is digging! 🌱' : 'Hit play to start planting...'}
        </p>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-white rounded-3xl p-8 border-4 border-[#FF69B4] shadow-2xl max-w-sm mx-4"
              >
                <p
                  className="text-[#228B22] text-center mb-6"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}
                >
                  {currentSubtask ? `Done with this subtask?` : `Are you done with this task?`}
                </p>
                <div className="flex gap-4">
                  <motion.button
                    onClick={handleConfirmYes}
                    className="flex-1 px-6 py-4 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] hover:from-[#1a6b1a] hover:to-[#228B22] text-white rounded-2xl border-3 border-[#0f4d0f] shadow-lg"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    YES!
                  </motion.button>
                  <motion.button
                    onClick={handleConfirmNo}
                    className="flex-1 px-6 py-4 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF69B4] text-white rounded-2xl border-3 border-[#C71585] shadow-lg"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    NOT YET
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Menu Modal */}
        <AnimatePresence>
          {showPauseMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-white rounded-3xl p-8 border-4 border-[#FF69B4] shadow-2xl max-w-md mx-4"
              >
                <p
                  className="text-[#228B22] text-center mb-6"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}
                >
                  What would you like to do?
                </p>
                <div className="space-y-3">
                  <motion.button
                    onClick={onPauseLater}
                    className="w-full px-6 py-4 bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] hover:from-[#FF69B4] hover:to-[#FFB6C1] text-white rounded-2xl border-3 border-[#FF1493] shadow-lg"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    CONTINUE LATER TODAY
                  </motion.button>

                  <motion.button
                    onClick={onPauseTomorrow}
                    className="w-full px-6 py-4 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] hover:from-[#1a6b1a] hover:to-[#228B22] text-white rounded-2xl border-3 border-[#0f4d0f] shadow-lg"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    DO THIS TOMORROW
                  </motion.button>

                  <motion.button
                    onClick={onSkip}
                    className="w-full px-6 py-4 bg-white hover:bg-[#FFE4E1] border-4 border-[#228B22] text-[#228B22] rounded-2xl shadow-lg"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    SKIP TO NEXT TASK
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setShowPauseMenu(false);
                      setIsRunning(true);
                    }}
                    className="w-full px-6 py-4 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF69B4] text-white rounded-2xl border-3 border-[#C71585] shadow-lg"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    CANCEL
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bloomed Animation */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#FFE4E1] to-[#E6F7E6] rounded-3xl z-50"
          >
            <div className="text-center">
              <motion.div
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{ duration: 1.2, type: 'spring' }}
                className="text-9xl mb-6"
              >
                {getFlowerEmoji()}
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#228B22]"
                style={{ fontFamily: 'VT323, monospace', fontSize: '48px' }}
              >
                BLOOMED!
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-[#FF69B4] mt-2"
                style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}
              >
                +{Math.floor(seconds / 60)}m {seconds % 60}s focused
              </motion.p>
              {/* Celebration particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-3xl"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 150,
                    y: Math.sin((i / 12) * Math.PI * 2) * 150,
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 1,
                    ease: 'easeOut'
                  }}
                >
                  {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '✨' : '🌼'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}