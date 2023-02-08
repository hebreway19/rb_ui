import React, { useCallback, useState } from "react";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { Col, Row } from "antd";
import nl2br from "react-nl2br";

import { HebButton, HebInput, HebPopover, HebTooltip } from "../../../../components/HebElements";
import { useStudentTasksAnswersForm } from "../../../../providers";

export const SendStudentTasksAnswersByEmail = () => {
  const {t} = useTranslation();
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const {sendStudentTasksAnswersByEmail} = useStudentTasksAnswersForm();

  const sendStudentTaskAnswerByEmailLabel = t("pages.answer.form.actions.send_by_email.label");
  const sendStudentTaskAnswerByEmailTooltip = t("tooltips.press_to_action", {action: sendStudentTaskAnswerByEmailLabel.toLowerCase()});
  const cancelLabel = t("actions.cancel");

  const showInput = useCallback(() => setIsEditing(true), []);
  const onClose = useCallback(() => {
    setEmail("");
    setIsEditing(false);
  }, []);
  const onCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const sendEmail = useCallback(() => {
    sendStudentTasksAnswersByEmail({to: email});
  }, [email, sendStudentTasksAnswersByEmail]);

  const inputFrom = (
    <>
      <Row gutter={[8, 8]} style={{width: "100%"}}>
        <Col xs={24}>
          <HebInput.Email cssType="primary"
                          required={true}
                          className="tag-input"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          onPressEnter={sendEmail}
          />
        </Col>
        <Col xs={12}>
          <HebButton block
                     buttonSize="small"
                     viewType="primary-v2"
                     onClick={sendEmail}
                     icon={<SaveOutlined/>}>
            {nl2br(sendStudentTaskAnswerByEmailLabel)}
          </HebButton>
        </Col>
        <Col xs={12}>
          <HebButton block
                     buttonSize="small"
                     onClick={onCancel}
                     icon={<CloseCircleOutlined/>}>
            {cancelLabel}
          </HebButton>
        </Col>
      </Row>
    </>
  );
  return (
    <>
      <HebPopover title={<span style={{color: "#ffffff"}}>{sendStudentTaskAnswerByEmailLabel}</span>} content={inputFrom} visible={isEditing}/>
      <HebTooltip placement="bottom" title={sendStudentTaskAnswerByEmailTooltip}>
        <HebButton overText={false} buttonSize="over-small" onClick={showInput}>
          {sendStudentTaskAnswerByEmailLabel}
        </HebButton>
      </HebTooltip>
    </>
  );
};