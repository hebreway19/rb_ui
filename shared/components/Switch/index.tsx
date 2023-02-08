import React from "react";

export const Switch = ({parameter = "", children, ...props}) => {

  const renderedChildren = React.Children.map(children,
                                              child => React.cloneElement(child,
                                                                          {
                                                                            ...child.props,
                                                                            isActive: child.props.value === parameter
                                                                          }));
  return (
    <React.Fragment>
      {renderedChildren}
    </React.Fragment>
  );
};