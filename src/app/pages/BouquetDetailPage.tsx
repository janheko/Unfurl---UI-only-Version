import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Clock } from 'lucide-react';
import { AppContext } from '../layouts/MainLayout';
import { PixelRose, PixelDaisy, PixelSunflower, PixelLavender, PixelVaseRim, PixelVaseBody } from '../components/PixelArt';

const FlowerComponent: Record<string, React.ComponentType<{ className?: string; style?: any }>> = {
  rose: PixelRose,
  daisy: PixelDaisy,
  sunflower: PixelSunflower,
  lavender: PixelLavender,
};

export function BouquetDetailPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  const { gardenBouquets, todaysBouquet } = useContext(AppContext);

  // Check if it's today's bouquet or a past one
  const isToday = date === 'today';
  const bouquet = isToday 
    ? { date: new Date().toISOString().split('T')[0], flowers: todaysBouquet }
    : gardenBouquets.find(b => b.date === date);

  if (!bouquet) {
    navigate('/garden');
    return null;
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
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
          onClick={() => navigate(isToday ? '/' : '/garden')}
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
      <main className="relative z-10 px-6 pb-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1
            className="text-[#228B22] mb-2"
            style={{ fontFamily: 'VT323, monospace', fontSize: '48px' }}
          >
            {isToday ? "TODAY'S BOUQUET" : 'BOUQUET'}
          </h1>
          <p
            className="text-[#FF69B4]"
            style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}
          >
            {formatDate(bouquet.date)}
          </p>
        </motion.div>

        {bouquet.flowers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-4 border-[#FF69B4] shadow-xl"
          >
            <div className="text-6xl mb-6">🌱</div>
            <p
              className="text-[#FF69B4] text-lg max-w-md mx-auto"
              style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
            >
              {isToday ? 'No flowers yet today! Complete tasks to grow your bouquet.' : 'No flowers were added on this day.'}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Bouquet Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 border-4 border-[#FF69B4] shadow-2xl mb-8"
            >
              <div className="relative flex justify-center items-center h-96 mb-6 bg-gradient-to-b from-sky-100 to-[#E6F7E6]/30 rounded-2xl p-6">
                {/* Container for vase and flowers */}
                <div className="relative">
                  {/* Layer 1 (BACK) - Vase Rim/Top Oval - z-index: 1 */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[1]">
                    <PixelVaseRim className="w-64 h-52" />
                  </div>

                  {/* Layer 2 (MIDDLE) - Flowers - z-index: 2 */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[2]"
                    style={{
                      width: '256px',
                      height: '400px',
                      position: 'relative',
                    }}
                  >
                    {bouquet.flowers.map((flower, i) => {
                      // TIGHTER boundaries to keep ALL flowers inside vase
                      const containerWidth = 256;
                      const center = containerWidth / 2; // 128px
                      
                      // Much tighter boundaries - account for flower width (~56px for w-14)
                      const leftBoundary = center - 38; // 90px (tighter!)
                      const rightBoundary = center + 38; // 166px (tighter!)
                      
                      let x: number;
                      
                      if (i === 0) {
                        // Flower 1: LEFT side
                        x = leftBoundary;
                      } else if (i === 1) {
                        // Flower 2: RIGHT side
                        x = rightBoundary;
                      } else if (i === 2) {
                        // Flower 3: CENTER
                        x = center;
                      } else {
                        // Flowers 4+: Fill gaps with smaller radius
                        const angle = (i * 137.5) * (Math.PI / 180);
                        const radius = 12 + (i % 3) * 8; // Smaller radius
                        x = center + Math.cos(angle) * radius;
                        x = Math.max(leftBoundary, Math.min(rightBoundary, x));
                      }
                      
                      // Y positioning - HIGHER so stem shows above vase rim
                      const y = 50 + (i % 4) * 18; // Raised from 15
                      const rotation = (Math.sin(i) * 12);
                      
                      const heights: Record<string, number> = {
                        rose: 130,
                        daisy: 115,
                        sunflower: 145,
                        lavender: 105,
                      };
                      const height = heights[flower.flowerType];
                      const FlowerComp = FlowerComponent[flower.flowerType];
                      
                      return (
                        <motion.button
                          key={flower.id}
                          onClick={() => navigate(`/flower/${flower.id}`)}
                          className="absolute cursor-pointer hover:z-50"
                          initial={{ scale: 0, opacity: 0, y: 30 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, type: 'spring' }}
                          whileHover={{ scale: 1.15, rotate: rotation + 5 }}
                          whileTap={{ scale: 0.95 }}
                          title={flower.name}
                          style={{
                            left: `${x}px`,
                            bottom: `${y}px`,
                            transform: `translateX(-50%) rotate(${rotation}deg)`,
                            transformOrigin: 'bottom center',
                          }}
                        >
                          <FlowerComp 
                            className="w-14" 
                            style={{ height: `${height}px` }}
                          />
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Layer 3 (FRONT) - Vase Body - z-index: 3 */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[3]">
                    <PixelVaseBody className="w-64 h-52" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p
                  className="text-[#FF69B4] mb-2"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
                >
                  {bouquet.flowers.length} {bouquet.flowers.length === 1 ? 'flower' : 'flowers'} collected
                </p>
                <p
                  className="text-[#228B22]"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
                >
                  Tap any flower to see its story
                </p>
              </div>
            </motion.div>

            {/* Flower List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h2
                className="text-[#228B22] text-center mb-6"
                style={{ fontFamily: 'VT323, monospace', fontSize: '36px' }}
              >
                FLOWERS IN THIS BOUQUET
              </h2>
              {bouquet.flowers.map((flower, index) => (
                <motion.button
                  key={flower.id}
                  onClick={() => navigate(`/flower/${flower.id}`)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="w-full bg-white/90 rounded-2xl p-5 border-3 border-[#FFB6C1] shadow-md hover:shadow-xl transition-all text-left"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">
                      {flower.flowerType === 'rose' && <FlowerComponent.rose className="w-10 h-10" />}
                      {flower.flowerType === 'sunflower' && <FlowerComponent.sunflower className="w-10 h-10" />}
                      {flower.flowerType === 'daisy' && <FlowerComponent.daisy className="w-10 h-10" />}
                      {flower.flowerType === 'lavender' && <FlowerComponent.lavender className="w-10 h-10" />}
                    </span>
                    <div className="flex-1">
                      <p
                        className="text-[#228B22] mb-1"
                        style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}
                      >
                        {flower.name}
                      </p>
                      <div className="flex items-center gap-3 text-[#FF69B4]" style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(flower.timeSpent)}
                        </span>
                        <span>•</span>
                        <span className="px-2 py-1 bg-[#FFE4E1] rounded-lg border-2 border-[#FFB6C1]">
                          {flower.category}
                        </span>
                      </div>
                    </div>
                    <ArrowLeft className="w-6 h-6 text-[#FF69B4] rotate-180" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </main>

      {/* Floating decorations */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          style={{
            top: `${15 + i * 20}%`,
            right: `${10 + i * 15}%`,
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
          ✨
        </motion.div>
      ))}
    </div>
  );
}