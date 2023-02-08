import { merge } from "lodash";

export class ArrayUtil {
  
  public static shuffle<T = any>(array: T[]): T[] {
    let newArray = array;
    for (let i = newArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  public static shiftUp<T extends any = any>(array: T[], index: number): void {
    if (index < array.length && index > 0) {
      const newIndex = index - 1;
      ArrayUtil.swapTwoItemsInArray(array, index, newIndex);
    }
  }
  
  public static shiftDown<T = any>(array: T[], index: number): T[] {
    let newArray = [...array];
    if (index < array.length - 1 && index >= 0) {
      const newIndex = index + 1;
      ArrayUtil.swapTwoItemsInArray(array, index, newIndex);
    }
    return newArray;
  }
  
  public static swapTwoItemsInArray<T extends any = any>(array: T[], firstIndex: number, secondIndex: number) {
    const sourceItem: T = array[firstIndex];
    const targetItem: T = array[secondIndex];
    array[firstIndex] = targetItem;
    array[secondIndex] = sourceItem;
  }
  
  
}