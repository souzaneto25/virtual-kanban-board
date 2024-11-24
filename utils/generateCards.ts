import { Task } from "@/types";

// Function to generate a large number of cards
export function generateCards(count: number, columnName: string): Task[] {
  const cards: Task[] = [];

  for (let i = 1; i <= count; i++) {
    cards.push({
      id: `${columnName}-task-${i}`,
      title: `Task ${i}`,
    });
  }

  return cards;
}
