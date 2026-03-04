import React from 'react';
import { motion } from 'motion/react';

// Rose - Red/Pink for high energy (bravery)
export function PixelRose({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 80" className={className} style={{ imageRendering: 'pixelated' }}>
      {/* Rose Head - layered petals */}
      <g transform="translate(0, 0)">
        {/* Outer petals - dark pink */}
        <rect x="12" y="2" width="8" height="4" fill="#FF1493" />
        <rect x="10" y="6" width="4" height="6" fill="#FF1493" />
        <rect x="18" y="6" width="4" height="6" fill="#FF1493" />
        <rect x="12" y="12" width="8" height="4" fill="#FF1493" />
        
        {/* Inner petals - bright pink */}
        <rect x="14" y="4" width="4" height="8" fill="#FF69B4" />
        <rect x="12" y="6" width="8" height="4" fill="#FF69B4" />
        
        {/* Center - dark red */}
        <rect x="14" y="7" width="4" height="4" fill="#8B0032" />
      </g>
      
      {/* Stem */}
      <rect x="15" y="16" width="2" height="64" fill="#228B22" />
      
      {/* Thorns */}
      <rect x="13" y="28" width="2" height="1" fill="#2D5A27" />
      <rect x="17" y="36" width="2" height="1" fill="#2D5A27" />
      <rect x="13" y="44" width="2" height="1" fill="#2D5A27" />
      <rect x="17" y="56" width="2" height="1" fill="#2D5A27" />
      
      {/* Leaves */}
      <path d="M 12 32 L 8 34 L 10 36 L 12 34 Z" fill="#228B22" />
      <path d="M 20 48 L 24 50 L 22 52 L 20 50 Z" fill="#228B22" />
    </svg>
  );
}

// Daisy - Yellow/White for steady energy
export function PixelDaisy({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 80" className={className} style={{ imageRendering: 'pixelated' }}>
      {/* Daisy Head */}
      <g transform="translate(0, 0)">
        {/* White petals in circle */}
        <rect x="14" y="0" width="4" height="4" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
        <rect x="8" y="4" width="4" height="4" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
        <rect x="20" y="4" width="4" height="4" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
        <rect x="6" y="8" width="4" height="4" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
        <rect x="22" y="8" width="4" height="4" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
        <rect x="8" y="12" width="4" height="4" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
        <rect x="20" y="12" width="4" height="4" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
        <rect x="14" y="14" width="4" height="4" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
        
        {/* Yellow center */}
        <circle cx="16" cy="9" r="4" fill="#FFD700" />
        <circle cx="16" cy="9" r="2.5" fill="#FFA500" />
      </g>
      
      {/* Stem */}
      <rect x="15" y="18" width="2" height="62" fill="#90EE90" />
      
      {/* Leaves */}
      <ellipse cx="10" cy="40" rx="4" ry="6" fill="#90EE90" />
      <ellipse cx="22" cy="52" rx="4" ry="6" fill="#90EE90" />
    </svg>
  );
}

// Sunflower - Big and bright for high focus
export function PixelSunflower({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 90" className={className} style={{ imageRendering: 'pixelated' }}>
      {/* Sunflower Head - larger */}
      <g transform="translate(0, 0)">
        {/* Yellow petals */}
        <rect x="16" y="0" width="8" height="4" fill="#FFD700" />
        <rect x="8" y="4" width="6" height="4" fill="#FFD700" />
        <rect x="26" y="4" width="6" height="4" fill="#FFD700" />
        <rect x="4" y="8" width="4" height="6" fill="#FFD700" />
        <rect x="32" y="8" width="4" height="6" fill="#FFD700" />
        <rect x="4" y="14" width="4" height="6" fill="#FFD700" />
        <rect x="32" y="14" width="4" height="6" fill="#FFD700" />
        <rect x="8" y="20" width="6" height="4" fill="#FFD700" />
        <rect x="26" y="20" width="6" height="4" fill="#FFD700" />
        <rect x="16" y="24" width="8" height="4" fill="#FFD700" />
        
        {/* Brown center - larger */}
        <circle cx="20" cy="14" r="8" fill="#8B4513" />
        <circle cx="20" cy="14" r="6" fill="#654321" />
        
        {/* Seeds pattern */}
        <rect x="17" y="11" width="1" height="1" fill="#3E2723" />
        <rect x="19" y="12" width="1" height="1" fill="#3E2723" />
        <rect x="21" y="13" width="1" height="1" fill="#3E2723" />
        <rect x="18" y="15" width="1" height="1" fill="#3E2723" />
        <rect x="22" y="15" width="1" height="1" fill="#3E2723" />
      </g>
      
      {/* Thick stem */}
      <rect x="18" y="28" width="4" height="62" fill="#228B22" />
      <rect x="19" y="28" width="2" height="62" fill="#2D5A27" />
      
      {/* Large leaves */}
      <ellipse cx="12" cy="45" rx="6" ry="8" fill="#228B22" />
      <ellipse cx="28" cy="58" rx="6" ry="8" fill="#228B22" />
    </svg>
  );
}

// Lavender - Purple/calming for low energy
export function PixelLavender({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 80" className={className} style={{ imageRendering: 'pixelated' }}>
      {/* Lavender flowers - cluster at top */}
      <g transform="translate(0, 0)">
        {/* Multiple small flower buds */}
        <rect x="10" y="0" width="4" height="3" fill="#9370DB" rx="1" />
        <rect x="8" y="3" width="4" height="3" fill="#8A58D0" rx="1" />
        <rect x="12" y="3" width="4" height="3" fill="#8A58D0" rx="1" />
        <rect x="10" y="6" width="4" height="3" fill="#7B3FB5" rx="1" />
        <rect x="8" y="9" width="4" height="3" fill="#9370DB" rx="1" />
        <rect x="12" y="9" width="4" height="3" fill="#9370DB" rx="1" />
        <rect x="10" y="12" width="4" height="3" fill="#8A58D0" rx="1" />
      </g>
      
      {/* Thin stem */}
      <rect x="11" y="15" width="2" height="65" fill="#6B8E6B" />
      
      {/* Small leaves along stem */}
      <rect x="8" y="32" width="3" height="1" fill="#6B8E6B" />
      <rect x="13" y="36" width="3" height="1" fill="#6B8E6B" />
      <rect x="8" y="48" width="3" height="1" fill="#6B8E6B" />
      <rect x="13" y="52" width="3" height="1" fill="#6B8E6B" />
    </svg>
  );
}

export function PixelVase({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={className} style={{ imageRendering: 'pixelated' }}>
      {/* Simple cute vase shape */}
      <path
        d="M 25 15 L 20 75 L 80 75 L 75 15 Z"
        fill="#FFB6C1"
        stroke="#FF69B4"
        strokeWidth="3"
      />
      
      {/* Vase rim */}
      <ellipse cx="50" cy="15" rx="25" ry="6" fill="#FF69B4" stroke="#FF1493" strokeWidth="3" />
      
      {/* Water level */}
      <ellipse cx="50" cy="25" rx="22" ry="5" fill="#87CEEB" fillOpacity="0.4" />
      
      {/* Decorative hearts */}
      <text x="42" y="50" fontSize="16" fill="#228B22" opacity="0.3">♥</text>
      
      {/* Shadow at bottom */}
      <ellipse cx="50" cy="74" rx="20" ry="4" fill="#FF1493" opacity="0.3" />
    </svg>
  );
}

// Split vase into layers for proper z-index control
export function PixelVaseRim({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={className} style={{ imageRendering: 'pixelated' }}>
      {/* Vase rim - top oval only */}
      <ellipse cx="50" cy="15" rx="25" ry="6" fill="#FF69B4" stroke="#FF1493" strokeWidth="3" />
    </svg>
  );
}

export function PixelVaseBody({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 80" className={className} style={{ imageRendering: 'pixelated' }}>
      {/* Vase body - trapezoid */}
      <path
        d="M 25 15 L 20 75 L 80 75 L 75 15 Z"
        fill="#FFB6C1"
        stroke="#FF69B4"
        strokeWidth="3"
      />
      
      {/* Water level */}
      <ellipse cx="50" cy="25" rx="22" ry="5" fill="#87CEEB" fillOpacity="0.4" />
      
      {/* Decorative hearts */}
      <text x="42" y="50" fontSize="16" fill="#228B22" opacity="0.3">♥</text>
      
      {/* Shadow at bottom */}
      <ellipse cx="50" cy="74" rx="20" ry="4" fill="#FF1493" opacity="0.3" />
    </svg>
  );
}

export function PixelSprout({ state = 'idle', className = '' }: { state?: 'idle' | 'working' | 'sleeping'; className?: string }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isRunningAway, setIsRunningAway] = React.useState(false);
  const [showTongue, setShowTongue] = React.useState(false);

  const handleClick = () => {
    if (isRunningAway) return; // Prevent clicking while already running
    
    setIsRunningAway(true);
    setShowTongue(true); // Show tongue while running away
  };

  return (
    <motion.div
      className="relative inline-block"
      animate={isRunningAway ? {
        x: [0, window.innerWidth - 100, 0], // Run right, then back to start
      } : {}}
      transition={{
        duration: 1.5,
        times: [0, 0.5, 1], // 50% of time going right, 50% coming back
        ease: 'easeInOut',
      }}
      onAnimationComplete={() => {
        if (isRunningAway) {
          setIsRunningAway(false);
          setShowTongue(false); // Hide tongue when animation completes
        }
      }}
    >
      <svg 
        viewBox="0 0 32 32" 
        className={className} 
        style={{ 
          imageRendering: 'crisp-edges', 
          cursor: 'pointer',
          transform: isRunningAway ? 'scaleX(-1)' : 'scaleX(1)', // Face right when running
          transition: 'transform 0.2s'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Simple cute character - round and friendly */}
        
        {/* Body - round blob with bounce animation when running */}
        <g style={{
          animation: isRunningAway ? 'sproutBounce 0.3s infinite' : 'none',
          transformOrigin: 'center center'
        }}>
          <rect x="8" y="16" width="16" height="12" fill="#90EE90" />
          <rect x="6" y="18" width="2" height="8" fill="#90EE90" />
          <rect x="24" y="18" width="2" height="8" fill="#90EE90" />
          <rect x="8" y="14" width="16" height="2" fill="#90EE90" />
          <rect x="8" y="28" width="16" height="2" fill="#90EE90" />
          
          {/* Face - big and cute */}
          <rect x="10" y="18" width="12" height="8" fill="#B8FDB8" />
          
          {/* Eyes - big round friendly eyes */}
          {state === 'sleeping' ? (
            <>
              <rect x="12" y="20" width="3" height="1" fill="#2D5A27" />
              <rect x="17" y="20" width="3" height="1" fill="#2D5A27" />
            </>
          ) : (
            <>
              {/* Big sparkly eyes */}
              <rect x="12" y="19" width="3" height="3" fill="#2D5A27" />
              <rect x="17" y="19" width="3" height="3" fill="#2D5A27" />
              <rect x="13" y="19" width="1" height="1" fill="#FFFFFF" />
              <rect x="18" y="19" width="1" height="1" fill="#FFFFFF" />
              <rect x="12" y="21" width="1" height="1" fill="#FFFFFF" opacity="0.6" />
              <rect x="17" y="21" width="1" height="1" fill="#FFFFFF" opacity="0.6" />
            </>
          )}
          
          {/* Mouth - shows tongue when hovered OR running away */}
          {state !== 'sleeping' && (
            <>
              {(isHovered || showTongue) ? (
                <>
                  {/* Open mouth with tongue sticking out */}
                  <rect x="13" y="23" width="6" height="2" fill="#2D5A27" />
                  {/* Pixel tongue - pink/red */}
                  <rect x="15" y="25" width="2" height="2" fill="#FF69B4" />
                  <rect x="15" y="27" width="2" height="1" fill="#FF1493" />
                </>
              ) : (
                <>
                  {/* Normal cute smile */}
                  <rect x="13" y="23" width="1" height="1" fill="#2D5A27" />
                  <rect x="14" y="24" width="4" height="1" fill="#2D5A27" />
                  <rect x="18" y="23" width="1" height="1" fill="#2D5A27" />
                </>
              )}
            </>
          )}
          
          {/* Cute leaf sprout on top */}
          <rect x="14" y="10" width="4" height="4" fill="#228B22" />
          <rect x="12" y="12" width="2" height="2" fill="#228B22" />
          <rect x="18" y="12" width="2" height="2" fill="#228B22" />
          <rect x="15" y="11" width="2" height="2" fill="#90EE90" />
        </g>
        
        {/* Little feet - animated alternating when running */}
        <rect 
          x="10" 
          y="30" 
          width="3" 
          height="2" 
          fill="#6B8E6B"
          style={{
            animation: isRunningAway ? 'leftFootStep 0.2s infinite' : 'none',
            transformOrigin: '11.5px 30px'
          }}
        />
        <rect 
          x="19" 
          y="30" 
          width="3" 
          height="2" 
          fill="#6B8E6B"
          style={{
            animation: isRunningAway ? 'rightFootStep 0.2s infinite' : 'none',
            transformOrigin: '20.5px 30px'
          }}
        />
        
        {/* Shovel if working */}
        {state === 'working' && (
          <g>
            {/* Shovel handle */}
            <rect x="24" y="14" width="1" height="8" fill="#8B4513" />
            {/* Shovel blade */}
            <rect x="23" y="22" width="3" height="3" fill="#A9A9A9" />
            <rect x="23" y="25" width="3" height="1" fill="#696969" />
          </g>
        )}
      </svg>
      
      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes sproutBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        @keyframes leftFootStep {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        
        @keyframes rightFootStep {
          0%, 100% {
            transform: translateY(-2px);
          }
          50% {
            transform: translateY(0);
          }
        }
      `}</style>
    </motion.div>
  );
}

export function PixelPot({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 70" className={className} style={{ imageRendering: 'pixelated' }}>
      {/* Pot body - pink terracotta */}
      <path
        d="M 18 12 L 12 65 L 78 65 L 72 12 Z"
        fill="#FFB6C1"
        stroke="#FF69B4"
        strokeWidth="3"
      />
      
      {/* Pot rim - darker pink */}
      <rect x="12" y="10" width="66" height="8" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" />
      <rect x="10" y="12" width="70" height="4" fill="#FFC0CB" />
      
      {/* Soil */}
      <ellipse cx="45" cy="18" rx="28" ry="7" fill="#8B4513" />
      <ellipse cx="45" cy="18" rx="24" ry="5" fill="#654321" />
      
      {/* Shine effect */}
      <rect x="24" y="22" width="8" height="35" fill="white" fillOpacity="0.25" rx="2" />
      
      {/* Decorative band */}
      <rect x="12" y="35" width="66" height="3" fill="#FF1493" fillOpacity="0.3" />
    </svg>
  );
}

export function PixelSeedPacket({ revealed = false, category = 'work', className = '' }: { revealed?: boolean; category?: string; className?: string }) {
  const categoryColors: Record<string, string> = {
    work: '#4A90E2',
    selfcare: '#FFB6C1',
    chores: '#B2AC88',
    creative: '#9B59B6',
    social: '#F39C12',
  };
  
  const color = categoryColors[category] || '#B2AC88';
  
  return (
    <svg viewBox="0 0 100 140" className={className} style={{ imageRendering: 'pixelated' }}>
      {/* Packet body */}
      <rect x="5" y="5" width="90" height="130" fill={revealed ? 'white' : color} fillOpacity={revealed ? 1 : 0.3} stroke="#FF69B4" strokeWidth="4" rx="8" />
      
      {/* Top seal */}
      <rect x="5" y="5" width="90" height="20" fill={color} stroke="#FF69B4" strokeWidth="4" />
      
      {revealed ? (
        <>
          {/* Open packet flap */}
          <path d="M 5 25 L 20 35 L 80 35 L 95 25" fill={color} fillOpacity="0.5" stroke="#FF69B4" strokeWidth="2" />
        </>
      ) : (
        <>
          {/* Mystery symbol */}
          <text x="50" y="90" textAnchor="middle" fontSize="48" fill="#FF69B4" fontFamily="VT323, monospace">?</text>
        </>
      )}
      
      {/* Serrated edge on top */}
      <path d="M 5 24 L 15 30 L 25 24 L 35 30 L 45 24 L 55 30 L 65 24 L 75 30 L 85 24 L 95 30" stroke="#FF69B4" strokeWidth="2" fill="none" />
    </svg>
  );
}