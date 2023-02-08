import React, { useCallback, useEffect, useState } from "react";
import { Col, message, Row } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";
import { ImageUploadComponent } from "../../../../../shared/components";
import { StudentAnswerType } from "../../../../../constants";
import { HebButton } from "../../../../../components/HebElements";
import { useStudentTasksAnswersForm } from "../../../../../providers";

const QuestionForm = ({task, studentTasksAnswers, setTaskAnswer, fileIdList, didLoaded, ...props}) => {
  const {t} = useTranslation();
  const {saveStudentTasksAnswers} = useStudentTasksAnswersForm();
  const commitTaskAnswer = useCallback(async () => {
    try {
      const newTaskAnswer = await saveStudentTasksAnswers(studentTasksAnswers);
      setTaskAnswer && setTaskAnswer(newTaskAnswer);
      message.success(t("messages.saved"));
    }
    catch (error) {
      const errorValue = await error;
      console.error(errorValue);
      message.warn(errorValue.message);
    }
  }, [studentTasksAnswers, setTaskAnswer]);

  const addNewFile = useCallback((file) => {
    const fileId = file?._id;
    setTaskAnswer(oldTaskAnswer => ({
      ...oldTaskAnswer,
      answers: [...oldTaskAnswer.answers, {files: fileId, __t: StudentAnswerType.File}]
    }))
  }, [setTaskAnswer]);

  const removeFile = useCallback((file) => {
    const fileId = file.response?._id;
    setTaskAnswer(oldTaskAnswer => ({
      ...oldTaskAnswer,
      answers: oldTaskAnswer.answers.filter(answer => answer?.files !== fileId)
    }));
  }, [setTaskAnswer]);

  const saveAnswersButtonLabel = t("actions.save", {entity: t("entities.answer.answers").toLowerCase()});

  return (
    <>
      <Row gutter={[8, 8]} justify="center">
        <Col xs={24}>
          <ImageUploadComponent
            defaultImageIdList={fileIdList}
            style={{color: "#fff"}}
            maxCountFileList={!didLoaded ? 0 : -1}
            onDone={addNewFile}
            onRemove={removeFile}
          />
        </Col>
        <Col xs={24} md={6}>
          <HebButton icon={<SaveOutlined/>}
                     block
                     onClick={commitTaskAnswer}>{nl2br(saveAnswersButtonLabel)}</HebButton>
        </Col>
      </Row>

    </>
  );
}

const ViewForm = ({task, studentTasksAnswers, fileIdList, didLoaded, ...props}) => {


  return (<>FFWSF</>);
};

export const StudentForm = ({mode = "default", task, ...props}) => {
  const {setStudentTasksAnswers, studentTasksAnswers} = useStudentTasksAnswersForm();
  const [fileIdList, setFileIdList] = useState([]);
  const [didLoaded, setDidLoaded] = useState(false);

  const loadTaskAnswer = useCallback(async (taskId) => {
    try {
      setDidLoaded(false);
      const newFileIdList = studentTasksAnswers.answers.filter(answer => answer.__t === StudentAnswerType.File)
                                               .map(answer => answer["files"]);
      setFileIdList(newFileIdList);
    }
    catch (error) {
      console.error(error);
      message.warn(error.message);
    }
    finally {
      setDidLoaded(true);
    }
  }, [task]);

  useEffect(() => {
    task._id && !didLoaded && loadTaskAnswer(task._id);
  }, [task._id]);

  return mode === "view" ? <ViewForm studentTasksAnswers={studentTasksAnswers}
                                     task={task}
                                     fileIdList={fileIdList}
                                     didLoaded={didLoaded}
                                     {...props} />
                         : <QuestionForm studentTasksAnswers={studentTasksAnswers}
                                         task={task}
                                         fileIdList={fileIdList}
                                         setTaskAnswer={setStudentTasksAnswers}
                                         didLoaded={didLoaded}
                                         {...props} />;
}