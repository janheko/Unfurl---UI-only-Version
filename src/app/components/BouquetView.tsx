import React from 'react';
import { motion } from 'motion/react';
import { CompletedTask } from '../types';
import { PixelRose, PixelDaisy, PixelSunflower, PixelLavender, PixelVaseRim, PixelVaseBody } from './PixelArt';

interface BouquetViewProps {
  completedTasks: CompletedTask[];
}

const FlowerComponent: Record<string, React.ComponentType<{ className?: string; style?: any }>> = {
  rose: PixelRose,
  daisy: PixelDaisy,
  sunflower: PixelSunflower,
  lavender: PixelLavender,
};

export function BouquetView({ completedTasks }: BouquetViewProps) {
  return (
    <div className="relative h-[400px] flex items-end justify-center px-4">
      {/* Cozy shelf - sage green */}
      <div className="absolute bottom-0 w-full max-w-2xl h-6 bg-gradient-to-b from-[#9CAF88] to-[#8A9D78] rounded-lg border-4 border-[#7A8A6E]">
        <div className="h-1 bg-[#7A8A6E] mt-1" />
      </div>

      {/* Container for vase and flowers */}
      <div className="absolute bottom-6">
        {/* Layer 1 (BACK) - Vase Rim/Top Oval - z-index: 1 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[1]">
          <PixelVaseRim className="w-48 h-40" />
        </div>

        {/* Layer 2 (MIDDLE) - Flowers - z-index: 2 */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[2]"
          style={{
            width: '192px',
            height: '300px',
            position: 'relative',
          }}
        >
          {completedTasks.length === 0 ? (
            <div className="absolute inset-0 flex items-start justify-center pt-2 z-20">
              <div className="relative">
                <p
                  className="text-[#9CAF88] px-4 py-2 bg-white/80 rounded-xl border-3 border-[#E8A5A5] text-center relative"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}
                >
                  Complete tasks to grow your bouquet...
                  
                  {/* Triangle pointer - border outline */}
                  <span
                    className="absolute"
                    style={{
                      content: '""',
                      bottom: '-15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '0',
                      height: '0',
                      borderLeft: '12px solid transparent',
                      borderRight: '12px solid transparent',
                      borderTop: '15px solid #E8A5A5',
                    }}
                  />
                  
                  {/* Triangle pointer - inner fill */}
                  <span
                    className="absolute"
                    style={{
                      content: '""',
                      bottom: '-11px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '0',
                      height: '0',
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderTop: '12px solid rgba(255, 255, 255, 0.8)',
                    }}
                  />
                </p>
              </div>
            </div>
          ) : (
            completedTasks.map((task, index) => {
              // TIGHTER boundaries to keep ALL flowers inside vase
              const containerWidth = 192;
              const center = containerWidth / 2; // 96px
              
              // Much tighter boundaries - account for flower width (~44px for w-11)
              const leftBoundary = center - 30; // 66px (tighter!)
              const rightBoundary = center + 30; // 126px (tighter!)
              
              let x: number;
              
              if (index === 0) {
                // Flower 1: LEFT side
                x = leftBoundary;
              } else if (index === 1) {
                // Flower 2: RIGHT side
                x = rightBoundary;
              } else if (index === 2) {
                // Flower 3: CENTER
                x = center;
              } else {
                // Flowers 4+: Fill gaps with smaller radius
                const angle = (index * 137.5) * (Math.PI / 180);
                const radius = 10 + (index % 3) * 6; // Smaller radius
                x = center + Math.cos(angle) * radius;
                x = Math.max(leftBoundary, Math.min(rightBoundary, x));
              }
              
              // Y positioning - HIGHER so stem shows above vase rim
              const y = 40 + (index % 4) * 15; // Raised from 10
              const rotation = (Math.sin(index) * 12);
              
              const heights: Record<string, number> = {
                rose: 90,
                daisy: 80,
                sunflower: 105,
                lavender: 75,
              };
              const height = heights[task.flowerType];
              const FlowerComp = FlowerComponent[task.flowerType];
              
              return (
                <motion.div
                  key={`${task.id}-${index}`}
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.08, 
                    type: 'spring',
                    stiffness: 120,
                    damping: 12
                  }}
                  className="absolute"
                  style={{
                    left: `${x}px`,
                    bottom: `${y}px`,
                    transform: `translateX(-50%) rotate(${rotation}deg)`,
                    transformOrigin: 'bottom center',
                  }}
                >
                  <motion.div
                    animate={{
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 2 + (index % 3) * 0.3,
                      repeat: Infinity,
                      delay: index * 0.15,
                      ease: 'easeInOut'
                    }}
                  >
                    <FlowerComp 
                      className="w-11" 
                      style={{ height: `${height}px` }}
                    />
                  </motion.div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Layer 3 (FRONT) - Vase Body - z-index: 3 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[3]">
          <PixelVaseBody className="w-48 h-40" />
        </div>
      </div>

      {/* Stats Card - cozy colors */}
      {completedTasks.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-16 right-4 bg-white border-4 border-[#9CAF88] rounded-3xl p-6 shadow-xl"
        >
          <p
            className="text-[#9CAF88] text-sm mb-4"
            style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}
          >
            YOUR GARDEN
          </p>
          <div className="space-y-2" style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌸</span>
              <span className="text-[#7A8A6E]">{completedTasks.length} Bloomed</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏱️</span>
              <span className="text-[#7A8A6E]">
                {Math.floor(completedTasks.reduce((sum, t) => sum + t.timeSpent, 0) / 60)} mins
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌹</span>
              <span className="text-[#E8A5A5]">
                {completedTasks.filter(t => t.flowerType === 'rose').length} Roses
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌻</span>
              <span className="text-[#FFD700]">
                {completedTasks.filter(t => t.flowerType === 'sunflower').length} Sunflowers
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}