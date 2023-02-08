import { CheckCircleOutlined, ClockCircleOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Input, Row, Space, Spin, Typography } from "antd";
import { ColumnsType } from "antd/lib/table/interface";
import { get } from "lodash";
import moment from "moment";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import Highlighter from "react-highlight-words";
import { useMediaQuery } from "react-responsive";
import { HebTable, HebTooltip, HebTypography } from "../../../../components/HebElements";
import { ApiEndpoint, ExistEnum, LessonType, StudentTasksAnswersState, UserRole } from "../../../../constants";
import { useStudentTasksAnswersAnswerList } from "../../../../providers";
import { ShowInfoIcon, UpdateInfoIcon } from "../../../../shared/icons";
import { StudentAnswer } from "../../../../types";
import { MobileList } from "./MobileList";

type SearchProps = {
  searchText: string,
  searchedColumn: string
}

export const AnswersList = ({role}) => {
  const {
    studentTasksAnswersPage, answerListState,
    createStudentTasksAnswersPath,
    filteredByLessonTitleAndPagination,
    loadStudentTaskAnswersByQueryAndPagination,
    updateAnswerList, filteredInfo
  } = useStudentTasksAnswersAnswerList();
  const {t} = useTranslation();
  
  const [filterState, setFilterState] = useState<{[key: string]: any}>({ reviewedBy: null })
  const [searchInput, setSearchInput] = useState(null);
  const [searchProps, setSearchProps] = useState<SearchProps>({
    searchText: null,
    searchedColumn: null
  });

  const studentLabel = t("pages.answers.table.student.label");
  const statusLabel = t("pages.answers.table.status.label");
  const lessonLabel = t("pages.answers.table.lesson.label");
  const groupLabel = t("pages.answers.table.group.label");
  const openFromLesson = t("pages.answers.table.lesson_openFrom.label");
  const isCheckedLabel = t("pages.answers.table.is_checked.label");
  const uncheckedTooltip = t("pages.answers.table.is_checked.unchecked.tooltip");
  const checkedTooltipByReviewer = t("pages.answers.table.is_checked.checked.tooltip");
  const goToLessonTooltip = t("tooltips.press_to_action", { action: t("pages.answer.form.actions.go_to_lesson.label").toLowerCase() });
  const getAnswersStatusTooltip = useCallback(status => status
    ? t("enums.answersStatus.finished.title")
    : t("enums.answersStatus.performed.title"), [t]);
  const tableLocale = {
    triggerDesc: t("components.table.columns.tooltips.trigger_desc"),
    triggerAsc: t("components.table.columns.tooltips.trigger_asc"),
    cancelSort: t("components.table.columns.tooltips.cancel_sort"),
  };
  const totalPointsLabel: string = t("pages.answers.table.total_points.label");

  const changeTable = useCallback((pagination, filters, sorter) => {
    setFilterState(filters);
    const filtersFieldNameList: string[] = Object.keys(filters);
    const filterRequestsList: any[] = filtersFieldNameList.filter(fieldName => filters[fieldName])
      .map((fieldName: string) => {
        const values: any[] = filters[fieldName];
        const rules = values.map(value => {
          if (value === ExistEnum.EXIST) {
            return ({[fieldName]: {'$exists': true}})
          }
          if (value === ExistEnum.NOT_EXIST) {
            return ({[fieldName]: {'$exists': false}})
          }
          return ({[fieldName]: value})
        });
        return ({'$or': rules});
      });
    let queryOptions: any = {};
    if (filterRequestsList.length > 0) {
      queryOptions = {'$and': filterRequestsList};
    }
    let paginateOptions: any = {
      page: pagination.current,
      limit: 8
    }
    const sort = { [sorter.field]: sorter.order === "descend" ? -1 : 1 }
    if (sorter.order) {
      paginateOptions.sort = sort;
    }
    loadStudentTaskAnswersByQueryAndPagination(queryOptions, paginateOptions);
  }, [loadStudentTaskAnswersByQueryAndPagination]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchProps({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = async clearFilters => {
    clearFilters();
    await loadStudentTaskAnswersByQueryAndPagination({}, {page: studentTasksAnswersPage.page, limit: 8})
    setSearchProps(oldState => ({...oldState, searchText: '' }));
  };

  const getColumnSearchProps = (dataIndex, direction="ltr") => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            setSearchInput(node);
          }}
          dir={direction}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => filteredByLessonTitleAndPagination(selectedKeys[0], {page: studentTasksAnswersPage.page, limit: 8})}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            {t("actions.search.label")}
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            {t("actions.reset")}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? "#1E9C73" : undefined }} />,
    onFilter: (value, record) => get(record, dataIndex) ? get(record, dataIndex).toString().toLowerCase().includes(value.toLowerCase())
      : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput?.select(), 100);
      }
    },
    render: text =>
      searchProps.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchProps.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const isMediumScreen = useMediaQuery({ query: '(min-width: 1024px)' });
  const isRetina = useMediaQuery({ query: '(max-width: 1367px)' });
  const isRetinaPropsDisplayed = (isMediumScreen && isRetina);

  let teacherColumns: ColumnsType<any> = [
    {
      title: groupLabel,
      dataIndex: "lesson.group",
      key: "lesson.group",
      sorter: true,
      render: (text, render) => (render.lesson?.group?.groupName || "-")
    }
  ];
  if (!isRetinaPropsDisplayed) {
    teacherColumns.push({
      title: studentLabel,
      dataIndex: "student.firstname",
      key: 'student.firstname',
      width: "auto",
      ...getColumnSearchProps('student.firstname'),
      filteredValue: filteredInfo?.student || undefined,
      sorter: (a, b) => {
        if (`${a.student?.firstname} ${a.student?.surname}` > `${b.student?.firstname} ${b.student?.surname}`) return 1;
        if (`${a.student?.firstname} ${a.student?.surname}` < `${b.student?.firstname} ${b.student?.surname}`) return -1;
        return 0
      },
      render: (text, render) => `${render.student?.firstname} ${render.student?.surname}`
    })
  }

  const studentColumns: ColumnsType<any> = [
    {
      title: statusLabel,
      dataIndex: "state",
      key: 'state',
      sorter: true,
      filters: [
        {text: t("enums.answersStatus.finished.title"), value: StudentTasksAnswersState.FINISHED},
        {text: t("enums.answersStatus.performed.title"), value: StudentTasksAnswersState.STARTED},
        {text: t("enums.answersStatus.created.title"), value: StudentTasksAnswersState.CREATED}
      ],
      filteredValue: filterState.state || null,
      render: (text, render) => (<HebTooltip placement="top"
                                             title={getAnswersStatusTooltip(render.state === StudentTasksAnswersState.FINISHED)} >
                                          <span
                                            style={
                                              render.state === StudentTasksAnswersState.FINISHED
                                                ? {color: "#4E4F60", fontWeight: "bold"}
                                                : {color: "#4E4F6088"}}>
                                            { render.state === StudentTasksAnswersState.FINISHED
                                              ? <CheckCircleOutlined />
                                              : <ClockCircleOutlined />
                                            } {getAnswersStatusTooltip(render.state === StudentTasksAnswersState.FINISHED)}
                                          </span>
      </HebTooltip>)
    }
  ]

  const columns: ColumnsType<any> = [
    {
      title: lessonLabel,
      dataIndex: "lesson.title.he_nikkudot",
      key: "lesson.title.he_nikkudot",
      align: 'right',
      width: "25%",
      filteredValue: filteredInfo?.lesson || null,
      filters: studentTasksAnswersPage.docs.map(item => ({
        text: item?.lesson?.title?.he_nikkudot || item?.lesson?.title?.he,
        value: item?.lesson?._id
      })),
      ...getColumnSearchProps('lesson.title.he_nikkudot', "rtl"),
      sorter: true,
      render: (text, render) =>
        isRetinaPropsDisplayed ? <Row gutter={[0, 8]}>
            <Col xs={24}>
              <HebTypography.Text dir="rtl" style={{ fontSize: 13, lineHeight: "17px", color: "#4E4F60", fontWeight: "bold"}}>
                { render?.lesson?.title?.he_nikkudot || render?.lesson?.title?.he || ""}&nbsp;
              </HebTypography.Text>
            </Col>
            <Col xs={24}>
              <Row align="middle" gutter={8}>
                <Col>
                  <Avatar
                    size={20}
                    style={{
                      background: "linear-gradient(104.91deg, #303144 1.5%, #7A7C89 105.55%)",
                      color: "#ffffff"
                    }}
                    {...render?.student?.photoUrl
                      ? ({src: render?.student?.photoUrl.includes('http')
                          ? render?.student?.photoUrl
                          : `${ApiEndpoint.FILE}/download/${render?.student?.photoUrl}`
                      })
                      : ({icon: <UserOutlined />})} />
                </Col>
                <Col>
                  <Typography.Text style={{ fontSize: 13, textAlign: "left", color: "#4E4F60"}}>
                    {`${render?.student?.firstname || ""} ${render?.student?.surname || ""}`}
                  </Typography.Text>
                </Col>
              </Row>
            </Col>
          </Row>
          : <HebTypography.Text lang="he"
                                dir="rtl">
            { render?.lesson?.title?.he_nikkudot?.length > 29
              ? `${render?.lesson?.title?.he_nikkudot.substring(0, 26)}...`
              : render?.lesson?.title?.he_nikkudot || "" }
          </HebTypography.Text>
    },
    {
      title: openFromLesson,
      dataIndex: "lesson.openFrom",
      key: "lesson.openFrom",
      align: "center",
      sorter: true,
      render: (text, render) => moment(render?.lesson?.openFrom).format(t("date_format"))
    },
    {
      title: isCheckedLabel,
      dataIndex: "reviewedBy",
      filters: [
        {text: <><CheckCircleOutlined /> {checkedTooltipByReviewer}</>, value: ExistEnum.EXIST},
        {text: <><ClockCircleOutlined /> {uncheckedTooltip}</>, value: ExistEnum.NOT_EXIST}
      ],
      filteredValue: filterState.reviewedBy,
      render: (text, render) => <HebTooltip placement="top"
                                                   title={ render?.reviewedBy
                                                     ? checkedTooltipByReviewer
                                                     : uncheckedTooltip
                                                   }>
        { render?.reviewedBy
          ? <Space style={{color: "#4E4F60", fontWeight: "bold"}}>
            <CheckCircleOutlined />
            {checkedTooltipByReviewer}
          </Space>
          : <Space style={{color: "#4E4F6088"}}>
            <ClockCircleOutlined />
            {uncheckedTooltip}
          </Space>
        }
      </HebTooltip>
    },
    {
      title: totalPointsLabel,
      dataIndex: "totalPoints",
      key: "totalPoints",
      align: "center",
      sorter: true,
      render: (text, render) => {
        const emptyTotalPointsLabel: string = t("pages.answers.table.total_points.empty.lesson");
        if (render.lesson.type === LessonType.EXAM) {
          const emptyExamTotalPointsLabel: string = t("pages.answers.table.total_points.empty.exam");
          const studentTaskAnswersPointsList: number[] = render.answers.map((answer: StudentAnswer) => answer.points);
          const totalPoints: number = studentTaskAnswersPointsList.reduce((previousValue, currentValue) => previousValue + currentValue, 0)
          if (render.reviewedBy) {
            return (
              <HebTooltip placement="top">
                <p style={{textAlign: "center", margin: 0}}>{totalPointsLabel}: {totalPoints}</p>
              </HebTooltip>
            )
          }
          return <>{emptyExamTotalPointsLabel}</>
        }
        return <>{emptyTotalPointsLabel}</>
      }
    },
  ];

  const controlColumn: ColumnsType<any> = [
    {
      title: (<HebTooltip placement="topRight"
                          title={t("components.table.tooltips.updateDisplayDataTable")}>
        <Button icon={ <UpdateInfoIcon /> }
                className={"page-answers__update-list"}
                type="text"
                onClick={() => updateAnswerList({page: 1, limit: 8}) } />
      </HebTooltip>),
      dataIndex: "controls",
      width: 32 + 20 * 2,
      key: 'controls',
      render: (text, render) => ((render.lesson.type !== LessonType.EXAM || role === UserRole.TEACHER) &&
        <HebTooltip placement="topRight"
                    title={render.state === StudentTasksAnswersState.FINISHED
                      ? t("components.table.tooltips.details")
                      : goToLessonTooltip}>
          <Link href={createStudentTasksAnswersPath(role, render?.lesson?._id, render._id, render.state === StudentTasksAnswersState.FINISHED)}>
            <Button icon={<ShowInfoIcon/>} type="text" className={"page-answers__update-list"}/>
          </Link>
        </HebTooltip>
      )
    }
  ]
  let resultColumns: ColumnsType<any> = columns.concat(role === UserRole.STUDENT ? studentColumns : teacherColumns)
                                               .concat(controlColumn);

  const isMobile = useMediaQuery({query: "(max-width: 768px)"});
  const resultComponent = isMobile ? <MobileList />
                                   : <HebTable columns={resultColumns}
                                               dataSource={studentTasksAnswersPage.docs}
                                               locale={tableLocale}
                                               pagination={
                                                 {
                                                   position: ["bottomCenter"],
                                                   total: studentTasksAnswersPage.totalDocs,
                                                   pageSize: 8,
                                                   showSizeChanger: false
                                                 }
                                               }
                                               onChange={changeTable}/>;


  return <Spin spinning={answerListState.isLoading} >
    {resultComponent}
  </Spin>
}