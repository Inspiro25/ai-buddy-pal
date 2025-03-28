
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  intensity?: 'subtle' | 'medium' | 'strong';
  colors?: string[];
  fromDirection?: 'top' | 'left' | 'top-left' | 'top-right';
  speed?: 'slow' | 'medium' | 'fast';
}

export function AnimatedGradient({
  children,
  className,
  intensity = 'medium',
  colors = ['from-blue-500/20', 'via-purple-400/20', 'to-cyan-300/20'],
  fromDirection = 'top',
  speed = 'medium',
  ...props
}: AnimatedGradientProps) {
  // Configure intensity
  const intensityClasses = {
    subtle: 'opacity-20',
    medium: 'opacity-35',
    strong: 'opacity-50',
  };

  // Configure direction
  const directionClasses = {
    top: 'bg-gradient-to-b',
    left: 'bg-gradient-to-r',
    'top-left': 'bg-gradient-to-br',
    'top-right': 'bg-gradient-to-bl',
  };

  // Configure animation speed
  const speedClasses = {
    slow: '[animation-duration:15s]',
    medium: '[animation-duration:10s]',
    fast: '[animation-duration:5s]',
  };

  return (
    <div className="relative overflow-hidden" {...props}>
      <div
        className={cn(
          'absolute inset-0 -z-10 transform-gpu animate-gradient-move bg-repeat',
          directionClasses[fromDirection],
          intensityClasses[intensity],
          speedClasses[speed],
          colors.join(' '),
          className
        )}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
