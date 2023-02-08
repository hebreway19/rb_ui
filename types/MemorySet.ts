import { MemoryCard } from ".";

export type MemorySet = {
  _id?: string;
  cards: MemoryCard[];
  title: string;
  readonly isActive?: boolean;
  readonly activeCards?: MemoryCard[];
  readonly isPronounceable?: boolean;
  readonly isWriteable?: boolean;
}