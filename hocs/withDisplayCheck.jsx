import React from "react";

export const withDisplayCheck = ({wrapperType, userType}, WrappedComponent) => {
    const WithDisplayCheck = () => {
        return (
            <div>
                {(userType === wrapperType) && <WrappedComponent />}
            </div>
        )
    }

    return WithDisplayCheck;
}