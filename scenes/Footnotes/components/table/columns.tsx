import React from "react";
import { ColumnType } from "antd/es/table";

import { FileUploadComponent, SimpleAudioComponent } from "../../../../shared/components";
import { Tooltip, Typography } from "antd";
import { useWordMeaningTranslate } from "../../../../shared/hooks";
import { HebrewParagraphWithTitle } from "../../../../shared/components/HebrewParagraphWithTitle";
import { Footnote } from "../../../../types";

export const FootnoteTableColumns = ({
                                       t,
                                       updateFileField,
                                       isMobile = false
                                     }): ColumnType<any>[] => {
  const titleWord = "pages.footnote_list.table.title.word";
  const translationOption = "pages.footnote_list.table.title.translation_option";

  const {translate} = useWordMeaningTranslate();
  const {Paragraph} = Typography;

  const getIdAndFilename = (id) => (filename) => {
    updateFileField(id, filename._id);
  };

  if (isMobile) {
    return [
      {
        title: t(titleWord),
        dataIndex: "word",
        key: "word",
        width: "calc(100vw - 9.0625rem)",
        align: "right",
        render: (text, record, index) =>  <Tooltip  title={record?.word?.he}
                                                    placement="top" >
          <Paragraph  ellipsis
                      style={{marginBottom: 0, maxWidth: "calc(100vw - 9.0625rem)"}} >
            <HebrewParagraphWithTitle content={record?.word?.he_nikkudot} />
          </Paragraph>
        </Tooltip>
      }
    ]
  }

  return [
    {
      title: t(titleWord),
      dataIndex: "word",
      key: "word",
      width: "20%",
      align: "right",
      render: (text, record, index) => <Tooltip  title={record?.word?.he}
                                                         placement="top" >
                                                 <Paragraph  ellipsis
                                                             style={{marginBottom: 0, maxWidth: "20vw"}} >
                                                   <HebrewParagraphWithTitle content={record?.word?.he_nikkudot} />
                                                 </Paragraph>
                                               </Tooltip>
    },
    {
      title: t(translationOption),
      dataIndex: "wordMeaning",
      width: "auto",
      ellipsis: true,
      key: "wordMeaning",
      render: (text, record, index) => record.wordMeaning[translate]
                                       ? <Tooltip
                                         title={
                                           <Paragraph
                                             ellipsis={{rows: 20}}
                                             style={{margin: 0}}
                                           >
                                             {record.wordMeaning[translate]}
                                           </Paragraph>
                                         }
                                         placement="bottom"
                                       >
                                         <Paragraph ellipsis={{rows: 1}}
                                                    style={{width: "auto"}}>
                                           {record.wordMeaning[translate]}
                                         </Paragraph>
                                       </Tooltip>
                                       : "-"
    },
    {
      title: t("pages.footnote_list.table.title.audio"),
      dataIndex: "audio",
      key: "audio",
      align: "center",
      width: "4.75rem",
      render: (text, record: Footnote, index) => record?.audio
                                                 ? <SimpleAudioComponent dataId={record?.audio}/>
                                                 : <FileUploadComponent
                                                   isMobileFootnotes={true}
                                                   isMobileFootnotesText={false}
                                                   accept="audio/*"
                                                   maxCountFileList={1}
                                                   label={false}
                                                   onDone={getIdAndFilename(record?._id)}
                                                 />
    }
  ];
};