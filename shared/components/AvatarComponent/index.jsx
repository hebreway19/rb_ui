import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { ApiEndpoint } from "../../../constants";
import { useAuth } from "../../hooks";
import { UsersService } from "../../../services";
import { ImageUploadComponent } from "../FileComponents";

export const AvatarComponent = () => {
  const {user, refreshToken} = useAuth();
  const {t} = useTranslation();

  const [isVisible, setIsVisible] = useState(false);

  const updateUser = useCallback(async (file) => {
    try {
      await UsersService.updateCurrentAuthorizedUser({
                                                       photoUrl: file._id
                                                     });
    } catch (error) {
      console.error(await error);
      message.warning(await (error.message));
    }
    refreshToken();
    setIsVisible(false);
  }, [refreshToken])

  const openModalFormButtonLabel = t("components.avatar.controls.upload.label");
  const openModalFormButtonTooltip = t("components.avatar.controls.upload.tooltip");
  
  const modalFormTitle = t("components.avatar.modal.title");

  const avatarPlaceholderLabel = t("components.avatar.placeholder.label")

  return  <>
            <div className="avatar__container">
              <div  className="avatar__upload_panel">
                <Row>
                  <Col xs={24}>
                    <Tooltip  placement="top"
                              title={openModalFormButtonTooltip} >
                                <Button type="text"
                                        style={{textAlign: "left"}}
                                        block
                                        onClick={ () => setIsVisible(true) } >
                                          <UploadOutlined /> {openModalFormButtonLabel}
                                </Button>
                    </Tooltip>
                  </Col>
                </Row>
              </div>
              <div className="avatar__image_container">
                { user?.photoUrl
                  ? <img  className="avatar__image"
                          src={ user.photoUrl.includes('http') 
                                ? user.photoUrl
                                : `${ApiEndpoint.FILE}/download/${user.photoUrl}`
                              } 
                          alt="loading..."/> 
                    
                  : <div className="avatar__placeholder">
                      <p style={{paddingTop: "calc(150px - 39.5px)"}}>
                        <UserOutlined style={{fontSize: "3rem"}} /><br />
                        {avatarPlaceholderLabel}
                      </p>
                    </div>    
                }
              </div>
              
            </div>

            <Modal  visible={isVisible}
                    title={
                      <>
                        <h3>{modalFormTitle}</h3>
                      </>
                    }
                    footer={null}
                    onCancel={ () => setIsVisible(false) } >
                      { isVisible
                        &&  <Row type="flex" justify="center">
                              <Col>
                                <ImageUploadComponent maxCountFileList={1} 
                                                      onDone={updateUser}
                                                      autoRemoveFileList={true} />
                              </Col>
                            </Row>
                      }
            </Modal>
          </>
}

 AvatarComponent;