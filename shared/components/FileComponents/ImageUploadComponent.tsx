import React, { useEffect, useState } from "react";
import { message, Popover, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ApiEndpoint } from "../../../constants";
import { useTranslation } from "next-i18next";
import { useAuth } from "../../hooks";
import { HebModal } from "../../../components/HebElements/HebModal";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

type ImageUploadComponentProps = {
  maxCountFileList?: number;
  uploadingUrl?: string;
  name?: string;
  defaultImageIdList?: string[];
  onDone?(...args): any;
  onRemove?(...args): any;
  autoRemoveFileList?: boolean;
  style?: React.CSSProperties;
};

export const ImageUploadComponent = ({
                                       maxCountFileList = 3,
                                       uploadingUrl = ApiEndpoint.FILE,
                                       name = "file",
                                       defaultImageIdList = [],
                                       onDone,
                                       onRemove,
                                       autoRemoveFileList = false,
                                       style = {}
                                     }: ImageUploadComponentProps) => {

  const {token} = useAuth();

  const headers = {authorization: `Bearer ${token}`};


  const {t} = useTranslation();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const handleCancel = () => setPreviewVisible(false);

  useEffect(() => {
    defaultImageIdList.length > 0 &&
    setFileList(() => {
      let newFileList = [];
      defaultImageIdList.forEach((id, index) => {
        newFileList.push({
          uid: `-${index + 1}`,
          name: id,
          status: "done",
          url: `${ApiEndpoint.FILE}/download/${id}`
        })
      })
      return newFileList;
    });
  }, [defaultImageIdList]);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  }

  const handleChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} ${t("messages.file.upload_success")}`);
      onDone && onDone(info.file.response);
    }
    if (info.file.status === "error")
      message.error(`${t("messages.file.error")}`);
    setFileList(info.fileList);
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(t('components.ui.file_upload_component.messages.img_filter'));
    }
    return isJpgOrPng
  }

  return (
    <>
      <Upload
        action={uploadingUrl} // Uploading URL
        listType='picture-card'
        className="heb-image-upload"
        fileList={fileList}
        onPreview={handlePreview}
        accept="image/*"
        onRemove={onRemove}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        headers={headers}
        showUploadList={!autoRemoveFileList}
        name={name}>
        {
          (fileList.length < maxCountFileList || autoRemoveFileList || maxCountFileList === -1)
          && <Popover placement="top" content={t("tooltips.press_to_action",
                                                 {action: t("actions.upload_image").toLowerCase()})}>
               <div style={style}>
                 <PlusOutlined/>
                 <div style={{marginTop: 8}}>{t("actions.upload_image")}</div>
               </div>
             </Popover>
        }
      </Upload>
      <HebModal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{
          width: "calc(100% + 48px)",
          margin: -24,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40
        }} src={previewImage}/>
      </HebModal>
    </>
  );
};