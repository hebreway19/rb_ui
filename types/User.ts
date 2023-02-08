import { Ulpan } from "./Ulpan";
import { HebrewProficiency, LanguageCode, StatusInCountry, UserRole, UserState } from "../constants";
import { PersonalInfo } from "./PersonalInfo";
import { AuthorizationServiceInfo } from "./AuthorizationServiceInfo";

export type User = {
  _id?: string;
  firstname: string;
  email: string;
  surname: string;
  country: string;
  passportId: string;
  phone: string;
  address: string;
  profession: string;
  birthday: string;
  repatriationDate: string;
  personalInfo: PersonalInfo[];
  photoUrl?: string;
  createdAt: number;
  expiresAt?: number;
  ulpan: Ulpan;
  state: UserState;
  role: UserRole;
  hebrewProficiency: HebrewProficiency;
  intefaceLanguage: LanguageCode;
  nativeLanguage: LanguageCode;
  statusInCountry: StatusInCountry;
  authorizationServiceInfo: AuthorizationServiceInfo[];
}