import { ClientComponent } from "./client";

export default async function SwipePage() {
  // Only for testing purposes.
  const defaultCards = (
    await Promise.all(
      (
        await Promise.all(
          await Promise.all([
            fetch("https://jsonplaceholder.typicode.com/photos/1", {}),
            fetch("https://jsonplaceholder.typicode.com/photos/2", {}),
            fetch("https://jsonplaceholder.typicode.com/photos/3", {}),
            fetch("https://jsonplaceholder.typicode.com/photos/4", {}),
            fetch("https://jsonplaceholder.typicode.com/photos/5", {}),
          ]),
        )
      ).map(async (response) => {
        return await response.json();
      }),
    )
  ).map((data) => {
    return {
      id: Math.random().toString(16).slice(2),
      title: data.title,
      img: data.thumbnailUrl,
      description: "card",
    };
  });

  return (
    <div className="min-h-screen grid place-items-center">
      <ClientComponent defaultCards={defaultCards} />
    </div>
  );
}
