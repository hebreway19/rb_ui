import { Button, Carousel, Col, Input, message, Row, Tooltip } from "antd";
import React, { useCallback, useState } from "react";
import { AudioRecorderComponent, ChangeFontComponent, SimpleAudioComponent, StandardAudioComponent } from "../../shared/components";
import { useFontFamily } from "../../shared/hooks";
import { FootnoteFormProvider } from "../../providers";
import { AvatarComponent, FileUploadComponent, HebrewParagraphWithTitle, ImageUploadComponent } from "../../shared/components/ui";
import { HebButton, HebInput, HebTextArea } from "../../components/HebElements";
import { AddFootnotePanel, ContentFootnote } from "../../scenes/Lessons/components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withMainLayout } from "../../hocs";
import { GetServerSideProps } from "next";

const UIPage = () => {

  const [searchWords, setSearchWords] = useState("");
  const [isShowRecorder, setIsShowRecorder] = useState(false);

  const {Search} = Input;
  const {fontFamilyStyle} = useFontFamily();

  const text = <span>prompt text</span>;

  const onSearch = useCallback((value) => {
    message.success(value);
  }, []);

  return (
      <FootnoteFormProvider>
        <div style={{maxWidth: "64rem", margin: "0 auto"}}>
          <Row justify="center" style={{marginBottom: "10px"}}>
            <Col>
              <Search placeholder="input search text" onSearch={onSearch} enterButton/>
            </Col>
          </Row>
          <Row justify="center" style={{marginBottom: "10px"}}>
            <Col xs={24}>
              <Button size="small">small button</Button>
              <Button>normal button</Button>
              <Button size="large">large button</Button>
            </Col>
          </Row>
          <Row justify="center" style={{marginBottom: "10px"}}>
            <Col xs={24}>
              <AvatarComponent/>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <HebButton>TEST</HebButton>
              <HebInput.Password placeholder="aaaaa"/>
            </Col>
          </Row>
          <Row justify="center" style={{marginBottom: "10px"}}>
            <Col xs={24}>
              <Carousel autoplay>
                <div>
                  <h3>1</h3>
                </div>
                <div>
                  <h3>2</h3>
                </div>
                <div>
                  <h3>3</h3>
                </div>
                <div>
                  <h3>4</h3>
                </div>
              </Carousel>
            </Col>
          </Row>
          <Row justify="center" style={{marginBottom: "10px"}}>
            <Col xs={24} lg={12}>
              <Tooltip placement="top" title={text}>
                <span>lorem impus dolor sit amet</span>
              </Tooltip>
              <br/>
              <Tooltip placement="bottom" title={text}>
                <span>lorem impus dolor sit amet</span>
              </Tooltip>
            </Col>
            <Col xs={24} lg={12}>
              <Tooltip placement="top" title={text}>
                <Button>Tooltip button</Button>
              </Tooltip>
              <br/>
              <Tooltip placement="bottom" title={text}>
                <Button>Tooltip button</Button>
              </Tooltip>
            </Col>
          </Row>
          <Row justify="center" style={{marginBottom: "10px"}}>
            <Col xs={24}>
              <Input onChange={e => setSearchWords(e.target.value)}/>
              <Button
                type="primary"
              >open WordSearcher</Button>
            </Col>
            <AddFootnotePanel word={searchWords} onDone={console.log}/>
          </Row>
          <Row justify="center" style={{marginBottom: "10px"}}>
            <Col xs={24} lg={12}>
              <ImageUploadComponent/>
            </Col>
            <Col xs={24} lg={12}>
              <FileUploadComponent/>
            </Col>
          </Row>
          <Row justify="center" gutter={8} style={{marginBottom: "10px"}}>
            <Col xs={24} lg={4}>
              <SimpleAudioComponent dataId={"60142b0743849f2bfc9803ee"}/>
            </Col>
            <Col xs={24} lg={8}>
              <Button onClick={() => {
                setIsShowRecorder(true);
              }}>show recorder</Button>
              <AudioRecorderComponent visible={isShowRecorder}
                                      onClose={() => setIsShowRecorder(false)}
                                      onDone={fileId => {
                                        setIsShowRecorder(false);
                                      }}/>
            </Col>
            <Col xs={24} lg={12}>
              <StandardAudioComponent dataId={"60142b0743849f2bfc9803ee"}/>
            </Col>
          </Row>
          <Row justify="center" style={{marginBottom: "10px"}}>
            <Col xs={24} lg={12}>
              <ContentFootnote dataId={"602cf628bb16110ca4270b41"} word="123"/>
            </Col>
          </Row>
          <Row justify="center" style={{marginBottom: "10px"}}>
            <Col xs={24} lg={12}>
              <ChangeFontComponent/>
            </Col>
            <Col xs={24}>
              <HebrewParagraphWithTitle title={"צָב קָטַן מָצָאתִי"}
                                        content={
                                          `צָב קָטַן מָצָאתִי
            נִפחָד עָמַד בּוֹדֵד.
            "בא אלי" קָרָאתִי
            אך הוא נִשאַר עוֹמֵד.
             
            שָׁלַחְתִי יָד לִטַפְתִי,
            זָנָב וגם שִריוֹן,
            אֶל תוֹך בֵּיתוֹ הֵצַצְתִּי
            רָאִיתִי רֹאש קָטוֹן.`} fontFamilyStyle={fontFamilyStyle}/>
              <HebrewParagraphWithTitle content={
                `צָב קָטַן מָצָאתִי
            נִפחָד עָמַד בּוֹדֵד.
            "בא אלי" קָרָאתִי
            אך הוא נִשאַר עוֹמֵד.
             
            שָׁלַחְתִי יָד לִטַפְתִי,
            זָנָב וגם שִריוֹן,
            אֶל תוֹך בֵּיתוֹ הֵצַצְתִּי
            רָאִיתִי רֹאש קָטוֹן.`
              } fontFamilyStyle={fontFamilyStyle}/>
            </Col>
          </Row>
        </div>
      </FootnoteFormProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(UIPage);