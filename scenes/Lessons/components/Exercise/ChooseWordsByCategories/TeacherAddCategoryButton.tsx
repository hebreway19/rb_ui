import React, { useCallback, useState } from "react";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import { CloseCircleOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import randomColor from "randomcolor";
import nl2br from "react-nl2br";
import { HebButton, HebInput, HebPopover, HebTooltip } from "../../../../../components/HebElements";

export const TeacherAddCategoryButton = ({addCategory}) => {
  const {t} = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const onChangeInput = useCallback(({target: {value}}) => {
    setNewCategoryName(value);
  }, [])
  const onClose = useCallback(() => {
    setNewCategoryName("");
    setIsEditing(false);
  }, []);
  const saveCategory = useCallback(() => {
    addCategory(newCategoryName.trim(), randomColor());
    onClose()
  }, [addCategory, newCategoryName, onClose]);
  const onCancel = useCallback(() => {
    onClose()
  }, [onClose]);
  const showInput = () => setIsEditing(true);

  const addCategoryTooltip = t("tooltips.press_to_action",
                               { action: t("actions.add.entity",
                                           { entity: t("entities.category.case.accusative") }
                                          ).toLowerCase() });
  const saveCategoryLabel = t("actions.save",
                              { entity: t("entities.category.case.accusative").toLowerCase() }
                             );
  const cancelLabel = t("actions.cancel");

  const inputFrom = (
    <>
      <Row gutter={[8, 8]} style={{width: "100%"}}>
        <Col xs={24}>
          <HebInput
            lang="he"
            dir="rtl"
            cssType="primary"
            required={true}
            className="tag-input"
            value={newCategoryName}
            onChange={onChangeInput}
            onPressEnter={saveCategory}
          />
        </Col>
        <Col xs={12}>
          <HebButton block
                     buttonSize="small"
                  viewType="primary-v2"
                  onClick={saveCategory}
                  icon={<SaveOutlined/>}>
            {nl2br(saveCategoryLabel)}
          </HebButton>
        </Col>
        <Col xs={12}>
          <HebButton block
                     buttonSize="small"
                  onClick={onCancel}
                  icon={<CloseCircleOutlined />}>
            {cancelLabel}
          </HebButton>
        </Col>
      </Row>
    </>
  );
  return (
    <>
      <HebPopover title={<span style={{color: "#ffffff"}}>ENTER CATEGORY NAME</span>} content={inputFrom} visible={isEditing} icon={null}>
        <HebTooltip placement="topRight" title={addCategoryTooltip}                    {...(isEditing && ({visible: false}))}>
          <HebButton block className="exercise__choose-words-by-categories__add-category" buttonSize="small" icon={<PlusOutlined/>} dir="ltr" onClick={showInput}/>
        </HebTooltip>
      </HebPopover>
    </>);
};