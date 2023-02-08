import React from "react";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";
import Cookies from "universal-cookie";
import { merge } from "lodash";
import { StorageKey } from "../constants";

const MyDocument = ({...props}) => {
  return (
    <Html lang="en">
      <Head title={"Hebreway"}>
        <meta charSet="utf-8"/>
        <link rel="icon" href="/favicon.ico"/>
        <link rel="apple-touch-icon" href="/logo192.png"/>
        <link rel="manifest" href="/manifest.json"/>
      </Head>
      <body className="hebreway">
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta name="theme-color" content="#000000"/>
      <meta name="description" content="Web site created using create-react-app"/>
      <meta httpEquiv="cache-control" content="no-cache"/>
      <meta httpEquiv="expires" content="0"/>
      <meta httpEquiv="pragma" content="no-cache"/>
        <Main {...props.pageProps}/>
        <NextScript {...props.pageProps}/>
      </body>
    </Html>
  );
};

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cookies = new Cookies(ctx.req.headers.cookie);
  const token = cookies.get(StorageKey.JWT);
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () => originalRenderPage({
                                              enhanceApp: (App) => {
                                                const NewApp = (props) => {
                                                  const newProps = merge({}, props, {
                                                    pageProps: merge({}, props.pageProps, {[StorageKey.JWT]: token})
                                                  });
                                                  return (<App {...newProps}/>);
                                                };
                                                return NewApp;
                                              }
                                            });
  const initialProps = await Document.getInitialProps(ctx);
  return {...initialProps};
};

export default MyDocument;