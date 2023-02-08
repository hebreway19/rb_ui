import {useRouter} from "next/router";
import React, {ReactNode, useEffect} from "react";

type ConditionalRedirectProps = {
  children: ReactNode | ReactNode[] | undefined;
  condition: boolean;
  successRedirectPath: string;
  failRedirectPath?: string;
}

export const ConditionalRedirect = ({children, condition, successRedirectPath, failRedirectPath}: ConditionalRedirectProps) => {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      if (condition) {
        await router.push(successRedirectPath);
      } else {
        failRedirectPath && await router.push(failRedirectPath);
      }
    }
    redirect();
  }, [condition])

  return (<>{ !(condition || failRedirectPath) && children }</>);
}