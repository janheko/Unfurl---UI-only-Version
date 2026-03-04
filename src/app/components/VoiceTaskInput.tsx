import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, MicOff, Plus, Calendar, Clock, Zap, Tag, List, Trash2 } from 'lucide-react';
import { Task, TaskCategory, TimeUnit, Subtask } from '../types';

interface VoiceTaskInputProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  customCategories?: string[];
  onAddCategory?: (category: string) => void;
}

const DEFAULT_CATEGORIES: TaskCategory[] = ['work', 'selfcare', 'chores', 'creative', 'social'];

export function VoiceTaskInput({ isOpen, onClose, onAddTask, customCategories = [], onAddCategory }: VoiceTaskInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [category, setCategory] = useState<string>('');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('30');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('minutes');
  const [difficultyLevel, setDifficultyLevel] = useState(5);
  const [emotionalFeeling, setEmotionalFeeling] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deadlineOption, setDeadlineOption] = useState<'none' | 'today' | 'tomorrow' | 'custom'>('none');
  const [customDate, setCustomDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('23:59');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [currentSubtask, setCurrentSubtask] = useState('');
  const [showSubtasks, setShowSubtasks] = useState(false);
  const recognitionRef = useRef<any>(null);

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

  const emotionalOptions = [
    { id: 'scary', label: 'Scary', color: '#FF6B6B' },
    { id: 'easy', label: 'Easy', color: '#51CF66' },
    { id: 'joyful', label: 'Joyful', color: '#FFD93D' },
    { id: 'boring', label: 'Boring', color: '#ADB5BD' },
    { id: 'exciting', label: 'Exciting', color: '#FF69B4' },
    { id: 'draining', label: 'Draining', color: '#9775FA' },
  ];

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryInput.trim() && !allCategories.includes(newCategoryInput.trim().toLowerCase())) {
      const newCat = newCategoryInput.trim().toLowerCase();
      onAddCategory?.(newCat);
      setCategory(newCat);
      setNewCategoryInput('');
      setShowCategoryInput(false);
    }
  };

  const convertToMinutes = (time: number, unit: TimeUnit): number => {
    switch (unit) {
      case 'seconds': return time / 60;
      case 'minutes': return time;
      case 'hours': return time * 60;
      case 'days': return time * 60 * 24;
      default: return time;
    }
  };

  const handleAddTask = () => {
    if (!transcript.trim()) return;

    const estimatedMinutes = convertToMinutes(Number(estimatedTime), timeUnit);

    // Build deadline ISO string based on selection
    let finalDeadline = '';
    if (deadlineOption !== 'none') {
      let deadlineDate = new Date();
      
      if (deadlineOption === 'today') {
        // Today with time (defaults to 23:59 if not changed)
        const [hours, minutes] = deadlineTime.split(':');
        deadlineDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else if (deadlineOption === 'tomorrow') {
        // Tomorrow with time (defaults to 23:59 if not changed)
        deadlineDate.setDate(deadlineDate.getDate() + 1);
        const [hours, minutes] = deadlineTime.split(':');
        deadlineDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else if (deadlineOption === 'custom' && customDate) {
        // Custom date with time (defaults to 23:59 if not changed)
        const [year, month, day] = customDate.split('-');
        const [hours, minutes] = deadlineTime.split(':');
        deadlineDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), 0, 0);
      }
      
      finalDeadline = deadlineDate.toISOString();
    }

    // Check if this is a global task (has subtasks + future deadline)
    const isGlobalTask = subtasks.length > 0 && finalDeadline && !isToday(new Date(finalDeadline));
    
    // If global task, automatically mark first subtask for today
    const processedSubtasks = isGlobalTask && subtasks.length > 0
      ? subtasks.map((subtask, index) => 
          index === 0 
            ? { ...subtask, addedToToday: true, scheduledDate: new Date().toISOString() }
            : subtask
        )
      : subtasks;

    // AI-enhanced priority calculation based on difficulty and energy
    const energyRequired = Math.ceil((difficultyLevel + (estimatedMinutes / 15)) / 2);
    const urgency = finalDeadline ? 8 : Math.max(3, 10 - difficultyLevel);

    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: transcript,
      category: (category as TaskCategory) || 'work',
      estimatedMinutes,
      estimatedTime: Number(estimatedTime),
      timeUnit,
      energyRequired: Math.min(10, energyRequired),
      urgency,
      importance: difficultyLevel,
      deadline: finalDeadline || undefined,
      createdAt: Date.now(),
      subtasks: processedSubtasks,
    };

    onAddTask(newTask);
    
    // Reset for next task
    setTranscript('');
    setCategory('');
    setEstimatedTime('30');
    setTimeUnit('minutes');
    setDifficultyLevel(5);
    setDeadline('');
    setDeadlineOption('none');
    setCustomDate('');
    setDeadlineTime('23:59');
    setEmotionalFeeling('');
    setSubtasks([]);
    setCurrentSubtask('');
    setShowSubtasks(false);
  };

  const handleAddSubtask = () => {
    if (currentSubtask.trim()) {
      const newSubtask: Subtask = {
        id: `subtask-${Date.now()}`,
        name: currentSubtask.trim(),
        completed: false,
      };
      setSubtasks([...subtasks, newSubtask]);
      setCurrentSubtask('');
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  if (!isOpen) return null;

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
        className="bg-gradient-to-br from-[#FFE4E1] to-[#FFB6C1] rounded-3xl p-8 max-w-lg w-full border-4 border-[#FF69B4] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-3xl">🌸</div>
        <div className="absolute bottom-4 left-4 text-2xl">✨</div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 
              className="text-[#228B22] text-2xl mb-2"
              style={{ fontFamily: 'VT323, monospace' }}
            >
              Add Tasks One by One
            </h2>
            <p 
              className="text-[#FF69B4]"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              Speak or type each task
            </p>
          </div>
          <motion.button
            onClick={onClose}
            className="p-3 hover:bg-white/50 rounded-2xl transition-colors border-3 border-[#FF69B4] bg-white"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6 text-[#FF69B4]" />
          </motion.button>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Voice/Text Input */}
          <div className="relative">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full h-32 p-6 bg-white border-4 border-[#FF69B4] rounded-3xl resize-none outline-none text-[#228B22] placeholder:text-[#FFB6C1]/60"
              style={{ fontFamily: 'VT323, monospace', fontSize: '24px', lineHeight: '1.4' }}
            />
            
            {/* Microphone Button */}
            <motion.button
              onClick={toggleListening}
              className={`absolute bottom-4 right-4 p-4 rounded-2xl transition-all border-3 ${
                isListening 
                  ? 'bg-[#FF1493] border-[#C71585] animate-pulse' 
                  : 'bg-[#228B22] border-[#1a6b1a] hover:bg-[#1a6b1a]'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>

          {/* Time Estimation Button */}
          <div>
            <label 
              className="flex items-center gap-2 text-[#228B22] mb-3"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              <Clock className="w-5 h-5" />
              How long will this take?
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="30"
                min="1"
                className="flex-1 px-4 py-3 bg-white border-3 border-[#FFB6C1] rounded-2xl outline-none text-[#228B22]"
                style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
                className="px-4 py-3 bg-white border-3 border-[#FFB6C1] rounded-2xl outline-none text-[#228B22]"
                style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
              >
                <option value="seconds">seconds</option>
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
                <option value="days">days</option>
              </select>
            </div>
          </div>

          {/* Emotional Feeling */}
          <div>
            <label 
              className="flex items-center gap-2 text-[#228B22] mb-3"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              💭 How does this feel to do?
            </label>
            <div className="flex gap-2 flex-wrap">
              {emotionalOptions.map((emotion) => (
                <motion.button
                  key={emotion.id}
                  onClick={() => setEmotionalFeeling(emotion.id)}
                  className={`px-4 py-2 rounded-2xl border-3 transition-all ${
                    emotionalFeeling === emotion.id
                      ? 'border-[#FF1493] shadow-lg'
                      : 'border-white/50'
                  }`}
                  style={{ 
                    fontFamily: 'VT323, monospace', 
                    fontSize: '18px',
                    backgroundColor: emotionalFeeling === emotion.id ? emotion.color : 'white',
                    color: emotionalFeeling === emotion.id ? 'white' : emotion.color,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {emotion.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label 
              className="flex items-center gap-2 text-[#228B22] mb-3"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              <Zap className="w-5 h-5" />
              Difficulty: {difficultyLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(Number(e.target.value))}
              className="w-full h-3 bg-white border-3 border-[#FFB6C1] rounded-full appearance-none cursor-pointer"
              style={{ accentColor: '#FF69B4' }}
            />
            <div className="flex justify-between mt-2" style={{ fontFamily: 'VT323, monospace', fontSize: '16px', color: '#FF69B4' }}>
              <span>Easy</span>
              <span>Hard</span>
            </div>
          </div>

          {/* Category Selection (Optional) */}
          <div>
            <label 
              className="flex items-center gap-2 text-[#228B22] mb-3"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              <Tag className="w-5 h-5" />
              Category (optional):
            </label>
            <div className="flex gap-2 flex-wrap mb-2">
              {allCategories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-2xl border-3 transition-all ${
                    category === cat
                      ? 'bg-[#228B22] border-[#1a6b1a] text-white'
                      : 'bg-white border-[#FFB6C1] text-[#228B22] hover:bg-[#FFE4E1]'
                  }`}
                  style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </motion.button>
              ))}
              <motion.button
                onClick={() => setShowCategoryInput(!showCategoryInput)}
                className="px-4 py-2 rounded-2xl border-3 bg-[#FF69B4] border-[#FF1493] text-white hover:bg-[#FF1493] transition-all"
                style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                + Add New
              </motion.button>
            </div>

            <AnimatePresence>
              {showCategoryInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                      placeholder="New category name"
                      className="flex-1 px-4 py-2 bg-white border-3 border-[#FFB6C1] rounded-2xl outline-none text-[#228B22]"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                    />
                    <motion.button
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-[#228B22] border-3 border-[#1a6b1a] text-white rounded-2xl"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Deadline (Optional but prioritized) */}
          <div>
            <label 
              className="flex items-center gap-2 text-[#228B22] mb-3"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              <Calendar className="w-5 h-5" />
              Deadline (boosts priority!):
            </label>
            <div className="space-y-3">
              <select
                value={deadlineOption}
                onChange={(e) => setDeadlineOption(e.target.value as 'none' | 'today' | 'tomorrow' | 'custom')}
                className="w-full px-4 py-3 bg-white border-3 border-[#FFB6C1] rounded-2xl outline-none text-[#228B22]"
                style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
              >
                <option value="none">No Deadline</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="custom">Pick a Date</option>
              </select>

              {/* Show time input for today/tomorrow */}
              {(deadlineOption === 'today' || deadlineOption === 'tomorrow') && (
                <div>
                  <label 
                    className="flex items-center gap-2 text-[#FF69B4] mb-2"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                  >
                    <Clock className="w-4 h-4" />
                    Time (optional, defaults to 11:59 PM):
                  </label>
                  <input
                    type="time"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-3 border-[#FFB6C1] rounded-2xl outline-none text-[#228B22]"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                  />
                </div>
              )}

              {/* Show date + time picker for custom */}
              {deadlineOption === 'custom' && (
                <div className="space-y-2">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-3 border-[#FFB6C1] rounded-2xl outline-none text-[#228B22]"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                  />
                  <div>
                    <label 
                      className="flex items-center gap-2 text-[#FF69B4] mb-2"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                    >
                      <Clock className="w-4 h-4" />
                      Time (optional, defaults to 11:59 PM):
                    </label>
                    <input
                      type="time"
                      value={deadlineTime}
                      onChange={(e) => setDeadlineTime(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-3 border-[#FFB6C1] rounded-2xl outline-none text-[#228B22]"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subtasks (Optional) */}
          <div>
            <label 
              className="flex items-center gap-2 text-[#228B22] mb-3"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              <List className="w-5 h-5" />
              Subtasks (optional):
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentSubtask}
                onChange={(e) => setCurrentSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                placeholder="Add a subtask"
                className="flex-1 px-4 py-2 bg-white border-3 border-[#FFB6C1] rounded-2xl outline-none text-[#228B22]"
                style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
              />
              <motion.button
                onClick={handleAddSubtask}
                className="px-4 py-2 bg-[#228B22] border-3 border-[#1a6b1a] text-white rounded-2xl"
                style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                +
              </motion.button>
            </div>

            {/* Subtasks List */}
            {subtasks.length > 0 && (
              <div className="space-y-2 bg-white/50 rounded-2xl p-3 border-2 border-[#FFB6C1]">
                {subtasks.map((subtask, index) => (
                  <motion.div
                    key={subtask.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2 bg-white rounded-xl p-2 border-2 border-[#FFB6C1]"
                  >
                    <span 
                      className="text-[#FF69B4] font-bold min-w-[24px]"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                    >
                      {index + 1}.
                    </span>
                    <span 
                      className="flex-1 text-[#228B22]"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                    >
                      {subtask.name}
                    </span>
                    <motion.button
                      onClick={() => handleRemoveSubtask(subtask.id)}
                      className="p-1 hover:bg-[#FF69B4]/20 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4 text-[#FF69B4]" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Add Button */}
          <motion.button
            onClick={handleAddTask}
            disabled={!transcript.trim()}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-br from-[#228B22] to-[#1a6b1a] hover:from-[#1a6b1a] hover:to-[#228B22] text-white rounded-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-4 border-[#0f4d0f] shadow-lg"
            style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
            whileHover={{ scale: transcript.trim() ? 1.05 : 1 }}
            whileTap={{ scale: transcript.trim() ? 0.98 : 1 }}
          >
            <Plus className="w-6 h-6" />
            Add This Task
          </motion.button>

          <p
            className="text-center text-[#FF69B4]"
            style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
          >
            Keep adding tasks or close when done!
          </p>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF69B4]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#228B22]/10 to-transparent rounded-full blur-3xl" />
      </motion.div>
    </motion.div>
  );
}

// Helper function to check if date is today
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};