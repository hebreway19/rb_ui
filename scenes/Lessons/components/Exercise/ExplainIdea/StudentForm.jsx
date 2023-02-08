import React, { useCallback, useEffect } from "react";
import { Parser } from "html-to-react";
import { Card, Divider, Form, Input, Typography } from "antd";
import { ExerciseType, StudentAnswerType } from "../../../../../constants";
import { useTranslation } from "next-i18next";
import { HebCard, HebForm, HebTextArea } from "../../../../../components/HebElements";
import { exerciseParserInstructionsForParagraphs } from "../ExerciseParserInstructionsForParagraphs";
import { useLessonForm } from "../../../../../providers";

const {useForm} = Form;
const {TextArea} = Input;

const parser = new Parser();
const isValidNode = (node) => true;


const QuestionForm = ({
                        _id,
                        __t = ExerciseType.ExplainIdea,
                        paragraphs = [],
                        setAnswer,
                        task = {content: []},
                        answer = {answer: ""}
                      }) => {
  const [form] = useForm();
  const handleInput = useCallback((value) => {
    setAnswer({...answer, answer: value, __t: StudentAnswerType.ExplainIdeaAnswer, exercise: _id});
  }, [setAnswer, answer, _id]);

  const {lesson} = useLessonForm();
  const sourceHtmlProcessingInstructions = exerciseParserInstructionsForParagraphs(lesson);

  const renderedParagraphs = task.content.filter(paragraph => paragraph.isVisibleForStudents)
                                 .filter(paragraph => paragraphs.includes(paragraph._id))
                                 .map((paragraph, paragraphIndex) => {
                                   return (
                                     <HebCard key={paragraphIndex} style={{width: "100%"}}
                                           bordered={false}
                                           hoverable={false}
                                           bodyStyle={{padding: 24}}>
                                       <Typography.Paragraph dir="rtl"
                                                             lang="he"
                                                             style={{padding: 0, textAlign: "right"}}
                                                             className="exercise-question__paragraph">
                                         {parser.parseWithInstructions(paragraph.he_nikkudot,
                                                                       isValidNode,
                                                                       sourceHtmlProcessingInstructions)
                                         }
                                       </Typography.Paragraph>
                                     </HebCard>
                                   )
                                 });
  useEffect(() => {
    if (answer && form) {
      form.setFields([{name: "answer", value: answer.answer}]);
    }
  }, [answer, form]);

  return (
    <>
      {renderedParagraphs}
      <Divider/>
      <Form form={form}>
        <HebForm.Item name="answer" initialValue={answer?.answer}>
          <HebTextArea rows={2} dir="rtl" lang="he" onChange={({target}) => handleInput(target.value)}/>
        </HebForm.Item>
      </Form>
    </>
  );
}

const ViewFrom = ({
                    paragraphs = [],
                    task = {content: []},
                    answer = {answer: ""}
                  }) => {
  const {t} = useTranslation();
  const {lesson} = useLessonForm();
  const sourceHtmlProcessingInstructions = exerciseParserInstructionsForParagraphs(lesson);
  const renderedParagraphs = task.content.filter(paragraph => paragraph.isVisibleForStudents)
                                         .filter(paragraph => paragraphs.includes(paragraph._id))
                                         .map((paragraph, paragraphIndex) => {
                                           return (
                                             <Card key={paragraphIndex} style={{width: "100%"}}
                                                   bordered={false}
                                                   hoverable={false}
                                                   bodyStyle={{padding: 24}}>
                                               <Typography.Paragraph align="justify"
                                                                     dir="rtl"
                                                                     lang="he"
                                                                     style={{padding: 0, textAlign: "right"}}
                                                                     className="exercise-question__paragraph">
                                                 {parser.parseWithInstructions(paragraph.he_nikkudot,
                                                                               isValidNode,
                                                                               sourceHtmlProcessingInstructions)
                                                 }
                                               </Typography.Paragraph>
                                             </Card>
                                           )
                                         });
  const originalTextLabel = t("pages.lesson.form.tasks.exercises.original_text");
  const answerLabel = t("entities.answer.answer");
  return (
    <>
      <Divider orientation="right">
        <Typography.Text strong>{originalTextLabel}</Typography.Text>
      </Divider>
      {renderedParagraphs}
      <Divider orientation="right">
        <Typography.Text strong>{answerLabel}</Typography.Text>
      </Divider>
      <Card bordered={false}
            hoverable={false}
            bodyStyle={{padding: 24}}
            style={{width: "100%"}}>
        <Typography.Paragraph align="justify"
                              dir="rtl"
                              lang="he"
                              style={{padding: 0, whiteSpace: "pre"}}>
          {answer?.answer || ""}
        </Typography.Paragraph>
      </Card>
    </>
  )                  
}

export const StudentForm = ({
                              _id,
                              __t = ExerciseType.ExplainIdea,
                              paragraphs = [],
                              setAnswer,
                              task = {content: []},
                              mode,
                              answer = {answer: ""}
                            }) => {
  
  return mode === "view"
         ? <ViewFrom paragraphs={paragraphs}
                     task={task}
                     answer={answer} />
         : <QuestionForm _id={_id}
                         __t={__t}
                         paragraphs={paragraphs}
                         setAnswer={setAnswer}
                         task={task}
                         answer={answer} />
};

 StudentForm;