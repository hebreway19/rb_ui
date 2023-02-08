import React, { useCallback } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { ApiEndpoint } from "../../../constants";
import { message, Upload } from "antd";
import { useAuth } from "../../hooks";
import { useTranslation } from "next-i18next";

export const DragAndDropUploadComponent = ({
                                            uploadingUrl = ApiEndpoint.FILE,
                                            name = "file",
                                            multiple = true,
                                            onDone
}) => {
  const {token} = useAuth();
  const {t} = useTranslation();
  const headers = {authorization: `Bearer ${token}`};
  const {Dragger} = Upload;

  const onChange = useCallback(info => {
    const {status} = info.file;
    if (status === "done") {
      message.success(`${info.file.name} ${t("file_uploaded_successfully")}`);
      onDone && onDone(info.file.response);
    }
    if (status === "error")
      message.error(`${info.file.name} ${t("file_upload_failed")}`);
  }, [t, onDone]);

  return (
    <Dragger action={uploadingUrl}
             multiple={multiple}
             name={name}
             headers={headers}
             onChange={onChange}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined/>
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </Dragger>
  );
}