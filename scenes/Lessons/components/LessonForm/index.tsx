import React, {useEffect, useState} from "react";
import { Card, Col, Drawer, Empty, Row, Space, Spin, Tooltip } from "antd";
import {useTranslation} from "next-i18next";
import {CloseOutlined, FileTextOutlined, PlusSquareOutlined, SelectOutlined} from "@ant-design/icons";
import dynamic from "next/dynamic";
import nl2br from "react-nl2br";
import { withExercisePanel } from "../../../../components/ExercisesPanel";

import { LessonState, TaskType, UserRole } from "../../../../constants";
import {Case, Switch} from "../../../../shared/components";
import {LessonPageExtra} from "./LessonPageExtra";
import {HebButton, HebDivider, HebForm, HebInput, HebModal, HebPageHeader} from "../../../../components/HebElements";
import {LessonParamsPanel} from "./LessonParamsPanel";
import {useLessonForm} from "../../../../providers";

const LessonFormTour = dynamic(() => import("./LessonFormTour"), {ssr: false});
const LessonPage = dynamic(() => import("../../../../components/LessonPage"), {ssr: false});
const TextTaskEditForm = dynamic(() => import("../TextTaskEditForm"), {ssr: false, loading: () => <Spin />});
const GameTaskEditForm = dynamic(() => import("../GameTaskEditForm"), {ssr: false, loading: () => <Spin />});

const TaskEditForm = {
  [TaskType.GameTask]: GameTaskEditForm,
  [TaskType.TextTask]: TextTaskEditForm
}

const LessonForm = () => {
  const {t} = useTranslation();
  const {
    formState,
    lesson,
    updatedField,
    setUpdatedField,
    form,
    handleLessonChange,
    saveLesson,
    changePageState,
    addTask,
    getUnselectedTasksTypes
  } = useLessonForm();
  
  const [isTouched, setIsTouched] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  
  useEffect(() => {
    setIsTouched(form.isFieldsTouched(false));
  }, [form, lesson]);
  
  const selectTaskTitle = t("pages.lesson.selectTask.title");
  const tasksLabel = t("pages.lesson.form.tasks.label");
  const addTaskTooltip = t("pages.lesson.form.addTask.tooltip");
  const selectTooltip = t("actions.select");
  
  const tasksViews = lesson.tasks.map((task, index) => {
    const TaskEdit = TaskEditForm[task.__t];
    return withExercisePanel(TaskEdit, t)({
      role: UserRole.TEACHER, taskIndex: index, task, exercises: task.exercises, __t: task.__t, _id: task._id,
      content: task.content, showText: task.showText
    });
  });
  
  return (
    <>
      <Spin spinning={!formState.didLoaded}>
        <HebPageHeader
          title={formState.isNewLesson
            ? nl2br(t("pages.lesson.new.simple",
              {entity: t(`entities.lesson.${lesson?.type}`).toLowerCase()}))
            : t(`entities.lesson.${lesson?.type}`)
          }
          borderBottom={true}
        />
        <HebForm
          form={form}
          onFinish={saveLesson}
          onChange={setUpdatedField}
          onFieldsChange={handleLessonChange}
          layout="vertical"
          validateMessages={{
            required: (...args: string[]): string => t(`errors.required`,
                                                       {
                                                         fieldName: t(`pages.lesson.form.${args[0].replace(/\[\d+\]/g, "")}.label`)
                                                           .toLowerCase()
                                                       })
          }}>
          <Row className="lesson-form__container" gutter={[0, 24]} justify="center">
            <Col span={22}>
              <LessonPageExtra setIsTourOpen={setIsTourOpen}/>
            </Col>
            <Col span={22}>
              {formState.isExpertMode && (<LessonParamsPanel/>)}
            </Col>
            <Col span={22}>
              <HebDivider>{t("pages.lesson.form.title.label")}</HebDivider>
            </Col>
            <Col span={22}>
              <Row gutter={[50, 8]} className="lesson-form__title">
                <Col xs={24} lg={12}>
                  {
                    lesson.studentsNativeLanguage && (
                      <HebForm.Item key={lesson.studentsNativeLanguage as string} name={`title.${lesson.studentsNativeLanguage}`} form={form} changedField={updatedField}
                                    initialValue={lesson.title[lesson.studentsNativeLanguage as string]}>
                        <HebInput lang={lesson.studentsNativeLanguage as string} className="input_hebrew-text" size={"large"} cssType="default" style={{unicodeBidi: "isolate-override", fontSize: "1.5rem"}}
                                  name={`title.${lesson.studentsNativeLanguage}`} placeholder={t(`pages.lesson.form.title.${lesson.studentsNativeLanguage}.placeholder`)}/>
                      </HebForm.Item>
                    )
                  }
                </Col>
                <Col xs={24} lg={12}>
                  <Row>
                    <Col xs={24} hidden={formState.showWithoutNikkudot}>
                      <HebForm.Item required={true} rules={[{required: true}]} form={form} changedField={updatedField} labelCol={{span: 24, style: {marginLeft: "auto"}}}
                                    initialValue={lesson.title.he_nikkudot} name={`title.he_nikkudot`}>
                        <HebInput lang="he" dir="rtl" cssType="default" className="input_hebrew-text" size={"large"} style={{unicodeBidi: "isolate-override", fontSize: "1.5rem"}}
                                  placeholder={t(`pages.lesson.form.title.he_nikkudot.placeholder`)}/>
                      </HebForm.Item>
                    </Col>
                    <Col xs={24} hidden={!formState.showWithoutNikkudot}>
                      <HebForm.Item required={true} rules={[{required: true}]} form={form} changedField={updatedField} label={t(`pages.lesson.form.title.he.label`)}
                                    labelCol={{span: 24, style: {marginLeft: "auto"}}} initialValue={lesson.title.he} name={`title.he`}>
                        <HebInput lang="he"
                                  dir="rtl"
                                  className="input_hebrew-text"
                                  size={"large"}
                                  cssType="primary"
                                  style={{unicodeBidi: "isolate-override", fontSize: "1.5rem"}}
                                  placeholder={t(`pages.lesson.form.title.he.placeholder`)}/>
                      </HebForm.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={22}>
              <HebDivider>{tasksLabel}</HebDivider>
            </Col>
            <Col span={22}>
              <Row justify="center" gutter={[0, 24]}>
                <Col span={24}>
                  {tasksViews.length ? tasksViews : <Empty/>}
                </Col>
                <Col span={8}>
                  <Tooltip title={addTaskTooltip} key="addTask">
                    <HebButton block={true} icon={<PlusSquareOutlined/>} onClick={changePageState(LessonState.SELECT_TASK)} viewType="default" buttonSize="small">
                      {t("actions.add.entity", {entity: t("entities.task.title")})}
                    </HebButton>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
          <Switch parameter={formState.state}>
            <Case value={LessonState.PREVIEW}>
              <HebModal onCancel={changePageState(LessonState.NONE)}
                        closable={false}
                        width={process.browser && window.innerWidth > 1366 ? "75.625rem" : window.innerWidth}
                        footer={null}
                        visible={true}
                        style={{top: 0}}>
                <LessonPage mode="preview"
                            isTouchedLessonForm={isTouched}
                            onBackCallback={changePageState(LessonState.NONE)}
                            backIcon={<CloseOutlined/>}/>
              </HebModal>
            </Case>
            <Case value={LessonState.SELECT_TASK}>
              <Drawer title={selectTaskTitle} placement="right" closable={false} width={280} visible={formState.state === LessonState.SELECT_TASK} onClose={changePageState(LessonState.NONE)}>
                <Space direction="vertical" style={{width: "100%"}}>
                  {
                    getUnselectedTasksTypes().map((taskType: TaskType) => {
                      const tooltip = t(`pages.lesson.form.tasks.taskType.${taskType}`);
                      return (
                        <Tooltip key={taskType} title={tooltip}>
                          <Card hoverable cover={<FileTextOutlined style={{fontSize: "10rem", paddingTop: "2rem"}}/>}
                                actions={[
                                  <Tooltip key="select" title={selectTooltip}>
                                    <SelectOutlined onClick={() => addTask(taskType)(taskType === TaskType.GameTask ? [] : undefined)}>
                                      {t("actions.add.entity", {entity: t(`entities.task.${taskType}`)})}
                                    </SelectOutlined>
                                  </Tooltip>
                                ]}>
                            <Card.Meta title={tooltip} style={{textAlign: "center"}}/>
                          </Card>
                        </Tooltip>
                      );
                    })
                  }
                </Space>
              </Drawer>
            </Case>
          </Switch>
        </HebForm>
      </Spin>
      <LessonFormTour isOpen={isTourOpen} type={lesson.type} onRequestClose={() => setIsTourOpen(false)}/>
    </>
  );
};

export default LessonForm;