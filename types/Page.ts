export type Page<T> = {
  totalDocs: number,
  totalPages: number,
  page: number,
  docs: T[]
};