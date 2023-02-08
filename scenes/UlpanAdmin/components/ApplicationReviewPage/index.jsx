import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { UsersService } from "../../../../services";
import { Avatar, Button, Dropdown, Input, Menu, message, Popover, Space, Table, Typography } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  MailOutlined,
  MoreOutlined,
  SearchOutlined
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { AppleIcon, FacebookIcon, GoogleIcon, VkIcon } from "../../../../shared/icons";
import { UserRole, UserState } from "../../../../constants";
import { useAuth } from "../../../../shared/hooks";

const {Text} = Typography;

const iconStates = {
  await_email_confirmation: <MailOutlined />,
  await_to_choose_ulpan: <FormOutlined />,
  await_review_by_ulpan: <ClockCircleOutlined />,
  rejected_by_ulpan: <ExclamationCircleOutlined />,
  active: <CheckCircleOutlined />,
  banned: <CloseCircleOutlined />
}

export const ApplicationReviewPage = () => {
  const {t} = useTranslation();
  const {user} = useAuth();

  let [users, setUsers] = useState([]);
  let [selectedUsers, setSelectedUsers] = useState([]);

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
    }
  };

  const disableUsersHandle = useCallback(async () => {
    const usersData = selectedUsers.map(user => { return {
                                                            _id: user._id,
                                                            state: UserState.BANNED
                                                         }
                                                })
    await UsersService.updateUsers(usersData);
    await updateDispalayData();
  }, [selectedUsers])

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
            // ref={node => {
            //   this.searchInput = node;
            // }}
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
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          // setTimeout(() => this.searchInput.select());
        }
      },
      render: text =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
    }
  }, [handleReset, handleSearch, searchText, searchedColumn]);

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
      sorter: {
        compare: (currentRow, nextRow) => {
                                            if (currentRow.state < nextRow.state) return  1;
                                            if (currentRow.state > nextRow.state) return -1;
                                            return 0;
                                          },
        multiple: 0
      },
      render: state => <Popover placement="top" content={t(`states.${state}`)}>{iconStates[state]}</Popover>,
    },
    {
      title: t("social network"),
      colSpan: 4,
      dataIndex: "vkontakteUrl",
      key: "vkontakteUrl",
      render: vkontakteUrl => vkontakteUrl 
                              ? <Typography.Link className="vkontakte-ico" rel="noopener noreferrer" target="_blank" href={vkontakteUrl}><VkIcon /></Typography.Link>
                              : <Typography.Text disabled className="vkontakte-ico"><VkIcon /></Typography.Text>
                                            
    },
    {
      title: t("facebook social network"),
      colSpan: 0,
      dataIndex: "facebookUrl",
      key: "facebookUrl",
      render: facebookUrl => facebookUrl 
                             ? <Typography.Link className="acebook-ico" rel="noopener noreferrer" target="_blank" href={facebookUrl}><FacebookIcon /></Typography.Link>
                             : <Typography.Text disabled className="acebook-ico"><FacebookIcon /></Typography.Text> 
                                            
    },
    {
      title: t("google social network"),
      colSpan: 0,
      dataIndex: "googleId",
      key: "googleId",
      render: googleId => googleId 
                          ? <Typography.Link className="google-ico" rel="noopener noreferrer"><GoogleIcon /></Typography.Link> 
                          : <Typography.Text disabled className="google-ico"><GoogleIcon /></Typography.Text> 
                                            
    },
    {
      title: t("apple social network"),
      colSpan: 0,
      dataIndex: "appleId",
      key: "appleId",
      render: appleId => appleId 
                         ? <Typography.Link className="apple-ico" rel="noopener noreferrer"><AppleIcon /></Typography.Link> 
                         : <Typography.Text disabled className="apple-ico"><AppleIcon /></Typography.Text>                   
    },
    {
      title: t("photo"),
      dataIndex: "photoUrl",
      key: "photoUrl",
      render: (text, record, index) => record?.photoUrl 
                      ? <Avatar className="user_control_list-photo" src={record?.photoUrl} alt=""/> 
                      : <Avatar>{ record?.email[0].toUpperCase()}</Avatar>,
    },
    {
      title: t("date of creation"),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: {
        compare: (currentRow, nextRow) => moment(currentRow).diff(moment(nextRow)),
        multiple: 5
      },
      render: createdAt => moment(createdAt).format("DD.MM.YYYY"),
    },
    {
      title: "",
      dataIndex: ["state", "userId"],
      key: "actions",
      render: (text, record, index) => <Dropdown.Button overlay={
                                                                  <Menu style={{textAlign: "center"}}>
                                                                    { record.state === UserState.BANNED
                                                                      ? <Menu.Item disable key="undisableUser" 
                                                                          onClick={ async () => {updateState(record._id, UserState.ACTIVE)} }
                                                                        ><CheckCircleOutlined /> {t("undisable_user")}</Menu.Item>
                                                                      : <Menu.Item key="disableUser" 
                                                                          onClick={ async () => {updateState(record._id, UserState.BANNED)} }
                                                                        ><CloseCircleOutlined /> {t("disable_user")}</Menu.Item>
                                                                    }
                                                                    {
                                                                      record.state === UserState.AWAIT_REVIEW_BY_ULPAN
                                                                      && <>
                                                                          <Menu.Item key="reviewByUlpan" 
                                                                            onClick={ async () => { updateState(record._id, UserState.ACTIVE) } }
                                                                          ><CheckCircleOutlined /> {t("apply")}</Menu.Item>
                                                                          <Menu.Item key="rejectByUlpan" 
                                                                            onClick={ async () => { updateState(record._id, UserState.REJECTED_BY_ULPAN)} }
                                                                          ><ExclamationCircleOutlined />{t("reject")}</Menu.Item> 
                                                                        </>
                                                                    }
                                                                    <Menu.Item key="setRole">
                                                                      <Dropdown overlay={
                                                                                          <Menu>
                                                                                            {
                                                                                              record.role !== UserRole.ULPAN_ADMIN
                                                                                              && <Menu.Item key="setAdminUlpanRole"
                                                                                                   onClick={ async () => {updateRole(record._id, UserRole.ULPAN_ADMIN)}}
                                                                                                 >{t("roles.ulpan_admin")}</Menu.Item>
                                                                                            }
                                                                                            {
                                                                                              record.role !== UserRole.TEACHER
                                                                                              && <Menu.Item key="setTeacherRole"
                                                                                                   onClick={ async () => {updateRole(record._id, UserRole.TEACHER)}}
                                                                                                 >{t("roles.teacher")}</Menu.Item>
                                                                                            }
                                                                                            {
                                                                                              record.role !== UserRole.STUDENT
                                                                                              && <Menu.Item key="setStudentRole"
                                                                                                   onClick={ async () => {updateRole(record._id, UserRole.STUDENT)}}
                                                                                                 >{t("roles.student")}</Menu.Item>
                                                                                            }
                                                                                            {
                                                                                              record.role !== UserRole.ENROLE
                                                                                              && <Menu.Item key="setStudentRole"
                                                                                                   onClick={ async () => {updateRole(record._id, UserRole.ENROLE)}}
                                                                                                 >{t("roles.enrolee")}</Menu.Item>
                                                                                            }
                                                                                          </Menu>
                                                                                        } placement="bottomLeft" >
                                                                        <Button type="text" style={{ width: "100%" }}><EditOutlined /> {t("set_role")}</Button>
                                                                      </Dropdown>
                                                                    </Menu.Item>  
                                                                    
                                                                  </Menu>
                                                                } icon={<MoreOutlined />} disabled={record.email === user.email} />,
    }
  ];

  const updateState = async (id, newState) => {
    await UsersService.updateUserById(id, {
                                            state: newState
                                          });
    await updateDispalayData();
  };

  const updateRole = async (id, newRole) => {
    await UsersService.updateUserById(id, {
                                            role: newRole
                                          });
    await updateDispalayData();
  }

  const updateDispalayData = async () => {
    await UsersService.getUsers().then(users => setUsers(users)).catch(error => message.warning(error.message));
  }

  useEffect(() => {
    UsersService.getUsers().then(users => setUsers(users)).catch(error => message.warning(error.message));
  }, []);

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div className="user_control_list-container">
      <Button
        disabled
        // disabled={!hasSelected}
        className="user_control_list-disable_user"
        type="default"
        onClick={disableUsersHandle}
      >
        Deactivate
      </Button>
      {hasSelected && <Text style={{marginLeft: 16}}> {t("selected")}: {selectedRowKeys.length}</Text>}
      <Table
        rowSelection={rowSelection}
        dataSource={users}
        pagination={{
          position: ["bottomCenter"],
          total: users.length
        }}
        columns={columns}
        className="user_control_list-table"
        rowClassName="user_control_list-row"
        rowKey="email"
      />
    </div>
  );
};

 ApplicationReviewPage;