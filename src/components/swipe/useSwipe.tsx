"use client";

import React, { useCallback, useEffect, useState } from "react";

type UseSwipeProps<T extends HTMLElement> = {
  /**
   * The ref of the element that this hook
   * will attach listeners to
   */
  ref: React.MutableRefObject<T | null>;
  /**
   * The threshold in pixels that the user
   * must swipe before the card gets dismissed
   */
  threshold?: number;
  /**
   * The difference between when the user started
   * swiping until they let go of the card to consider
   * removing the card.
   */
  velocityThreshold?: number;
};

export function useSwipe<T extends HTMLElement>({
  ref,
  threshold = 100,
  velocityThreshold = 0.1,
}: UseSwipeProps<T>) {
  const [isSwiping, setIsSwiping] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [originalPosition, setOriginalPosition] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);

  const handlePointerDown = useCallback(
    (evt: PointerEvent) => {
      if (hasReachedThreshold || !ref.current) {
        return;
      }

      // @ts-expect-error No types for setPointerCapture
      evt.target.setPointerCapture(evt.pointerId);

      setIsSwiping(true);
      setOriginalPosition(evt.clientX);
      setDragStartTime(Date.now());
    },
    [ref, hasReachedThreshold],
  );

  const handlePointerMove = useCallback(
    (evt: PointerEvent) => {
      if (!isSwiping || !ref.current) {
        return;
      }

      setSwipeOffset(evt.clientX - originalPosition);
    },
    [ref, isSwiping, originalPosition],
  );

  const handlePointerUp = useCallback(
    (_evt: PointerEvent) => {
      if (!isSwiping || !ref.current) {
        return;
      }

      const absSwipeOffset = Math.abs(swipeOffset);
      const timeTaken = Date.now() - dragStartTime;
      const velocity = absSwipeOffset / timeTaken;

      setIsSwiping(false);
      setOriginalPosition(0);
      setDragStartTime(0);

      if (absSwipeOffset >= threshold || velocity > velocityThreshold) {
        setHasReachedThreshold(true);

        return;
      }

      setSwipeOffset(0);
    },
    [isSwiping, ref, swipeOffset, dragStartTime, threshold, velocityThreshold],
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const card = ref.current;

    card.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      card.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [ref, handlePointerDown, handlePointerMove, handlePointerUp]);

  return {
    swipeOffset,
    isSwiping,
    hasReachedThreshold,
  };
}
