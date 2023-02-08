import { ArrayUtil } from "../ArrayUtil";

describe(ArrayUtil.name, () => {
  it(ArrayUtil.shuffle.name, () => {
      expect(ArrayUtil.shuffle([1, 2, 3]).length).toEqual(3);
  });
})