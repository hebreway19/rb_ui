import React from "react";
import { FieldData } from "rc-field-form/es/interface";
import { Footnote } from "./Footnote";
import { FootnoteFormState } from "./FootnoteFormState";
import { File } from "./File";
import { FormInstance } from "antd/es";

export type FootnoteForm = {
  footnote: Footnote;
  setFootnote: React.Dispatch<React.SetStateAction<Footnote>>;
  formState: FootnoteFormState;
  setFormState: React.Dispatch<React.SetStateAction<FootnoteFormState>>;
  isValid: boolean;
  updateFromStateField(fields: string, value: any): void,
  handleFootnoteChange(changedFields: FieldData[]): void;
  changePageState(state: string): any;
  addAudioToFootnote(file: File);
  removeFromRecycleBin(): Promise<void>;
  shareFootnote(): Promise<void>;
  removeAudio(): void;
  loadFootnoteById(footnoteId: string): Promise<void>;
  form: FormInstance<any>;
  delFootnote(): Promise<void>;
  saveFootnote(): Promise<void>;
};