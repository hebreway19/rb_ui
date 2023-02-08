import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Avatar, Button, Drawer, Dropdown, Input, Menu, message, Popover, Space, Table, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { UlpanState } from "../../../constants";
import { UlpanService } from "../../../services";
import { DetailsUlpan } from "../../../scenes/SuperAdmin/components/UlpanReviewPage/DetailsUlpan";
import { Ulpan } from "../../../types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withMainLayout } from "../../../hocs";
import { GetServerSideProps } from "next";

const iconStates = {
  dialing_in_progress: <CheckCircleOutlined/>,
  paused_dialing: <CloseCircleOutlined/>
};

const UlpanReviewPage = () => {
  const {Text} = Typography;

  const {t} = useTranslation();

  let [ulpans, setUlpans] = useState([]);
  let [selectedUlpans, setSelectedUlpans] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [select, setSelect] = useState({
                                          selectedRowKeys: [],
                                          loading: false
                                        });
  const [isVisible, setIsVisible] = useState(false);
  const [detailsUlpan, setDetailsUlpan] = useState(null);

  const showDrawer = (ulpan) => {
    setDetailsUlpan(ulpan);
    setIsVisible(true);
  };

  const onClose = () => {
    setIsVisible(false);
  };

  const detailsUlpanDrawer = (
    <Drawer width={process.browser && window.innerWidth <= 900 ? window.innerWidth : 640}
            placement="right"
            closable={true}
            onClose={onClose}
            visible={isVisible}>
      <DetailsUlpan ulpan={detailsUlpan}/>
    </Drawer>
  );

  const {selectedRowKeys, loading} = select;
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, ulpans) => {
      setSelectedUlpans(ulpans);
      setSelect({
                  ...select,
                  selectedRowKeys: selectedRowKeys
                });
    }
  };

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }, []);

  const handleReset = useCallback((clearFilters) => {
    clearFilters();
    setSearchText("");
  }, []);

  const getColumnSearchProps = useCallback((dataIndex) => {
    return {
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{padding: 8}}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{width: 188, marginBottom: 8, display: "block"}}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined/>}
              size="small"
              style={{width: 90}}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {},
      render: text =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (text),
    }
  }, [handleReset, handleSearch, searchText, searchedColumn]);

  const columns = [
    {
      title: t("ulpansfields.name"),
      dataIndex: "ulpanName",
      key: "ulpanName",
      sorter: {
        compare: (currentRow, nextRow) => {
                                            if (currentRow.email < nextRow.email) return  1;
                                            if (currentRow.email > nextRow.email) return -1;
                                            return 0;
                                          },
        multiple: 2
      },
      ...getColumnSearchProps("ulpanName"),
    },
    {
      title: "E-mail",
      dataIndex: "contactEmail",
      key: "contactEmail",
      sorter: {
        compare: (currentRow, nextRow) => {
                                            if (currentRow.role < nextRow.role) return  1;
                                            if (currentRow.role > nextRow.role) return -1;
                                            return 0;
                                          },
        multiple: 1
      },
      render: contactEmail => contactEmail
    },
    {
      title: t("ulpansfields.logoFileId"),
      key: "logoFileId",
      sorter: {
          compare: (currentRow, nextRow) => {
                                              if (currentRow.role < nextRow.role) return  1;
                                              if (currentRow.role > nextRow.role) return -1;
                                              return 0;
                                            },
          multiple: 1
        },
      render: ({logoFileId, ulpanName}) => logoFileId
                                            ? <Avatar className="user_control_list-photo" src={logoFileId} alt=""/> 
                                            : <Avatar>{ ulpanName[0].toUpperCase()}</Avatar>,
    },
    {
      title: t("ulpansfields.ulpanState"),
      dataIndex: "ulpanState",
      key: "ulpanState",
      sorter: {
          compare: (currentRow, nextRow) => {
                                              if (currentRow.role < nextRow.role) return  1;
                                              if (currentRow.role > nextRow.role) return -1;
                                              return 0;
                                            },
          multiple: 1
        },
      render: ulpanState => <Popover placement="top" content={t(`states.${ulpanState}`)}>{iconStates[ulpanState]}</Popover>
    },
    {
      title: "",
      key: "actions",
      render: (text, record, index) => <Dropdown.Button overlay={
        <Menu style={{textAlign: "left"}}>
          {record.ulpanState === UlpanState.DIALING_IN_PROGRESS
           ? <Menu.Item key="disableUlpan"
                        onClick={async () => {
                          updateState(record._id, UlpanState.PAUSED_DIALING);
                        }}
           >{t("ulpansfields.disable")}</Menu.Item>
           : <Menu.Item key="enableUlpan"
                        onClick={async () => {
                          updateState(record._id, UlpanState.DIALING_IN_PROGRESS);
                        }}
           >{t("ulpansfields.enable")}</Menu.Item>
          }
          <Menu.Item key="detailsUlpan"
                     onClick={() => showDrawer(record)}
          >{t("ulpansfields.details")}
          </Menu.Item>
        </Menu>
      } icon={<MoreOutlined/>}/>
    }
  ];

  const updateState = async (id, newState) => {
    try {
      await UlpanService.updateUlpan(id, {
        ulpanState: newState
      } as Ulpan);
      await updateDispalayData();
      message.info(t("info_updat_was_successful"));
    } catch {
      message.warn(t("errors.bad_request"));
    }
  }

  const updateDispalayData = async () => {
    await UlpanService.getAllUlpans().then(ulpans => setUlpans(ulpans)).catch(error => message.warning(error.message));
  }

  useEffect(() => {
    UlpanService.getAllUlpans().then(ulpans => setUlpans(ulpans)).catch(error => message.warning(error.message));
  }, []);

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      <div className="user_control_list-container">
        <Button disabled className="user_control_list-disable_user" type="default">
          Deactivate
        </Button>
        {hasSelected && <Text style={{marginLeft: 16}}> {t("selected")}: {selectedRowKeys.length}</Text>}
        <Table rowSelection={rowSelection}
               dataSource={ulpans}
               pagination={{
                 position: ["bottomCenter"],
                 total: ulpans.length
               }}
               columns={columns}
               className="user_control_list-table"
               rowClassName="user_control_list-row"
               rowKey="email"
        />
      </div>
      {detailsUlpanDrawer}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(UlpanReviewPage);