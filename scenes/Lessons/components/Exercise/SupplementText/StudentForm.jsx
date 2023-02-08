import React, { useCallback, useEffect } from "react";
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import { Card, Divider, Form, Input, Typography } from "antd";
import { ExerciseType, StudentAnswerType } from "../../../../../constants";
import { useTranslation } from "next-i18next";
import { HebCard } from "../../../../../components/HebElements/HebCard";
import { HebTextArea } from "../../../../../components/HebElements/HebTextArea";
import { exerciseParserInstructionsForParagraphs } from "../ExerciseParserInstructionsForParagraphs";
import { useLessonForm } from "../../../../../providers";

const {useForm} = Form;
const {TextArea} = Input;

const parser = new Parser();
const isValidNode = (node) => true;

const processNodeDefinitions = new ProcessNodeDefinitions(React);

const QuestionForm = ({
                        _id,
                        __t = ExerciseType.ExplainIdea,
                        paragraphs = [],
                        setAnswer,
                        task = {content: []},
                        isStart,
                        answer = {answer: ""}
                      }) => {
  const [form] = useForm();
  const {lesson} = useLessonForm();
  const sourceHtmlProcessingInstructions = exerciseParserInstructionsForParagraphs(lesson);
  const handleInput = useCallback((value) => {
    setAnswer((oldAnswer) => ({...oldAnswer, answer: value, __t: StudentAnswerType.SupplementTextAnswer, exercise: _id}));
  }, [setAnswer, _id]);

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
      { isStart 
        && (
          <>
            {renderedParagraphs}
            <Divider/>
          </>
        ) 
      }
      <Form form={form}>
        <Form.Item name="answer" initialValue={answer.answer}>
          <HebTextArea rows={2} dir="rtl" lang="he" onChange={({target}) => handleInput(target.value)}/>
        </Form.Item>
      </Form>
      { !isStart 
        && (
          <>
            <Divider/>
            {renderedParagraphs}
          </>
        ) 
      }
    </>
  );
}

const ViewFrom = ({
                    paragraphs = [],
                    task = {content: []},
                    answer = {answer: ""},
                    isStart
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
                                               <Typography.Paragraph dir="rtl"
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
      { isStart 
        && <>
             <Divider orientation="right">
               <Typography.Text strong>{originalTextLabel}</Typography.Text>
             </Divider>
             {renderedParagraphs}
           </>
      }
      <Divider orientation="right">
        <Typography.Text strong>{answerLabel}</Typography.Text>
      </Divider>
      <Card bordered={false}
            hoverable={false}
            bodyStyle={{padding: 24}}
            style={{width: "100%"}}>
        <Typography.Paragraph dir="rtl"
                              lang="he"
                              style={{padding: 0, whiteSpace: "pre-wrap", textAlign: "right"}}>
          {answer?.answer || ""}
        </Typography.Paragraph>
      </Card>
      { !isStart 
        && <>
             {renderedParagraphs}
             <Divider orientation="left">
               <Typography.Text strong>{originalTextLabel}</Typography.Text>
             </Divider>
           </>
      }
    </>
  )                  
}

export const StudentForm = ({
                              _id,
                              __t = ExerciseType.ExplainIdea,
                              paragraphs = [],
                              setAnswer,
                              task = {content: []},
                              isStart,
                              mode,
                              answer = {answer: ""}
                            }) => {
  
  return mode === "view"
         ? <ViewFrom paragraphs={paragraphs}
                     task={task}
                     answer={answer}
                     isStart={isStart} />
         : <QuestionForm _id={_id}
                         __t={__t}
                         paragraphs={paragraphs}
                         setAnswer={setAnswer}
                         task={task}
                         isStart={isStart}
                         answer={answer} />
};

 StudentForm;