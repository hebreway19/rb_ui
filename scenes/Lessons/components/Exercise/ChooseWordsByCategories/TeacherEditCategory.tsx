import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { CloseCircleOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";
import { HebButton, HebInput } from "../../../../../components/HebElements";

export const TeacherEditCategory = ({currentCategoryName = "", wordsByCategories, onRemove, onRename, onClose}) => {
  const {t} = useTranslation();
  const [newCategoryName, setNewCategoryName] = useState("");

  const save = useCallback(() => {
    onRename(newCategoryName);
    onClose && onClose();
  }, [newCategoryName, onClose]);

  const remove = useCallback(() => {
    onClose();
    onRemove();
  }, [onRemove, onClose]);

  const cancel = useCallback(() => {
    setNewCategoryName(currentCategoryName);
    onClose && onClose()
  }, [onClose])

  useEffect(() => {
    setNewCategoryName(currentCategoryName);
  }, [currentCategoryName]);

  const saveCategoryLabel = t("actions.save",
    { entity: t("entities.category.case.accusative").toLowerCase() }
  );
  const removeCategoryLabel = t("actions.remove.entity",
    { entity: t("entities.category.case.accusative").toLowerCase() }
  );
  const cancelLabel = t("actions.cancel");

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24}>
          <HebInput
            lang="he"
            dir="rtl"
            value={newCategoryName}
            onChange={event => setNewCategoryName(event.target.value.trim())}
            onPressEnter={save}
            style={{width: "100%"}}
          />
        </Col>
        <Col xs={24}>
          <HebButton
            dir="ltr"
            overText={false}
            buttonSize="over-small"
            block
            icon={<SaveOutlined/>}
            onClick={save}
            viewType="primary">
            {nl2br(saveCategoryLabel)}
          </HebButton>
        </Col>
        <Col xs={24} md={12}>
          <HebButton
            dir="ltr"
            block
            buttonSize="over-small"
            overText={false}
            icon={<DeleteOutlined />}
            onClick={remove}
          >
            {nl2br(removeCategoryLabel)}
          </HebButton>
        </Col>
        <Col xs={24} md={12}>
          <HebButton icon={<CloseCircleOutlined />}
                     buttonSize="over-small"
                     overText={false}
                  onClick={cancel} block>
            {cancelLabel}
          </HebButton>
        </Col>

      </Row>
    </>
  );
}