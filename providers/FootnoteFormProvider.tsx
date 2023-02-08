import { Form, message } from "antd";
import { get, merge, set } from "lodash";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { RoutePath } from "../constants";
import { useFileService, useFootnoteService } from "../services";
import { ObjectUtil, StringUtil } from "../util";
import { Footnote, FootnoteForm, FootnoteFormState } from "../types";
import { useNavigator } from "./NavigatorContext";
import { FieldData } from "rc-field-form/es/interface";

const {TEACHER, FOOTNOTES, LIST} = RoutePath;

export const footnoteFormContext = createContext<FootnoteForm>({} as FootnoteForm);
export const useFootnoteForm = () => {
  return useContext(footnoteFormContext);
};

export const FootnoteFormProvider = ({children, ...props}) => {
  const router = useRouter();
  const {share} = useNavigator();
  const {footnoteId} = router.query;
  const [form] = Form.useForm();

  const footnoteService = useFootnoteService();
  const fileService = useFileService();

  const {t} = useTranslation();

  // TODO: adapt form.getFieldsError().some(({errors}) => errors.length) to validate;
  const [isValid, setValid] = useState<boolean>(false);

  const [footnote, setFootnote] = useState<Footnote>({
                                                       word: {
                                                         he: null,
                                                         he_nikkudot: null
                                                       },
                                                       audio: undefined,
                                                       wordMeaning: {
                                                         ru: null,
                                                         fr: null,
                                                         en: null
                                                       },
                                                       toRecycleBin: false
                                                     });
  const [formState, setFormState] = useState<FootnoteFormState>({
                                                                  didLoaded: false,
                                                                  isDeletingFile: false,
                                                                  deletingFileIds: [],
                                                                  isNewFootnote: !!footnoteId && footnoteId === "new",
                                                                  fastCreate: false,
                                                                  state: "",
                                                                  showWithoutNikkudot: false,
                                                                  showAllFields: false
                                                                });

  const updateFromStateField = useCallback((field, value) => setFormState(previousFormState => ({
    ...previousFormState,
    [field]: value
  })), []);

  const changePageState = useCallback((state) => () => updateFromStateField("state", state), [updateFromStateField]);
  const handleFootnoteChange = useCallback((changedFields: FieldData[]) => {
    setFootnote(previousFootnote => {
      const newFootnote = merge({}, previousFootnote);
      changedFields.forEach(({name, value}) => {
        const fieldName = Array.isArray(name) ? name[0] : name;
        set(newFootnote, fieldName, value);
      });
      return newFootnote;
    });
  }, []);

  const saveFootnote = useCallback(async () => {
    setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
    try {
      if (footnote.word.he === null) {
        footnote.word.he = StringUtil.removeNikkudots(footnote.word.he_nikkudot);
      }
      if (formState.isDeletingFile) {
        await Promise.all(formState.deletingFileIds.map(async id => fileService.deleteFileById(id)));
        setFormState(previousFootnote => {
          previousFootnote.isDeletingFile = false;
          return {...previousFootnote};
        });
      }
      const isNewFootnote: boolean = formState.isNewFootnote;
      const result: Footnote = isNewFootnote
                               ? await footnoteService.createFootnote(footnote)
                               : await footnoteService.updateFootnote(footnote._id, footnote);
      if (isNewFootnote && !formState.fastCreate) {
        const newPath = LIST(FOOTNOTES(TEACHER()));
        await router.push({pathname: newPath, query: {footnoteId: result._id}});
      }
      setFootnote(result);
      form.resetFields(ObjectUtil.getLeaves(result));
    }
    catch (error) {
      console.error(error);
      message.warning(error.message);
    }
    setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
  }, [form, formState, footnote, footnoteService, router, fileService]);

  const addAudioToFootnote = useCallback((file) => {
    handleFootnoteChange([{name: "audio", value: file._id}]);
  }, [handleFootnoteChange]);

  const removeAudio = useCallback(() => {
    setFormState(previousFormState => {
      let newDeletingFields = previousFormState.deletingFileIds || [];
      newDeletingFields.push(footnote.audio);
      previousFormState.isDeletingFile = true;
      return {...previousFormState, deletingFileIds: newDeletingFields};
    });
    setFootnote(previousFootnote => {
      previousFootnote.audio = null;
      return {...previousFootnote}
    });
  }, [footnote.audio]);

  const shareFootnote = useCallback(async () => {
      const {protocol, port, hostname} = window.location;
      const link = `${protocol}//${hostname}:${port}` + LIST(FOOTNOTES(TEACHER())) + "?footnoteId=" + footnote._id;
      await share(link);
  }, [footnote, share]);

  const delFootnote = useCallback(async () => {
    setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
    try {
      if (footnote.toRecycleBin) {
        await footnoteService.deleteById(footnote._id);
      } else {
        await footnoteService.addToRecycleBin(footnote._id);
      }
      await router.push(LIST(FOOTNOTES(TEACHER())));
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
    setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
  }, [footnote, footnoteService, router]);

  const removeFromRecycleBin = useCallback(async () => {
    setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
    try {
      await footnoteService.removeFromRecycleBin(footnoteId);
      await router.push(LIST(FOOTNOTES(TEACHER())));
    } catch (error) {
      console.error(error);
      message.warn(error.message)
    }
    setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
  }, [footnoteId, footnoteService, router]);

  const loadFootnoteById = useCallback(async (foundedFootnoteId) => {
    try {
      const loadedFootnote = await footnoteService.getFootnoteById(foundedFootnoteId);
      setFootnote(loadedFootnote);
    } catch (error) {
      console.error(error);
      message.warning(error.message);
    } finally {
      setFormState(previousFormState => ({...previousFormState, isNewFootnote: false, didLoaded: true}));
    }
    setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
  }, [footnoteService])

  useEffect(() => {
    setFormState((oldState) => ({...oldState, isNewFootnote: footnoteId === "new"}))
  }, [footnoteId]);

  useEffect(() => {
    setValid(footnote.word.he_nikkudot !== "");
  }, [footnote])

  useEffect(() => {
    setFormState(previousFormState => ({...previousFormState, didLoaded: false}));
    if (!!footnoteId && !formState.isNewFootnote) {
      loadFootnoteById(footnoteId);
    } else {
      form.resetFields();
    }
    if (!footnoteId && router.asPath !== router.route) {
      setFootnote({
                    word: {
                      he: null,
                      he_nikkudot: null
                    },
                    audio: undefined,
        wordMeaning: {
          ru: null,
          fr: null,
          en: null
        },
        toRecycleBin: false
      })
    }
    setFormState(previousFormState => ({...previousFormState, didLoaded: true}));
  }, [footnoteId, footnoteService, form, router, loadFootnoteById, formState.isNewFootnote]);

  useEffect(() => {
    if (!form.isFieldTouched(String(false))) {
      const paths = ObjectUtil.getLeaves(footnote);
      form.setFields(paths.map(path => ({
                                 name: path,
                                 value: get(footnote, path)
                               })
      ));
    }
  }, [footnote, form])

  const values = {
    footnote,
    setFootnote,
    formState,
    setFormState,
    saveFootnote,
    handleFootnoteChange,
    changePageState,
    addAudioToFootnote,
    removeFromRecycleBin,
    updateFromStateField,
    shareFootnote,
    removeAudio,
    loadFootnoteById,
    form,
    isValid,
    delFootnote
  };

  return (<footnoteFormContext.Provider value={values} {...props} >{children}</footnoteFormContext.Provider>);
};