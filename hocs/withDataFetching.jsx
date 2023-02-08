import React, { useEffect, useState } from "react";

export const withDataFetching = ({ requestUrl, requestMethod, requestHeader, requestBody = null }, props) => WrappedComponent => {
    const WithDataFetching = () => {
        const [result, setResult] = useState(null);
        const [error, setError] = useState(null);
        const [isLoaded, setIsLoaded] = useState(false);

        useEffect(() => {
            fetch(requestUrl, {
                method: requestMethod,
                headers: requestHeader,
            })
                .then(response => response.json())
                .then(data => {
                    setResult(data);
                    setIsLoaded(true);
                }, err => {
                    setError(err);
                    setIsLoaded(true);
                });
        }, [isLoaded]);

        return (
            <WrappedComponent 
                {...props}
                result={result}
                error={error}
                isLoaded={isLoaded}
                
            />
        );
    }

    return WithDataFetching;
}

 withDataFetching;