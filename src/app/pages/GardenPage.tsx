import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { AppContext } from '../layouts/MainLayout';

export function GardenPage() {
  const navigate = useNavigate();
  const { gardenBouquets } = useContext(AppContext);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F7E6] via-[#FFF0F5] to-[#FFE4E1] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle, #228B22 1px, transparent 1px)`,
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
          BACK
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-20 max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[#228B22] mb-12"
          style={{ fontFamily: 'VT323, monospace', fontSize: '48px' }}
        >
          YOUR GARDEN
        </motion.h1>

        {gardenBouquets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-4 border-[#FF69B4] shadow-xl max-w-2xl mx-auto"
          >
            <div className="text-6xl mb-6">🌱</div>
            <h2
              className="text-[#228B22] text-3xl mb-4"
              style={{ fontFamily: 'VT323, monospace' }}
            >
              YOUR GARDEN IS WAITING
            </h2>
            <p
              className="text-[#FF69B4] text-lg max-w-md mx-auto"
              style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
            >
              Complete tasks to grow flowers! Your bouquets will be saved here at the end of each day.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...gardenBouquets].reverse().map((bouquet, index) => (
              <motion.div
                key={bouquet.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/bouquet/${bouquet.date}`)}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-4 border-[#FF69B4] shadow-lg cursor-pointer hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shelf Visual */}
                <div className="relative mb-4">
                  {/* Vase with flowers */}
                  <div className="flex justify-center items-end h-48 mb-4 bg-gradient-to-b from-transparent to-[#FFE4E1]/30 rounded-2xl p-4">
                    {/* Simple vase */}
                    <div className="relative">
                      <svg viewBox="0 0 100 80" className="w-32 h-28" style={{ imageRendering: 'pixelated' }}>
                        <path d="M 25 15 L 20 75 L 80 75 L 75 15 Z" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="3" />
                        <ellipse cx="50" cy="15" rx="25" ry="6" fill="#FF69B4" stroke="#FF1493" strokeWidth="3" />
                        <ellipse cx="50" cy="25" rx="22" ry="5" fill="#87CEEB" fillOpacity="0.4" />
                      </svg>
                      
                      {/* Flowers */}
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-1">
                        {bouquet.flowers.slice(0, 5).map((flower, i) => (
                          <motion.span
                            key={i}
                            className="text-4xl"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + i * 0.1 }}
                          >
                            {flower.flowerType === 'rose' && '🌹'}
                            {flower.flowerType === 'sunflower' && '🌻'}
                            {flower.flowerType === 'daisy' && '🌼'}
                            {flower.flowerType === 'lavender' && '💜'}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Label */}
                <div className="text-center">
                  <p
                    className="text-[#228B22] mb-2"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
                  >
                    {formatDate(bouquet.date)}
                  </p>
                  <p
                    className="text-[#FF69B4]"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                  >
                    {bouquet.flowers.length} {bouquet.flowers.length === 1 ? 'flower' : 'flowers'}
                  </p>
                </div>

                {/* Shelf */}
                <div className="mt-4 h-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-full border-2 border-[#654321]" />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Floating decorations */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl pointer-events-none"
          style={{
            top: `${10 + i * 15}%`,
            left: `${5 + (i % 2) * 90}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.7,
          }}
        >
          {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '🌼' : '🌻'}
        </motion.div>
      ))}
    </div>
  );
}
