import React from "react";

export namespace Condition {
  type IfProps ={
    condition?: boolean,
    conditionalExpression?: (...args) => boolean,
    children: React.ReactNode | React.ReactNode[],
  }
  export const If = ({ condition, conditionalExpression, children }: IfProps) => {
    let result;
    if (condition || (conditionalExpression && conditionalExpression())) {
      result = children;
    }
    return result;
  };
}