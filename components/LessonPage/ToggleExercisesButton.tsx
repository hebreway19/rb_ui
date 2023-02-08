import { useTranslation } from "next-i18next";
import React, { useCallback, useState } from "react";
import nl2br from "react-nl2br";

import { HebButton, HebPopconfirm } from "../HebElements";
import { LessonType } from "../../constants";

type ToggleExercisesButtonProps = {
  lessonType: LessonType;
  startExercises: () => void;
  isExercisesVisible: boolean;
  lessonHasExercises: boolean;
};

export const ToggleExercisesButton = ({lessonType, startExercises, isExercisesVisible, lessonHasExercises}: ToggleExercisesButtonProps) => {
  const {t} = useTranslation();
  const [isPopConfirmVisible, setIsPopConfirmVisible] = useState(false);

  const onClick = useCallback(() => {
    if (!isExercisesVisible && lessonType === LessonType.EXAM) {
      setIsPopConfirmVisible(true);
    } else {
      startExercises();
    }
  }, [lessonType, startExercises, isExercisesVisible]);

  const start = useCallback(() => {
    setIsPopConfirmVisible(false);
    startExercises();
  }, [startExercises]);

  let showOrHideExercisesLabel = t("actions.show.entity", {entity: t("entities.exercise.exercises").toLowerCase()});
  if (isExercisesVisible) {
    showOrHideExercisesLabel = t("actions.hide.entity", {entity: t("entities.exercise.exercises").toLowerCase()});
  }

  const examPopover = t("tooltips.start.entity", {entity: t("entities.lesson.exam").toLowerCase()});
  const popconfirmYes = t("tooltips.yes");
  const popconfirmNo = t("tooltips.no");

  return (
    <>
      <div hidden={!lessonHasExercises}>
        <HebPopconfirm visible={isPopConfirmVisible} onConfirm={start} title={nl2br(examPopover)} okText={popconfirmYes} cancelText={popconfirmNo}/>
        <HebButton buttonSize="over-small" viewType="primary-v2" block overText={false} onClick={onClick}>
          {showOrHideExercisesLabel}
        </HebButton>
      </div>
    </>
  );
};

