import React, { useCallback, useState } from "react";
import { Col, message, Row } from "antd";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";
import { GameTaskExerciseTypes, UserRole } from "../../constants";
import { MinusSquareOutlined, PlusSquareOutlined, QuestionCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { useAuth } from "../../providers/AuthProvider";
import { MemoryGame } from "../../scenes/Lessons/components/Exercise/MemoryGame";
import { ObjectUtil } from "../../util";
import { ExerciseTour } from "../../scenes/Lessons/components/Exercise/ExerciseTour";
import { GameTaskExerciseList } from "../GameTaskExerciseList";
import { HebButton, HebModal, HebTooltip, HebTypography } from "../HebElements";
import { Exercise, Task, TextContent } from "../../types";
import { AuthProvider, RequestProvider, useLessonForm } from "../../providers";

const TeacherExercise = {
  [GameTaskExerciseTypes.Memory]: (props) => <MemoryGame {...props} />
};

class TeacherPanelProps {
  taskIndex: number;
  task: Task<TextContent>;
  exercises: Exercise[];
}

export const TeacherPanel = ({
                               taskIndex,
                               task,
                               exercises = []
                             }: TeacherPanelProps) => {
  const {token} = useAuth();
  const {t} = useTranslation();
  const {
    form, lesson, addExercise, savedLesson, setLesson, removeExercise, switchTurnExercise,
    getExerciseIndexByTaskIndexAndExerciseType, getExerciseIndexByTaskIndexAndExerciseTypeFromSavedLesson,
    getExerciseByTaskIndexAndExerciseType,  updateExerciseByTaskIndexAndExerciseType,
    createOrRemoveExerciseByTaskIndexAndExerciseIndexAndExerciseType
  } = useLessonForm();
  
  const [selectedExerciseType, setSelectedExerciseType] = useState("");
  const [selectedExerciseErrors, setSelectedExerciseErrors] = useState<boolean>(false);
  const [isOpenTour, setIsOpenTour] = useState(false);
  
  const exercise = getExerciseByTaskIndexAndExerciseType(taskIndex,
    selectedExerciseType);
  const exerciseIndex = getExerciseIndexByTaskIndexAndExerciseType(taskIndex,
    selectedExerciseType);
  const saveExerciseButtonLabel = t("actions.save", {entity: t("entities.exercise.exercise").toLowerCase()});
  const oldIndex = getExerciseIndexByTaskIndexAndExerciseTypeFromSavedLesson(taskIndex,
    selectedExerciseType);
  const oldExercise = savedLesson.tasks[taskIndex].exercises[oldIndex];
  const handleExerciseSelect = useCallback((exerciseType = "") => () => {
    setSelectedExerciseType(exerciseType);
    setSelectedExerciseErrors(false);
  }, []);
  const onCancel = useCallback(() => {
    if (oldExercise && oldIndex > -1) {
      updateExerciseByTaskIndexAndExerciseType(taskIndex, selectedExerciseType, oldExercise);
    }
    setLesson(oldLesson => {
      if (!(oldExercise && oldIndex > -1)) {
        const oldExercises = savedLesson.tasks[taskIndex].exercises;
        oldLesson.tasks[taskIndex].exercises = oldExercises;
      }
      return oldLesson;
    })
    form.resetFields(ObjectUtil.getLeaves(savedLesson));
    setSelectedExerciseErrors(false);
    handleExerciseSelect()();
  }, [form, handleExerciseSelect, oldExercise, oldIndex, savedLesson, selectedExerciseType, setLesson, taskIndex, updateExerciseByTaskIndexAndExerciseType]);
  const saveExercise = useCallback(async () => {
    const isCorrect = await form.validateFields()
                                .then(() => true)
                                .catch(error => {
                                  if (error.errorFields.length > 0) {
                                    error.errorFields.forEach(errorItem => {
                                      if ((errorItem.name?.[0] as string).endsWith("_nikkudot")) {
                                        message.warn(errorItem.errors?.[0])
                                      }
                                    });
                                    return false
                                  }
                                });
    if (isCorrect === true && selectedExerciseErrors === false) {
      form.submit();
      handleExerciseSelect()();
      setSelectedExerciseErrors(false);
    }
  }, [selectedExerciseErrors, form, handleExerciseSelect]);
  
  const footer = (
    <Row justify="center" style={{width: "100%"}}>
      <Col span={22}>
        <Row justify="end">
          <Col xs={24} sm={12}>
            <HebButton block
                       viewType="primary"
                       overText={false}
                       buttonSize="small"
                       icon={<SaveOutlined/>}
                       onClick={saveExercise}>
              {nl2br(saveExerciseButtonLabel)}
            </HebButton>
          </Col>
        </Row>
      </Col>
    </Row>
  );
  
  const editExercise = t("actions.edit", { entity: t("entities.exercise.exercise").toLowerCase() });
  
  const FormComponent = TeacherExercise[selectedExerciseType];
  const formProps = {
    taskIndex,
    exerciseIndex,
    updateExerciseByTaskIndexAndExerciseType,
    removeExercise,
    ...exercise,
    task,
    createOrRemoveExerciseByTaskIndexAndExerciseIndexAndExerciseType,
    role: UserRole.TEACHER,
    setIsExerciseHasErrors: setSelectedExerciseErrors
  };
  
  const tourTooltip = t("tooltips.press_to_action", {action: t("actions.show.entity", {entity: t("entities.tour")}).toLowerCase()});
  
  const exerciseTypeLabel = t(`pages.lesson.form.tasks.exercises.types.${selectedExerciseType}.title`);
  
  const turnOnExerciseButtonLabel = t("actions.turn.on.exercise", {
    exerciseType: exerciseTypeLabel.toLowerCase(),
    exercise: t("entities.exercise.exercise").toLowerCase()
  });
  
  const turnOffExerciseButtonLabel = t("actions.turn.off.exercise", {
    exerciseType: exerciseTypeLabel.toLowerCase(),
    exercise: t("entities.exercise.exercise").toLowerCase()
  });
  
  return (
    <>
      <GameTaskExerciseList role={UserRole.TEACHER} taskIndex={taskIndex}
                            exercises={exercises} onExerciseSelected={handleExerciseSelect}/>
      <HebModal visible={selectedExerciseType}
                style={{top: 20}}
                onCancel={onCancel}
                footer={footer}
                width={window.innerWidth > 700 ? 700 : window.innerWidth}
                title={
                  <Row justify="center" align="middle">
                    <Col span={22}>
                      <Row justify="space-between" align="middle">
                        <Col style={{textAlign: "center"}}>
                          <HebTypography.Text style={{fontSize: "18px"}}>{nl2br(editExercise)}</HebTypography.Text>
                        </Col>
                        <Col>
                          <HebTooltip placement="left"
                                      title={nl2br(tourTooltip)}>
                            <HebButton viewType="default"
                                       style={{minWidth: 56}}
                                       buttonSize="small"
                                       icon={<QuestionCircleOutlined/>}
                                       onClick={() => setIsOpenTour(true)}/>
                          </HebTooltip>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                }>
        <AuthProvider jwt={token}>
          <RequestProvider>
            <Row style={{marginBottom: "1rem"}} justify="start">
              <Col hidden={exerciseIndex >= 0} xs={24}>
                <HebButton
                  block
                  buttonSize="small"
                  icon={<PlusSquareOutlined/>}
                  onClick={() => addExercise(selectedExerciseType, taskIndex, lesson?.tasks[taskIndex]?.exercises?.length || 0)}
                >
                  {nl2br(turnOnExerciseButtonLabel)}
                </HebButton>
              </Col>
              <Col xs={24} hidden={exercise.isEnabled || exerciseIndex < 0}>
                <HebButton
                  block
                  buttonSize="small"
                  icon={<PlusSquareOutlined/>}
                  onClick={() => switchTurnExercise(taskIndex, exerciseIndex)}
                >
                  {nl2br(turnOnExerciseButtonLabel)}
                </HebButton>
              </Col>
              <Col hidden={exerciseIndex < 0 || !exercise.isEnabled} xs={24}>
                <HebButton block
                           buttonSize="small"
                           icon={<MinusSquareOutlined/>}
                           onClick={() => switchTurnExercise(taskIndex, exerciseIndex)}>
                  {nl2br(turnOffExerciseButtonLabel)}
                </HebButton>
              </Col>
            </Row>
            {FormComponent && exercise.isEnabled && <FormComponent {...formProps}/>}
          </RequestProvider>
        </AuthProvider>
      </HebModal>
      <ExerciseTour isOpen={isOpenTour}
                    role={UserRole.TEACHER}
                    type={selectedExerciseType}
                    onRequestClose={() => setIsOpenTour(false)}/>
    </>
  );
}