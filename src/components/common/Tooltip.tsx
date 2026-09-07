import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

interface Position {
  top: number;
  left: number;
  actualSide: 'top' | 'bottom' | 'left' | 'right';
  arrowOffset: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;

    // Use measured dimensions or reasonable fallback
    const tooltipWidth = tooltipEl?.offsetWidth || 140;
    const tooltipHeight = tooltipEl?.offsetHeight || 30;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let targetSide = side;

    // Automatic vertical collision detection & flip
    if (targetSide === 'top' && triggerRect.top - tooltipHeight - 10 < 0) {
      targetSide = 'bottom';
    } else if (targetSide === 'bottom' && triggerRect.bottom + tooltipHeight + 10 > viewportHeight) {
      targetSide = 'top';
    }

    // Automatic horizontal collision detection & flip
    if (targetSide === 'left' && triggerRect.left - tooltipWidth - 10 < 0) {
      targetSide = 'right';
    } else if (targetSide === 'right' && triggerRect.right + tooltipWidth + 10 > viewportWidth) {
      targetSide = 'left';
    }

    let top = 0;
    let left = 0;

    if (targetSide === 'top') {
      top = triggerRect.top - tooltipHeight - 7;
      left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
    } else if (targetSide === 'bottom') {
      top = triggerRect.bottom + 7;
      left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
    } else if (targetSide === 'left') {
      top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
      left = triggerRect.left - tooltipWidth - 7;
    } else {
      top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
      left = triggerRect.right + 7;
    }

    // Clamp inside viewport horizontally (with 8px safe margin)
    const clampedLeft = Math.max(8, Math.min(viewportWidth - tooltipWidth - 8, left));
    // Clamp inside viewport vertically (with 8px safe margin)
    const clampedTop = Math.max(8, Math.min(viewportHeight - tooltipHeight - 8, top));

    // Calculate arrow offset pointing directly to the center of the trigger
    let arrowOffset = 0;
    if (targetSide === 'top' || targetSide === 'bottom') {
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      arrowOffset = Math.max(10, Math.min(tooltipWidth - 10, triggerCenterX - clampedLeft));
    } else {
      const triggerCenterY = triggerRect.top + triggerRect.height / 2;
      arrowOffset = Math.max(8, Math.min(tooltipHeight - 8, triggerCenterY - clampedTop));
    }

    setPosition({
      top: clampedTop,
      left: clampedLeft,
      actualSide: targetSide,
      arrowOffset,
    });
  }, [side]);

  const show = () => {
    // Only show on pointer hover capable devices to prevent sticky hover on touch
    if (typeof window !== 'undefined' && window.matchMedia && !window.matchMedia('(hover: hover)').matches) {
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
    setPosition(null);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      // Re-calculate after render in case dimensions changed
      const raf = requestAnimationFrame(calculatePosition);

      const handleScrollOrResize = () => {
        calculatePosition();
      };

      window.addEventListener('resize', handleScrollOrResize, { passive: true });
      window.addEventListener('scroll', handleScrollOrResize, { passive: true });

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize);
      };
    }
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Clone child with event listeners
  const child = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e);
      show();
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e);
      hide();
    },
  });

  return (
    <div ref={triggerRef} className={`relative inline-flex ${className}`}>
      {child}
      {isVisible &&
        content &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: 'fixed',
              top: position ? `${position.top}px` : '-9999px',
              left: position ? `${position.left}px` : '-9999px',
              opacity: position ? 1 : 0,
            }}
            className="pointer-events-none z-[9999] whitespace-nowrap rounded-lg border border-slate-700/80 dark:border-white/15 bg-slate-900/95 dark:bg-[#0c1226]/95 px-2.5 py-1.5 text-[11px] font-medium text-slate-100 shadow-xl backdrop-blur-md transition-all duration-150 animate-in fade-in-0 zoom-in-95 leading-tight select-none"
          >
            {content}

            {/* Subtle Directional Arrow/Caret */}
            {position && (
              <span
                style={{
                  position: 'absolute',
                  ...(position.actualSide === 'top'
                    ? {
                        bottom: '-4px',
                        left: `${position.arrowOffset}px`,
                        transform: 'translateX(-50%) rotate(45deg)',
                      }
                    : position.actualSide === 'bottom'
                    ? {
                        top: '-4px',
                        left: `${position.arrowOffset}px`,
                        transform: 'translateX(-50%) rotate(45deg)',
                      }
                    : position.actualSide === 'left'
                    ? {
                        right: '-4px',
                        top: `${position.arrowOffset}px`,
                        transform: 'translateY(-50%) rotate(45deg)',
                      }
                    : {
                        left: '-4px',
                        top: `${position.arrowOffset}px`,
                        transform: 'translateY(-50%) rotate(45deg)',
                      }),
                }}
                className="h-2 w-2 border border-slate-700/80 dark:border-white/15 bg-slate-900/95 dark:bg-[#0c1226]/95"
              />
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
