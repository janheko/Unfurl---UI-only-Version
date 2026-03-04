import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Clock, Calendar, Zap, Tag } from 'lucide-react';
import { AppContext } from '../layouts/MainLayout';

export function FlowerDetailPage() {
  const { flowerId } = useParams();
  const navigate = useNavigate();
  const { completedTasks, todaysBouquet, gardenBouquets } = useContext(AppContext);

  // Search for flower in today's bouquet and all garden bouquets
  const allFlowers = [
    ...todaysBouquet,
    ...gardenBouquets.flatMap(b => b.flowers)
  ];
  
  const flower = allFlowers.find(f => f.id === flowerId);

  if (!flower) {
    navigate('/');
    return null;
  }

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
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFlowerName = (type: string) => {
    switch (type) {
      case 'rose': return 'Rose';
      case 'sunflower': return 'Sunflower';
      case 'daisy': return 'Daisy';
      case 'lavender': return 'Lavender';
      default: return 'Flower';
    }
  };

  const getFlowerEmoji = (type: string) => {
    switch (type) {
      case 'rose': return '🌹';
      case 'sunflower': return '🌻';
      case 'daisy': return '🌼';
      case 'lavender': return '💜';
      default: return '🌸';
    }
  };

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
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#FFE4E1] border-4 border-[#228B22] rounded-3xl transition-all shadow-lg"
          style={{ fontFamily: 'VT323, monospace', fontSize: '20px', color: '#228B22' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          BACK
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 border-4 border-[#FF69B4] shadow-2xl"
        >
          {/* Flower Display */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1 }}
            className="text-center mb-8"
          >
            <div className="text-9xl mb-4">
              {getFlowerEmoji(flower.flowerType)}
            </div>
            <h1
              className="text-[#228B22] mb-2"
              style={{ fontFamily: 'VT323, monospace', fontSize: '36px' }}
            >
              {getFlowerName(flower.flowerType)}
            </h1>
            <p
              className="text-[#FF69B4]"
              style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}
            >
              Grown from hard work and dedication
            </p>
          </motion.div>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#FF69B4] to-transparent rounded-full mb-8" />

          {/* Task Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Task Name */}
            <div className="bg-gradient-to-br from-[#FFE4E1] to-[#FFB6C1] p-6 rounded-2xl border-3 border-[#FF69B4]">
              <p
                className="text-[#228B22] text-center"
                style={{ 
                  fontFamily: 'VT323, monospace', 
                  fontSize: '28px',
                  lineHeight: '1.4'
                }}
              >
                {flower.name}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Time Spent */}
              <div className="bg-gradient-to-br from-[#E6F7E6] to-[#90EE90] p-5 rounded-2xl border-3 border-[#228B22]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-[#228B22]" />
                  <p
                    className="text-[#228B22]"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                  >
                    TIME SPENT
                  </p>
                </div>
                <p
                  className="text-[#228B22]"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '32px' }}
                >
                  {formatTime(flower.timeSpent)}
                </p>
              </div>

              {/* Energy Required */}
              <div className="bg-gradient-to-br from-[#FFE4E1] to-[#FFB6C1] p-5 rounded-2xl border-3 border-[#FF69B4]">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-[#FF69B4]" />
                  <p
                    className="text-[#FF69B4]"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                  >
                    DIFFICULTY
                  </p>
                </div>
                <p
                  className="text-[#FF69B4]"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '32px' }}
                >
                  {flower.energyRequired}/10
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white p-5 rounded-2xl border-3 border-[#FFB6C1]">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-5 h-5 text-[#FF69B4]" />
                <p
                  className="text-[#228B22]"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                >
                  CATEGORY
                </p>
              </div>
              <p
                className="text-[#FF69B4] capitalize"
                style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}
              >
                {flower.category}
              </p>
            </div>

            {/* Completed At */}
            <div className="bg-white p-5 rounded-2xl border-3 border-[#228B22]">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-[#228B22]" />
                <p
                  className="text-[#228B22]"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                >
                  COMPLETED ON
                </p>
              </div>
              <p
                className="text-[#228B22]"
                style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
              >
                {formatDate(flower.completedAt)}
              </p>
            </div>

            {/* Original Estimate */}
            {flower.estimatedTime && flower.timeUnit && (
              <div className="bg-gradient-to-br from-[#FFF0F5] to-[#FFE4E1] p-5 rounded-2xl border-3 border-[#FFB6C1]">
                <p
                  className="text-[#FF69B4] mb-2"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                >
                  ORIGINAL ESTIMATE
                </p>
                <p
                  className="text-[#228B22]"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
                >
                  {flower.estimatedTime} {flower.timeUnit}
                </p>
              </div>
            )}
          </motion.div>

          {/* Celebration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p
              className="text-[#FF69B4]"
              style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
            >
              🎉 You did it! This task is complete! 🎉
            </p>
          </motion.div>

          {/* Sparkle particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Floating decorations */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl pointer-events-none"
          style={{
            top: `${10 + i * 15}%`,
            left: `${5 + (i % 2) * 85}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        >
          {getFlowerEmoji(flower.flowerType)}
        </motion.div>
      ))}
    </div>
  );
}
