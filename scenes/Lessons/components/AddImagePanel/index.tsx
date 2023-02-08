import React, { useCallback, useState } from "react";
import { FileImageOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { useTranslation } from "next-i18next";

import { File } from "../../../../types";
import { ImageUploadComponent } from "../../../../shared/components";
import { HebButton, HebDrawer } from "../../../../components/HebElements";

export const AddImagePanel = ({onClose, onDone, ...props}) => {
  const [image, setImage] = useState<File>({} as File);

  const {t} = useTranslation();
  const addImageTitle = t("actions.add.entity", {entity: t("entities.image").toLowerCase()});

  const handleSubmit = useCallback(() => onDone(image), [image, onDone]);

  return (
    <HebDrawer title={addImageTitle}
               placement="right"
               destroyOnClose={true}
               closable={false}
               onClose={onClose}
               visible={true}
    >
      <Space direction="vertical" style={{width: "100%", textAlign: "center"}}>
        <ImageUploadComponent maxCountFileList={1}
                              onDone={setImage}
                              onRemove={() => setImage({} as File)}
                              style={{width: "100%"}}/>
        <HebButton indicatorLine={false} buttonSize="over-small" block onClick={handleSubmit} icon={<FileImageOutlined/>} disabled={!image._id}>
          {addImageTitle}
        </HebButton>
      </Space>
    </HebDrawer>
  );
};