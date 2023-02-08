import React from "react";
import { Steps } from "antd";
import classNames from "classnames";


export const HebSteps = ({...props}) => {
  const className = classNames('heb-steps');
  return (<Steps className={className} {...props}/>);
};

const Step = ({...props}) => {
  const className = classNames('heb-steps__step');
  return (<Steps.Step className={className} {...props}/>)
}

HebSteps.Step = Step;