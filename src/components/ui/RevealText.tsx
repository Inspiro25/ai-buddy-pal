
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealTextProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: React.ElementType;
  threshold?: number;
  once?: boolean;
  cascade?: boolean;
  cascadeDelay?: number;
}

export function RevealText({
  children,
  delay = 0,
  duration = 800,
  className,
  as: Component = 'div',
  threshold = 0.1,
  once = true,
  cascade = false,
  cascadeDelay = 50,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else {
          if (!once) setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  if (cascade && React.isValidElement(children)) {
    // For cascading text (split into characters or words)
    const text = React.Children.toArray(children)[0] as React.ReactElement;
    const content = String(text.props.children);
    const chunks = content.split(' ');

    return (
      <Component
        ref={ref}
        className={cn(className)}
      >
        {chunks.map((word, i) => (
          <span 
            key={i} 
            className="inline-block opacity-0"
            style={{
              animation: isVisible ? `text-reveal ${duration}ms forwards` : 'none',
              animationDelay: isVisible ? `${delay + i * cascadeDelay}ms` : '0ms',
            }}
          >
            {word}{' '}
          </span>
        ))}
      </Component>
    );
  }

  return (
    <Component
      ref={ref}
      className={cn(className, 'opacity-0')}
      style={{
        animation: isVisible ? `text-reveal ${duration}ms forwards` : 'none',
        animationDelay: isVisible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </Component>
  );
}
