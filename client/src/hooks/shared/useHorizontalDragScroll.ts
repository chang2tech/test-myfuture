'use client';

import { useCallback, useRef, type MouseEvent, type PointerEvent } from 'react';

const DRAG_THRESHOLD_PX = 6;
const MOMENTUM_MULTIPLIER = 28;
const MOMENTUM_DECAY = 0.92;
const MOMENTUM_MIN_VELOCITY = 0.4;

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, label';

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));
}

export function useHorizontalDragScroll() {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const momentumFrame = useRef<number | null>(null);

  const stopMomentum = useCallback(() => {
    if (momentumFrame.current !== null) {
      cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }
  }, []);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (isInteractiveTarget(event.target)) return;

      const element = event.currentTarget;
      stopMomentum();
      isDragging.current = true;
      hasDragged.current = false;
      startX.current = event.clientX;
      scrollLeft.current = element.scrollLeft;
      lastX.current = event.clientX;
      lastTime.current = performance.now();
      velocity.current = 0;
      element.setPointerCapture(event.pointerId);
      element.classList.add('is-dragging');
    },
    [stopMomentum],
  );

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!isDragging.current) return;

    event.preventDefault();
    const element = event.currentTarget;
    const now = performance.now();
    const deltaX = event.clientX - startX.current;
    const elapsed = now - lastTime.current;

    if (Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
      hasDragged.current = true;
    }

    if (elapsed > 0) {
      velocity.current = (event.clientX - lastX.current) / elapsed;
    }

    element.scrollLeft = scrollLeft.current - deltaX;
    lastX.current = event.clientX;
    lastTime.current = now;
  }, []);

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!isDragging.current) return;

      const element = event.currentTarget;
      isDragging.current = false;
      element.classList.remove('is-dragging');

      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }

      if (!hasDragged.current) return;

      let momentum = velocity.current * MOMENTUM_MULTIPLIER;

      const step = () => {
        if (Math.abs(momentum) < MOMENTUM_MIN_VELOCITY) {
          momentumFrame.current = null;
          return;
        }

        element.scrollLeft -= momentum;
        momentum *= MOMENTUM_DECAY;
        momentumFrame.current = requestAnimationFrame(step);
      };

      momentumFrame.current = requestAnimationFrame(step);
    },
    [],
  );

  const onClickCapture = useCallback((event: MouseEvent<HTMLElement>) => {
    if (!hasDragged.current) return;

    event.preventDefault();
    event.stopPropagation();
    hasDragged.current = false;
  }, []);

  return {
    dragScrollProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
    },
    stopMomentum,
  };
}
