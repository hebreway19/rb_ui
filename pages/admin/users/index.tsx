import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Button, Drawer, Input, message, Popover, Space, Spin, Table, Tooltip, Typography } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, FormOutlined, MoreOutlined, RetweetOutlined, SearchOutlined } from "@ant-design/icons";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import Highlighter from "react-highlight-words";
import moment from "moment";
import Search from "antd/lib/input/Search";

import { useUsersService } from "../../../services";
import { UserDetails } from "../../../scenes/SuperAdmin/components/UserControlPage/UserDetails";
import { UserState } from "../../../constants";
import { useAuth } from "../../../shared/hooks";
import { User } from "../../../types";
import { withMainLayout } from "../../../hocs";

const {Text} = Typography;

const iconStates = {
  await_to_choose_ulpan: <FormOutlined className="user_control_list-ico warning-ico"/>,
  await_review_by_ulpan: <ClockCircleOutlined className="user_control_list-ico warning-ico"/>,
  rejected_by_ulpan: <ExclamationCircleOutlined className="user_control_list-ico warning-ico"/>,
  active: <CheckCircleOutlined className="user_control_list-ico success-ico"/>,
  banned: <CloseCircleOutlined className="user_control_list-ico error-ico"/>
};

const UserControlPage = () => {
  const {t} = useTranslation();
  const {user} = useAuth();
  const usersService = useUsersService();

  let [users, setUsers] = useState([]);
  let [selectedUsers, setSelectedUsers] = useState([]);

  const [detailsIsVisible, setDetailsIsVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredInfo, setFilteredInfo] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [select, setSelect] = useState({
                                         selectedRowKeys: [],
                                         loading: false
                                       });

  const {selectedRowKeys, loading} = select;
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, users) => {
      setSelectedUsers(users);
      setSelect({
                  ...select,
                  selectedRowKeys: selectedRowKeys
                });
    },
    getCheckboxProps: ({email}) => (email === user.email
                                    ? { disabled: true }
                                    : { disabled: false }
                                   )
  };

  const onSearchUsers = useCallback(async (value) => {
    setIsLoading(true);
    try {
      const loadedUsers: User[] = await usersService.getUsersByQuery({search: value});
      setUsers(loadedUsers);
    }
    catch (e) {
      message.warning(e.message);
      console.error(e);
    }
    finally {
      setIsLoading(false);
    }
  }, [usersService]);

  const updateDisplayData = async (query = {}) => {
    setIsLoading(true);
    try {
      const loadedUsers: User[] = await usersService.getUsersByQuery(query);
      setUsers(loadedUsers);
    }
    catch (e) {
      message.warning(e.message);
      console.error(e);
    }
    finally {
      setIsLoading(false);
    }
  };

  const showDrawer = (user) => {
    setCurrentUserId(user._id);
    setDetailsIsVisible(true);
  };

  const onClose = () => {
    setDetailsIsVisible(false);
  };

  const disableUsersHandle = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersData = selectedUsers.map(user => {
        return {
          id: user._id,
          state: UserState.BANNED
        };
      });
      await usersService.updateUsers(usersData);
      await updateDisplayData();
      message.info(t("info_updat_was_successful"));
    }
    catch {
      message.info(t("errors.bad_request"));
    }
    setIsLoading(false);
  }, [usersService, updateDisplayData, selectedUsers, t])

  const enableUsersHandle = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersData = selectedUsers.map(user => { return {
                                                              id: user._id,
        state: UserState.ACTIVE
      }
      })
      await usersService.updateUsers(usersData);
      await updateDisplayData();
      message.info(t("info_updat_was_successful"));
    }
    catch {
      message.info(t("errors.bad_request"));
    }
    setIsLoading(false);
  }, [usersService, selectedUsers, t])

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
          <Input  placeholder={`Search ${dataIndex}`}
                  value={selectedKeys[0]}
                  onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                  onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                  style={{width: 188, marginBottom: 8, display: "block"}} />
          <Space>
            <Button type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined/>}
                    size="small"
                    style={{width: 90}} >
                      {t("search")}
            </Button>
            <Button onClick={() => handleReset(clearFilters)} 
                    size="small" 
                    style={{width: 90}} >
                      {t("reset")}
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{color: filtered ? "#1890ff" : undefined}}/>,
      onFilter: (value, record) => record[dataIndex].toString()
                                                    .toLowerCase()
                                                    .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {},
      render: text =>
        searchedColumn === dataIndex ? (
          <Highlighter  highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text.toString()} />
        ) : (text),
    }
  }, [handleReset, handleSearch, searchText, searchedColumn, t]);

  const columns = [
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      sorter: {
        compare: (currentRow, nextRow) => {
                                            if (currentRow.email < nextRow.email) return  1;
                                            if (currentRow.email > nextRow.email) return -1;
                                            return 0;
                                          },
        multiple: 2
      },
      ...getColumnSearchProps("email"),
    },
    {
      title: t("user.details.full_name"),
      dataIndex: "full_name",
      key: "full_name",
      sorter: {
        compare: (currentRow, nextRow) => {
                                            if (currentRow.firstname < nextRow.firstname) return  1;
                                            if (currentRow.firstname > nextRow.firstname) return -1;
                                            return 0;
                                          },
        multiple: 1
      },
      render: (text, record, index) => `${record?.firstname} ${record?.surname}`
    },
    {
      title: t("user.fields.phone"),
      dataIndex: "phone",
      key: "phone",
      sorter: {
        compare: (currentRow, nextRow) => {
                                            if (currentRow.phone < nextRow.phone) return  1;
                                            if (currentRow.phone > nextRow.phone) return -1;
                                            return 0;
                                          },
        multiple: 1
      },
      render: phone => phone,
      ...getColumnSearchProps("phone")
    },
    {
      title: t("role"),
      dataIndex: "role",
      key: "role",
      sorter: {
        compare: (currentRow, nextRow) => {
                                            if (currentRow.role < nextRow.role) return  1;
                                            if (currentRow.role > nextRow.role) return -1;
                                            return 0;
                                          },
        multiple: 1
      },
      render: role => t(`roles.${role}`)
    },
    {
      title: t("status"),
      dataIndex: "state",
      key: "state",
      filters: Object.keys(iconStates).sort().map(state => { return {
                                                                text: <> {iconStates[state]} {t(`states.${state}`)}</>, 
                                                                value: state 
                                                             }
                                                    }),
      filteredValue: filteredInfo?.state || null,
      onFilter: (value, record) => record.state.includes(value),
      filterConfirm: "KOKO",
      sorter: {
        compare: (currentRow, nextRow) => {
                                            if (currentRow.state < nextRow.state) return  1;
                                            if (currentRow.state > nextRow.state) return -1;
                                            return 0;
                                          },
        multiple: 0
      },
      render: state =>  <Popover  placement="top" 
                                  content={t(`states.${state}`)}>
                                    {iconStates[state]}
                        </Popover>,
    },
    {
      title: t("date of creation"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: {
        compare: (currentRow, nextRow) => 
          (moment(nextRow.createdAt).unix() - (moment(nextRow.createdAt).unix() % (60 * 60 * 24))) / (60 * 60 * 24) - (moment(currentRow.createdAt).unix() - (moment(currentRow.createdAt).unix() % (60 * 60 * 24))) / (60 * 60 * 24),
        multiple: 3
      },
      render: createdAt => moment(createdAt).format("DD.MM.YYYY"),
    },
    {
      title: <Tooltip placement="top"
                      title={t("pages.list_of_users.tooltips.buttons.updateDispalayData")}>
        <Button onClick={() => updateDisplayData()}><RetweetOutlined/></Button>
      </Tooltip>,
      dataIndex: "_id",
      key: "actions",
      render: (text, record, index) => <Tooltip key={record._id} placement="top" title={t("user.button.details")}>
        <Button onClick={() => showDrawer(record)} disabled={record.email === user.email}>
          <MoreOutlined rotate={90}/>
        </Button>
      </Tooltip>
    }
  ];

  const handleTableChange = useCallback(async (pagination, filters, sorter) => {
    setFilteredInfo(filters);
  }, [])

  useEffect(() => {
    if (isLoading || !users) {
      usersService.getUsers().then(loadedUsers => {
                    setUsers(loadedUsers);
                    setIsLoading(false);
                  })
                  .catch(error => message.warning(error.message));
    }
  }, [usersService, isLoading, users]);

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      <div className="user_control_list-container">
        <Space className="user_control_list-container__header">
          <Tooltip placement="top" title={t("user.controls.tooltips.enable")}>
            <Button disabled={!hasSelected} className="user_control_list-disable_user" type="default" onClick={enableUsersHandle}>
              {t("user.controls.enable")}
            </Button>
          </Tooltip>
          <Tooltip placement="top" title={t("user.controls.tooltips.disable")}>
            <Button disabled={!hasSelected} className="user_control_list-disable_user" type="default" onClick={disableUsersHandle}>
              {t("user.controls.disable")}
            </Button>
          </Tooltip>
          <Search disabled placeholder={t("user.search.title")}
                  allowClear
                  enterButton={<><SearchOutlined/> {t("user.search.button")}</>}
                  onSearch={onSearchUsers}/>
        </Space>

        {hasSelected && <Text style={{marginLeft: 16}}> {t("selected")}: {selectedRowKeys.length}</Text>}
        <Spin spinning={isLoading}>
          <Table rowSelection={rowSelection} dataSource={users} locale={{
            filterConfirm: t("actions.select"),
            filterReset: t("actions.reset"),
            triggerDesc: t("components.table.columns.tooltips.trigger_desc"),
            triggerAsc: t("components.table.columns.tooltips.trigger_asc"),
            cancelSort: t("components.table.columns.tooltips.cancel_sort")
          }}
                 onChange={handleTableChange}
                 pagination={{
                   position: ["bottomCenter"],
                   total: users.length,
                   pageSize: 10,
                   showSizeChanger: false
                 }}
                 columns={columns}
                 className="user_control_list-table"
                 rowClassName="user_control_list-row"
                 rowKey="email"/>
        </Spin>
      </div>
      <Drawer width={process.browser && window.innerWidth <= 900 ? window.innerWidth : 640} placement="right" closable={true} onClose={onClose} visible={detailsIsVisible}>
        <UserDetails userId={currentUserId} callback={updateDisplayData}/>
      </Drawer>
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

export default withMainLayout(UserControlPage);