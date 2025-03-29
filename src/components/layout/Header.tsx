
import { useState, useEffect, useRef } from 'react';
import { PanelLeft, Sparkles, Zap, Stars, Brain, Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const [randomColor, setRandomColor] = useState(0);
  const [showParticles, setShowParticles] = useState(true);
  const controls = useAnimation();
  const logoRef = useRef<HTMLDivElement>(null);
  
  // Cycle through colors for the animated background
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomColor((prev) => (prev + 1) % 5);
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 1 }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [controls]);

  const colors = [
    'from-purple-600 via-pink-500 to-blue-500',
    'from-blue-500 via-purple-600 to-pink-500',
    'from-pink-500 via-blue-500 to-purple-600',
    'from-violet-600 via-indigo-500 to-purple-500',
    'from-fuchsia-500 via-purple-600 to-indigo-500',
  ];
  
  return (
    <header className="sticky top-0 z-50 overflow-hidden border-b border-purple-500/20 h-16 flex items-center px-4">
      {/* Cosmic background with stars */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-r ${colors[randomColor]} opacity-20`}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Animated stars/particles */}
        {showParticles && (
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                initial={{ 
                  x: `${Math.random() * 100}%`, 
                  y: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3,
                  scale: Math.random() * 0.5 + 0.1,
                }}
                animate={{ 
                  opacity: [
                    Math.random() * 0.5 + 0.3,
                    Math.random() * 0.8 + 0.5,
                    Math.random() * 0.5 + 0.3
                  ],
                  scale: [
                    Math.random() * 0.5 + 0.1,
                    Math.random() * 0.7 + 0.3,
                    Math.random() * 0.5 + 0.1
                  ]
                }}
                transition={{ 
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                }}
              />
            ))}
          </div>
        )}
        
        <div className="absolute inset-0 backdrop-blur-md bg-purple-950/70" />
      </div>
      
      {isMobile && (
        <motion.div
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.8, rotate: -10 }}
          className="relative z-10"
        >
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMenuClick}
            className="relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-purple-500/30 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 2, opacity: 0.5 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <PanelLeft className="h-5 w-5 relative z-10 text-purple-200" />
            </motion.div>
          </Button>
        </motion.div>
      )}
      
      {/* Simplified Logo container - now properly centered */}
      <motion.div 
        ref={logoRef}
        className="flex items-center gap-2 mx-auto"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
      >
        {/* Playful text logo only */}
        <motion.div className="relative">
          <motion.h1 
            className="text-xl md:text-2xl font-bold relative"
          >
            {/* Animated colorful letters without bouncing */}
            {"VYOMA AI".split('').map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                style={{
                  color: i % 2 === 0 ? '#5eead4' : '#67e8f9',
                  textShadow: '0 0 8px rgba(20, 184, 166, 0.6)'
                }}
                animate={{ 
                  color: [
                    i % 2 === 0 ? '#5eead4' : '#67e8f9',
                    i % 2 === 0 ? '#2dd4bf' : '#22d3ee',
                    i % 2 === 0 ? '#5eead4' : '#67e8f9'
                  ]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
            
            {/* Single sparkle effect */}
            <motion.span 
              className="absolute text-cyan-300 text-xs"
              style={{
                top: `-5px`,
                right: `-10px`,
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              ✨
            </motion.span>
          </motion.h1>
        </motion.div>
      </motion.div>
      
      {/* Empty div to balance the layout when menu button is present */}
      {isMobile && <div className="w-10" />}
    </header>
  );
}
