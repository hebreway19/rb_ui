export interface IComponentSize {
  title: string;
  name: string;
}
export class ComponentSize {
  public static SMALL: IComponentSize = {
    title: "Small",
    name: "small"
  }
  public static DEFAULT: IComponentSize = {
    title: "Default",
    name: "default"
  }
  public static LARGE: IComponentSize = {
    title: "Large",
    name: "large"
  }
}