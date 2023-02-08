import React from "react";
import { Tooltip } from "antd";

export const withTooltip = ({ placement, title}) => WrappedComponent => {
    const WithTooltip = () => {
        return (
            <Tooltip placement={placement} title={title}>
                <WrappedComponent />
            </Tooltip>
        );
    }

    return WithTooltip;
}

 withTooltip;