import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwtDecode from "jwt-decode";

import { StorageKey } from "../constants";
import { SecurityUtil } from "../util/SecurityUtil";
import { AuthUser } from "../types";

const accessMiddleware = (req: NextRequest) => {
  let nextPage;
  let user: AuthUser;
  const jwt = req.cookies[StorageKey.JWT];
  if (jwt) {
    user = jwtDecode(jwt);
  }
  const redirectPath = SecurityUtil.getRedirectRouteByUserAndCurrentPathName(user, req.page.name);
  if (redirectPath) {
    const newUrl = new URL(redirectPath.pathname, req.url)
    nextPage = NextResponse.redirect(newUrl);
  }
  return nextPage;
};

const forceHTTPSMiddleware = (req: NextRequest) => {
  let nextPage;
  if (process.env.NODE_ENV === "production" && req.headers.get("x-forwarded-proto") !== "https" && !req.headers.get("host").includes("localhost")) {
    const newUrl = new URL(`https://${req.headers.get("host")}${req.nextUrl.pathname}`, req.url);
    nextPage = NextResponse.redirect(newUrl);
  }
  return nextPage;
};

const processMiddlewareFunctions = (req: NextRequest, middlewareFns: Function[]) => {
  let nextPage = NextResponse.next();
  for (const middlewareFn of middlewareFns) {
    const fnResponse = middlewareFn(req);
    if (fnResponse) {
      nextPage = fnResponse;
    }
  }
  return nextPage;
};

export const middleware = (req: NextRequest) => {
  return processMiddlewareFunctions(req, [
    accessMiddleware,
    forceHTTPSMiddleware
  ]);
};