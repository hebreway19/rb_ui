import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { message } from "antd";
import ReactDOM from "react-dom";
import dynamic from "next/dynamic";

import {
  AddAudioPanel, AddFootnotePanel, AddImagePanel, ContentAudio, ContentFootnote, ContentImage, EditFootnotePanel, TextTaskContentItemPreview
} from "../index";
import { ContentState } from "../../constants";
import { Case, Switch } from "../../../../shared/components";
import { FootnoteFormProvider, useLessonForm } from "../../../../providers";
import { TextContent } from "../../../../types";

const Editor = dynamic(() => import("../../../../components/Editor"), {ssr: false});

type TextTaskContentAreaProps = React.HTMLProps<HTMLElement> & {
  onContentChanged(string): void;
  textTaskContent: TextContent;
}

export const TextTaskContentArea = ({onContentChanged, textTaskContent}: TextTaskContentAreaProps) => {
  const {lesson} = useLessonForm();
  const [contentState, setContentState] = useState(ContentState.EDIT);
  const [word, setWord] = useState("");
  const [footnoteId, setFootnoteId] = useState("");
  const {t} = useTranslation();


  const editorRef = useRef<any>({});

  const selectWordMessage = t("messages.select_word");

  const catchSelectedWord = useCallback(() => {
    if (editorRef.current) {
      try {
        const editor = editorRef.current;
        //TODO add cke types
        const selection: any = editor["model"]["document"]["selection"];
        const range = selection.getFirstRange();
        const dataContent = [];
        for (const item of range.getItems()) {
          dataContent.push(item.data);
        }
        const newWord = dataContent.join(" ").trim();
        if (newWord?.length === 0) {
          message.warn(selectWordMessage);
        }
        setWord(newWord);
      }
      catch (error) {
        setWord("");
        console.error(error);
      }
    }
  }, [editorRef, selectWordMessage]);

  const contentStateChangeFactory = useCallback((newContentState) => (event?) => setContentState(newContentState), []);
  const changeStateToAddImage = contentStateChangeFactory(ContentState.ADD_IMAGE);
  const changeStateToAddAudio = contentStateChangeFactory(ContentState.ADD_AUDIO);
  const changeStateToAddFootnote = contentStateChangeFactory(ContentState.ADD_FOOTNOTE);
  const changeStateToEdit = contentStateChangeFactory(ContentState.EDIT);
  const changeStateToEditFootnote = contentStateChangeFactory(ContentState.EDIT_FOOTNOTE);

  const addContentCallbackFactory = useCallback((command) => (content) => {
    try {
      if (editorRef.current) {
        editorRef.current.execute(command, {id: content._id, word});
      }
      changeStateToEdit();
    }
    catch (error) {
      console.error(error);
    }
  }, [changeStateToEdit, editorRef, word]);

  const addImageTitle = t("entities.image");
  const addAudioTitle = t("entities.audio");
  const addFootnoteTitle = t("entities.footnote");

  const handleEditorDataChange = useCallback((event, editor) => {
    try {
      const data = editor.getData();
      onContentChanged(data);
    } catch (error) {
      console.error(error);
    }
  }, [onContentChanged]);

  const editorConfig = {
    toolbar: [
      "undo", "redo", "insertContentImage", "insertContentAudio", "insertContentFootnote"
    ],
    language: "he",
    insertContentImage: {
      buttonView: {
        label: addImageTitle,
        withText: true,
        tooltip: true,
        isToggleable: true
      },
      onClick: changeStateToAddImage
    },
    insertContentAudio: {
      buttonView: {
        label: addAudioTitle,
        withText: true,
        tooltip: true,
        isToggleable: true
      },
      onClick: changeStateToAddAudio
    },
    insertContentFootnote: {
      buttonView: {
        label: addFootnoteTitle,
        withText: true,
        tooltip: true,
        isToggleable: true
      },
      onClick: () => {
        catchSelectedWord();
        changeStateToAddFootnote();
      }
    },
    contentImages: {
      renderer: ({id}, domElement) => {
        ReactDOM.render(
          <ContentImage dataId={id}/>,
          domElement
        );
      }
    },
    contentAudios: {
      renderer: ({id}, domElement) => {
        ReactDOM.render(
          <ContentAudio dataId={id}/>,
          domElement
        );
      }
    },
    contentFootnotes: {
      renderer: ({id, word, remove}, domElement) => {
        const wrapper = (
            <ContentFootnote dataId={id}
                             onDelete={remove}
                             onClick={(event) => {
                               setFootnoteId(id);
                               changeStateToEditFootnote(event);
                             }}
                             language={String(lesson.studentsNativeLanguage)}
                             word={word}/>
        );
        ReactDOM.render(wrapper, domElement);
      }
    }
  };
  const handleEditorReady = useCallback((editor) => {
    if (editor) {
      editorRef.current = editor;
      onContentChanged(editor.getData());
    }
  }, [onContentChanged]);

  const editor = (
    process.browser && <Editor data={textTaskContent.he_nikkudot || ""}
                               value={textTaskContent.he_nikkudot || ""}
                               config={editorConfig}
                               onChange={handleEditorDataChange}
                               onReady={handleEditorReady}/>
  );
  return (
    <div>
      <div style={{
        fontSize: "1.5rem"
      }}>
        {editor}
      </div>
      <Switch parameter={contentState}>
        <Case value={ContentState.ADD_IMAGE}>
          <AddImagePanel onDone={addContentCallbackFactory("insertImage")} onClose={changeStateToEdit}/>
        </Case>
        <Case value={ContentState.ADD_AUDIO}>
          <AddAudioPanel onDone={addContentCallbackFactory("insertAudio")} onClose={changeStateToEdit}>
            <div className="add-audio-container">
              <TextTaskContentItemPreview taskContent={textTaskContent}/>
            </div>
          </AddAudioPanel>
        </Case>
        <Case value={ContentState.EDIT_FOOTNOTE}>
          <div>
            <FootnoteFormProvider>
              <EditFootnotePanel onDone={changeStateToEdit} onClose={changeStateToEdit} defaultLang={lesson?.studentsNativeLanguage} footnoteId={footnoteId}/>
            </FootnoteFormProvider>
          </div>
        </Case>
        <Case value={ContentState.ADD_FOOTNOTE}>
          <div>
            <FootnoteFormProvider>
              <AddFootnotePanel word={word} defaultLang={lesson?.studentsNativeLanguage} onDone={addContentCallbackFactory("insertFootnote")} contentState={contentState}
                                onCloseEvent={() => setContentState(ContentState.EDIT)}/>
            </FootnoteFormProvider>
          </div>
        </Case>
      </Switch>
    </div>
  );
};