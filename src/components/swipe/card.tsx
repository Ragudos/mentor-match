"use client";

import { cn } from "@/lib/utils";
import React, { useLayoutEffect, useMemo, useRef } from "react";
import swipingCss from "./styles.module.css";
import { useSwipe } from "./useSwipe";

export type SwipeCardProps<T> = {
  /**
   * When this swiping card gets removed,
   * this function will be called, removing
   * this card from the list of cards.
   */
  setCards: React.Dispatch<React.SetStateAction<T[]>>;
  /**
   * The index of this card in the list of cards.
   */
  index: number;
  /**
   * The total number of cards in the list of cards.
   */
  cardsLength: number;
  /**
   *  This function will be called when the card
   *  exits or gets removed
   *  from the DOM. Use the hook `useCallback`
   *  to prevent unnecessary re-renders, since this
   *  will be called inside a `useLayoutEffect`.
   *
   *  An example for this would be:
   *
   *  ```ts
   *  const onExit = useCallback((direction: -1 | 1 | 0) => {
   *    if (someCondition) {
   *        return
   *    }
   *
   *    // Say the direction would be, not match for -1 and match for 1
   *    await someServerAction(direction);
   *  }, []);
   *  ```
   */
  onExit?: (direction: -1 | 1 | 0) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "ref">;

export type NotSwipeCardProps = {
  cardsLength: number;
  index: number;
} & React.HTMLProps<HTMLDivElement>;

/**
 *  Used in conjunction with {@link SwipeCard}
 */
export function NotSwipeCard({
  cardsLength,
  index,
  className,
  style,
  children,
  ...props
}: NotSwipeCardProps) {
  const positionInArray = useMemo(() => {
    return cardsLength - index;
  }, [cardsLength, index]);
  const rotation = useMemo(() => {
    const isEven = (positionInArray & 1) === 0;
    const rotationDirection = isEven
      ? 1 * positionInArray
      : -1 * positionInArray;

    return rotationDirection * 2;
  }, [positionInArray]);

  return (
    <div
      className={cn(
        swipingCss.card,
        "border-2 inset-0 m-auto absolute bg-background text-foreground duration-200 ease-in-out w-60 h-80 p-4",
        className,
        "pointer-events-none touch-none shadow-none transition-transform",
      )}
      style={
        {
          ...style,
          "--_rotate": `${rotation}deg`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Used in conjunction with {@link NotSwipeCard}
 */
export function SwipeCard<T>({
  setCards,
  onExit,
  index,
  cardsLength,
  children,
  className,
  style,
  ...props
}: SwipeCardProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { swipeOffset, isSwiping, hasReachedThreshold } = useSwipe({ ref });
  const positionInArray = useMemo(() => {
    return cardsLength - index;
  }, [cardsLength, index]);
  const direction = useMemo(() => {
    return Math.sign(swipeOffset);
  }, [swipeOffset]);
  const rotation = useMemo(() => {
    const isEven = (positionInArray & 1) === 0;
    const rotationDirection = isEven
      ? 1 * positionInArray
      : -1 * positionInArray;
    const initialRotation = rotationDirection * 2;

    return initialRotation + swipeOffset / 10;
  }, [positionInArray, swipeOffset]);

  useLayoutEffect(() => {
    if (!hasReachedThreshold || timer.current || !ref.current) {
      return;
    }

    const card = ref.current;
    const transitionDuration = parseFloat(
      getComputedStyle(card).transitionDuration,
    );
    const transitionDurationMs = transitionDuration * 1000;

    timer.current = setTimeout(() => {
      setCards((prev) => {
        const array = [...prev];

        array.splice(index, 1);

        return array;
      });

      onExit?.(direction as -1 | 1 | 0);
    }, transitionDurationMs);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [hasReachedThreshold, setCards, onExit, index, direction]);

  return (
    <div
      ref={ref}
      data-reached-threshold={hasReachedThreshold}
      className={cn(
        swipingCss.card,
        "border-2 inset-0 m-auto absolute bg-background text-foreground duration-200 ease-in-out w-60 h-80 p-4",
        className,
        "touch-pinch-zoom transition-[transform,opacity,box-shadow]",
        { "contain-strict": isSwiping || hasReachedThreshold },
        { "duration-0": isSwiping && !hasReachedThreshold },
        { "shadow-black shadow-sm": cardsLength - 1 === index },
        { "pointer-events-none touch-none": cardsLength - 1 !== index },
      )}
      style={
        {
          ...style,
          "--_dir": direction,
          "--_x": `${swipeOffset}px`,
          "--_y": `${Math.abs(swipeOffset) / 5}px`,
          "--_rotate": `${rotation}deg`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
