"use client";

import { NotSwipeCard, SwipeCard } from "@/components/swipe/card";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Card = {
  id: string;
  title: string;
  img: string;
  description: string;
};

type Props = {
  defaultCards: Card[];
};

export function ClientComponent({ defaultCards }: Props) {
  const [cards, setCards] = useState(defaultCards);
  const isFetching = useRef(false);

  // Only for testing purposes.
  useEffect(() => {
    if (isFetching.current || cards.length > 5) {
      return;
    }

    Promise.all([
      fetch("https://jsonplaceholder.typicode.com/photos/1", {}),
      fetch("https://jsonplaceholder.typicode.com/photos/2", {}),
      fetch("https://jsonplaceholder.typicode.com/photos/3", {}),
    ])
      .then(async (responses) => {
        const data = await Promise.all(
          responses.map(async (response) => {
            return await response.json();
          }),
        );

        setCards((prev) => {
          return [
            ...data.map((data) => {
              return {
                id: Math.random().toString(16).slice(2),
                title: data.title,
                img: data.thumbnailUrl,
                description: "card",
              };
            }),
            ...prev,
          ];
        });
      })
      .catch((reason) => {
        console.error(reason);
      })
      .finally(() => {
        isFetching.current = false;
      });

    isFetching.current = true;
  }, [cards]);

  const onExit = useCallback((direction: -1 | 1 | 0) => {
    console.log(direction);
  }, []);

  return (
    <div className="relative w-full">
      {cards.map((card, idx) => {
        if (idx >= cards.length - 2) {
          return (
            <SwipeCard
              key={card.id}
              cardsLength={cards.length}
              index={idx}
              setCards={setCards}
              onExit={onExit}
            >
              <Image
                src={card.img}
                alt=" "
                width="48"
                height="48"
                className="rounded-full object-cover mx-auto mb-10"
                fetchPriority="high"
              />
              <div className="text-2xl font-semibold">{card.title}</div>
              <p>{card.description}</p>
            </SwipeCard>
          );
        } else {
          return (
            <NotSwipeCard key={card.id} cardsLength={cards.length} index={idx}>
              <Image
                src={card.img}
                alt=" "
                width="48"
                height="48"
                className="rounded-full object-cover mx-auto mb-10"
                fetchPriority="high"
              />
              <div className="text-2xl font-semibold">{card.title}</div>
              <p>{card.description}</p>
            </NotSwipeCard>
          );
        }
      })}
    </div>
  );
}
