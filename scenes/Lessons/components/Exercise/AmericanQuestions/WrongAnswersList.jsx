import { Col } from "antd";
import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { HebForm, HebInput } from "../../../../../components/HebElements";
import { useLessonForm } from "../../../../../providers";

export const WrongAnswersList = ({
                                   taskIndex,
                                   quesitonIndex,
                                   exerciseIndex,
                                   content = [{}, {}, {}],
                                   ...props
                                 }) => {

  const {formState, form, updatedField} = useLessonForm();
  const {t} = useTranslation();
  
  const contentFieldsPrefix = `tasks[${ taskIndex }].exercises[${ exerciseIndex }].questions[${quesitonIndex}]`;
  const rootPathOfTranslate = 'pages.lesson.form.tasks';

  const getWrongAnswersWithoutHeContentByIndex = useCallback((index) => `${ contentFieldsPrefix }.wrongAnswers[${ index }].he`, [contentFieldsPrefix]);
  const getWrongAnswersWithNikkudotContentByIndex = useCallback((index) => `${ contentFieldsPrefix }.wrongAnswers[${ index }].he_nikkudot`, [contentFieldsPrefix]);

  const textWithNikkudotPlaceholder = t(`${rootPathOfTranslate}.content.he_nikkudot.placeholder`);

  const textWithoutNikkudotPlaceholder = t(`${rootPathOfTranslate}.content.he.placeholder`);  

  let wrongAnswersItems = [];
  for (let index = 0; index < 3; index++) {
    wrongAnswersItems.push(
      <React.Fragment key={index}>
        <Col xs={ 24 }  
             hidden={ formState.showWithoutNikkudot } >
          <HebForm.Item name={ getWrongAnswersWithNikkudotContentByIndex(index) }
                     initialValue={ content[index]?.he_nikkudot  || "" }
                     required={true}
                     form={form}
                     changedField={updatedField}
                     rules={[
                       {required: true}
                     ]} >
            <HebInput lang={ "he" }
                   dir={ "rtl" }
                   cssType="circled"
                   placeholder={ textWithNikkudotPlaceholder }
                    />
          </HebForm.Item>
        </Col>
        <Col xs={ 24 } 
             hidden={ !formState.showWithoutNikkudot } >
          <HebForm.Item name={ getWrongAnswersWithoutHeContentByIndex(index) }
                     initialValue={ content[index]?.he || "" }
                     form={form}
                     changedField={updatedField}
                     required={true}
                     rules={[
                       {required: true}
                     ]} >
            <HebInput lang={ "he" }
                   dir={ "rtl" }
                    cssType="circled"
                   placeholder={ textWithoutNikkudotPlaceholder }
                   />
          </HebForm.Item>
        </Col>
      </React.Fragment>
    )
  }

  return wrongAnswersItems;
}

 WrongAnswersList;