import { LocalizedContent } from "./LocalizedContent";
import { UlpanState } from "../constants";

export type Ulpan = {
  _id: string;
  caption?: LocalizedContent;
  ulpanName: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  ulpanState: UlpanState;
  type: string;
};