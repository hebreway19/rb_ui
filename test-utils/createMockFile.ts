export function createMockFile(name: string, size, mimeType): Blob {
  const range = (count: number) => "a".repeat(count);
  let blob: any = new Blob([range(size)], { type: mimeType });
  blob.lastModifiedDate = new Date();
  blob.name = name;
  return blob;
}