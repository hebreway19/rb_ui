import React, { useCallback, useState } from "react";
import { MoreOutlined, RetweetOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row, Spin, Table, Tooltip } from "antd";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export const TableComponent = ({
                                 rowSelection = {},
                                 columns = [],
                                 dataSource = {},
                                 onChange = () => {},
                                 rowKey = "_id",
                                 updateDisplayDataTable = () => {},
                                 getSelectedRows = () => {},

                                 Controls = null,

                                 DrawerContent = null,
                                 setIsDrawerVisible = () => {},
                                 pathForDetails,
                                 pagination,

                                 didLoading
                               }) => {
  const [detailsIsVisible, setDetailsIsVisible] = useState(false);
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [select, setSelect] = useState({
                                         selectedRowKeys: [],
                                         loading: false
                                       });

  const onClose = useCallback( async () => {
    setDetailsIsVisible(false);
    setIsDrawerVisible(detailsIsVisible);
  }, [detailsIsVisible, setIsDrawerVisible]);
  
  const detailsDrawer = <Drawer width={window.innerWidth > 900 ? 640 : window.innerWidth}
                                placement="right"
                                closable={true}
                                onClose={onClose}
                                visible={detailsIsVisible} >
                                  { DrawerContent
                                    && <DrawerContent onClose={onClose} />
                                  }
                                  
                        </Drawer>;

  const { selectedRowKeys } = select;

  const updatedRowSelection = {
    ...{
         selectedRowKeys,
         onChange: (selectedRowKeys, items) => {
           setSelectedItems(items);
           getSelectedRows(selectedItems);
           setSelect({
                       ...select,
                       selectedRowKeys: selectedRowKeys
                     });
         }
       },
    ...rowSelection
  }

  const columnsWithControl = Array.from(new Set (columns.concat({
    title: <Tooltip placement="top" 
                    title={t("components.table.tooltips.updateDisplayDataTable")}>
                      <Button onClick={updateDisplayDataTable} 
                              type="primary" >
                        <RetweetOutlined />
                      </Button>
           </Tooltip>,
    width: 32 + 16 * 2,
    dataIndex: "_id",
    key: "actions",
    render: (text, record, _) => <Tooltip
                                       placement="top"
                                       title={t("components.table.tooltips.details")} 
                                     >
      <Link href={pathForDetails.replace(":id", record._id)}>
        <Button>
          <MoreOutlined rotate={90}/>
        </Button>
      </Link>
                                     </Tooltip>
  })));

  return  <Spin spinning={didLoading}>
            <Row style={{marginBottom: "1rem"}}>
              <Col xs={24}>
                { Controls
                  && Controls
                }
              </Col>
            </Row>
            <Row>
              <Col xs={24}>
                <Table rowSelection={updatedRowSelection}
                       rowKey={rowKey}
                       columns={columnsWithControl}
                       dataSource={dataSource}
                       onChange={onChange}
                       pagination={pagination} />
              </Col>
            </Row>
            {detailsDrawer}
          </Spin>
}

 TableComponent;