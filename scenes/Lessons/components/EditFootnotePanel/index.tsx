import React from "react";
import { FootnoteForm } from "../../../Footnotes/components";
import { HebDrawer } from "../../../../components/HebElements/HebDrawer";

export const EditFootnotePanel = ({onDone, onClose, footnoteId, defaultLang, ...props}) => {
  return (
    <HebDrawer
      width={window.innerWidth > 640 ? 640 : window.innerWidth}
      placement='right'
      destroyOnClose={true}
      closable={false}
      onClose={onClose}
      visible={true}
    >
      <FootnoteForm onDone={onDone} id={footnoteId} defaultLang={defaultLang} />
    </HebDrawer>
  );
};