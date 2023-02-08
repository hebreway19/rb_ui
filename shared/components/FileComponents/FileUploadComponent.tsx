import React, { useCallback, useState } from "react";
import { Col, message, Row, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { useAuth } from "../../hooks";
import { ApiEndpoint } from "../../../constants";
import { HebButton, HebTooltip } from "../../../components/HebElements";

type FileUploadComponentProps = {
  accept?: string;
  maxCountFileList?: number;
  onDone?(info: any): any;
  uploadingUrl?: string;
  name?: string;
  label?: boolean;
  onRemoveFile?(...args): any;
  isMobileFootnotesText?: boolean;
  isMobileFootnotes?: boolean;
};
export const FileUploadComponent = ({
                                      maxCountFileList = 3,
                                      uploadingUrl = ApiEndpoint.FILE,
                                      name = 'file',
                                      label = true,
                                      accept = "*",
                                      onDone,
                                      onRemoveFile,
                                      isMobileFootnotesText = true,
                                      isMobileFootnotes,
                                      ...props
                                    }: FileUploadComponentProps) => {
  const {t} = useTranslation();
  const {token} = useAuth();
  const headers = {authorization: `Bearer ${token}`};
  const [fileList, setFileList] = useState([]);

  const handleChange = useCallback(async (info) => {
    if (info.file.status === "done") {
      await message.success(t("components.ui.file_upload_component.messages.successfully"));
      onDone && onDone(info.file.response);
    }
    if (info.file.status === "error") {
      await message.error(t("components.ui.file_upload_component.messages.failed"));
    }
    setFileList(info.fileList)
  }, [onDone, setFileList]);

  const onRemove = useCallback((info) => {
    onRemoveFile && onRemoveFile(info.response);
  }, [onRemoveFile]);

  if (isMobileFootnotes) {
    return (
      <Upload action={uploadingUrl} onChange={handleChange} onRemove={onRemove} accept={accept} headers={headers} fileList={fileList} name={name}
              {...props} >
        {
          fileList.length < 2 && (
            <Row style={{width: "100%"}} className={"footnote-upload"}>
              <Col xs={24} style={{textAlign: "center", cursor: "pointer"}}>
                <svg width="1em" height="1em" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.45722 6.15984H12.1247V19.3682C12.1247 19.54 12.2547 19.6805 12.4135 19.6805H14.5793C14.7381 19.6805 14.868 19.54 14.868 19.3682V6.15984H17.5428C17.7846 6.15984 17.9182 5.85921 17.7702 5.65618L13.7274 0.119843C13.7004 0.0825107 13.6659 0.0523185 13.6265 0.0315547C13.5871 0.0107909 13.5438 0 13.5 0C13.4562 0 13.4129 0.0107909 13.3735 0.0315547C13.3341 0.0523185 13.2996 0.0825107 13.2726 0.119843L9.22981 5.65228C9.08182 5.85921 9.21537 6.15984 9.45722 6.15984ZM26.7112 18.1969H24.5455C24.3866 18.1969 24.2567 18.3374 24.2567 18.5092V24.5219H2.74332V18.5092C2.74332 18.3374 2.61337 18.1969 2.45455 18.1969H0.28877C0.129947 18.1969 0 18.3374 0 18.5092V26.2398C0 26.9309 0.516176 27.4892 1.15508 27.4892H25.8449C26.4838 27.4892 27 26.9309 27 26.2398V18.5092C27 18.3374 26.8701 18.1969 26.7112 18.1969Z"
                    fill="#3C3C3E"/>
                </svg>
              </Col>
              { isMobileFootnotesText &&
                <Col xs={24} style={{textAlign: "center"}} className="list-item-button-label">
                  {t("components.ui.file_upload_component.click")}
                </Col>
              }
            </Row>
          )
        }
      </Upload>
    )
  }

  return (
    <Upload action={uploadingUrl} onChange={handleChange} onRemove={onRemove} className="heb-file-upload" accept={accept} headers={headers} fileList={fileList} name={name} {...props}>
      {fileList.length < maxCountFileList
       && <HebTooltip placement="top" title={t("components.ui.file_upload_component.tooltip.click")}>
         <HebButton icon={<UploadOutlined/>} indicatorLine={false} block overText={false} buttonSize="over-small">
           {label && t("components.ui.file_upload_component.click")}
         </HebButton>
       </HebTooltip>
      }
    </Upload>
  );
}