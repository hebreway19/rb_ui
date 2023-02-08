import React, { useCallback, useState } from "react";
import { Button, Col, message, Row } from "antd";
import { useTranslation } from "next-i18next";

import { ApiEndpoint } from "../../../constants";
import { useUsersService } from "../../../services";
import { useAuth } from "../../../shared/hooks";

import { ImageUploadComponent } from "../../../shared/components/FileComponents";
import { HebModal } from "../../HebElements";


export const ProfileAvatar = ({avatarUrl = ""}) => {
  const {t} = useTranslation();
  const {refreshToken} = useAuth();
  const usersService = useUsersService();
  const [isVisibleMenu, setIsVisibleMenu] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const showModal = useCallback(() => {
    setModalIsVisible(true);
  }, []);
  const hideModal = useCallback(() => {
    setModalIsVisible(false);
  }, []);
  const updateUser = useCallback(async (file) => {
    try {
      await usersService.updateCurrentAuthorizedUser({
                                                       photoUrl: file._id
                                                     });
    }
    catch (error) {
      console.error(await error);
      message.warning(await (error.message));
    }
    await refreshToken();
    setModalIsVisible(false);
  }, [refreshToken, usersService]);

  const openModalFormButtonLabel = t("components.avatar.controls.upload.label");

  const modalFormTitle = t("components.avatar.modal.title");

  return (
    <>
      <div
        className="avatar-image"
        onMouseEnter={() => setIsVisibleMenu(true)}
        onMouseDown={() => setIsVisibleMenu(true)}
        onMouseLeave={() => setIsVisibleMenu(false)}
        style={{
          backgroundColor: "#B3B4B9",
          backgroundImage: avatarUrl.includes("http")
                           ? `url("${avatarUrl}")`
                           : `url("${ApiEndpoint.FILE + "/download/" + avatarUrl}")`
        }}
      >
        <div className="menu" hidden={!isVisibleMenu}>
          <Row align="middle" style={{minHeight: "100%"}}>
            <Col xs={24}>
              <Button block type="text" onClick={showModal} style={{color: "#fff"}}>
                {openModalFormButtonLabel}
              </Button>
            </Col>
          </Row>
        </div>
        <HebModal visible={modalIsVisible} onCancel={hideModal} title={
          <>
            <h5 style={{color: "#fff"}}>{modalFormTitle}</h5>
          </>
        }
                  footer={<></>}>
          {modalIsVisible &&
           <Row justify="center">
             <Col>
               <ImageUploadComponent maxCountFileList={1} onDone={updateUser} style={{color: "#fff"}} autoRemoveFileList={true}/>
             </Col>
           </Row>
          }
        </HebModal>
      </div>
    </>
  );
}