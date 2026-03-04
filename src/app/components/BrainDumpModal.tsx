import { motion } from 'motion/react';
import { X, Send, Sparkles } from 'lucide-react';
import React from 'react';

interface BrainDumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: string) => void;
}

export function BrainDumpModal({ isOpen, onClose, onSubmit }: BrainDumpModalProps) {
  const [input, setInput] = React.useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
      setInput('');
      onClose();
    }
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
        className="bg-gradient-to-br from-[#FFE4E1] to-[#FFB6C1] rounded-3xl p-8 max-w-2xl w-full border-4 border-[#FF69B4] shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#228B22]" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#228B22]" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#228B22]" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#228B22]" />

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-[#FF69B4]" />
              <h2 
                className="text-[#228B22] text-xl"
                style={{ fontFamily: 'VT323, monospace' }}
              >
                BRAIN DUMP
              </h2>
            </div>
            <p 
              className="text-[#FF69B4]"
              style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
            >
              Pour out your thoughts, I'll sort them for you
            </p>
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

        <div className="relative z-10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type each task on a new line...&#10;&#10;Example:&#10;Clean the kitchen&#10;Write report for work&#10;Call mom&#10;Draw something fun"
            className="w-full h-64 p-6 bg-white border-4 border-[#FF69B4] rounded-3xl resize-none outline-none text-[#228B22] placeholder:text-[#FFB6C1]/60 shadow-inner"
            style={{ fontFamily: 'VT323, monospace', fontSize: '22px', lineHeight: '1.6' }}
          />
          <motion.button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="absolute bottom-6 right-6 p-4 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] hover:from-[#FF1493] hover:to-[#FF69B4] text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-3 border-[#C71585] shadow-lg"
            whileHover={{ scale: input.trim() ? 1.1 : 1 }}
            whileTap={{ scale: input.trim() ? 0.95 : 1 }}
          >
            <Send className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="mt-6 p-4 bg-white/60 rounded-2xl border-3 border-[#FF69B4] relative z-10">
          <p 
            className="text-[#228B22]"
            style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
          >
            💡 Tip: Just write naturally! Mention if something is quick or will take a while. I'll figure out the rest.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}