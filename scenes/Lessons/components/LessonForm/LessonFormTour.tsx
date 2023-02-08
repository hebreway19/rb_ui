import React from "react";
import Tour from "reactour";
import { LessonType } from "../../../../constants";
import nl2br from "react-nl2br";
import { useTranslation } from "next-i18next";

const pathToTranslate = "tours.lesson_form";
const steps = {
  main: t => [
    {
      selector: ".lesson-form__title",
      content: t(`${pathToTranslate}.lesson_form_title`)
    },
    {
      selector: ".text-task-content__edit-from__content",
      content: t(`${pathToTranslate}.text_task_content_edit_from_content`)
    },
    {
      selector: ".lesson-form__exercises",
      content: t(`${pathToTranslate}.lesson_form_exercises`)
    }
  ],
  [LessonType.LESSON]: t => [
    {
      selector: ".text-task-content__edit-from__hide-or-show-paragraph",
      content: t(`${pathToTranslate}.text_task_content_edit_from_hide_or_show_paragraph`)
    }
  ],
  [LessonType.TEMPLATE]: t => [
    {
      selector: ".text-task-content__edit-from__add-or-del-paragraph",
      content: t(`${pathToTranslate}.text_task_content_edit_from_add_or_del_paragraph`)
    }
  ],
  [LessonType.EXAM]: t => [
    {
      selector: ".text-task-content__edit-from__hide-or-show-paragraph",
      content: t(`${pathToTranslate}.text_task_content_edit_from_hide_or_show_paragraph`)
    }
  ],
  buildStepsByLessonType: (lessonType, t) => {
    const previewStep = {
      selector: "",
      content: nl2br(t(`tours.start_step`, {entity: t(`entities.lesson.${lessonType}`)}))
    }
    const finishStep = {
      selector: "",
      content: nl2br(t(`tours.finish_step`, {entity: t(`entities.lesson.${lessonType}`)}))
    }
    return steps[lessonType] ? [previewStep, ...steps.main(t).concat(steps[lessonType](t)), finishStep]
                             : [];
  }
}

export const LessonFormTour = ({
                                   isOpen,
                                   onRequestClose,
                                   type = LessonType.LESSON,
                                   ...props
                                 }) => {
  const {t} = useTranslation();
  const finallySteps = steps.buildStepsByLessonType(type, t);

  return process.browser && <Tour steps={finallySteps}
                                  isOpen={isOpen}
                                  startAt={0}
                                  onRequestClose={onRequestClose}/>;
};

export default LessonFormTour;