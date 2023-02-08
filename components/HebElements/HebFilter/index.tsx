import { CheckOutlined, ClearOutlined } from "@ant-design/icons";
import { Col, Form, message, Row, Select, Spin, Typography } from "antd";
import { merge, set, unset } from "lodash";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { PaginateOptions } from "../../../types/MongoosePagination";
import { StringUtil } from "../../../util";

import { HebButton, HebDrawer, HebForm, HebInput, HebSelect } from "../index";

export const HebFilterSelect = ({
                           form,
                           filterTag,
                           options,
                           filterValue,
                           translateTitle,
                           translateOptions,
                           t,
                           setValue,
                           onSearch
                         }) => {
  
  const onChange = useCallback((value) => {
    setValue && setValue(value);
    onSearch && onSearch();
  }, [setValue, onSearch]);
  
  return (
    <Col xs={24} lg={12}>
      <HebForm.Item type="filter" form={form} name={filterTag}
                    label={<span style={{color: "#fff", fontSize: 19}}>{translateTitle}</span>}
                    initialValue={filterValue || ""}>
        <HebSelect type="filter" arrow={false} onChange={onChange}>
          {options.map((value, index) => (
            <Select.Option key={index} value={value}>
              {value ? translateOptions(value) : t("constants.types.any")}
            </Select.Option>))
          }
        </HebSelect>
      </HebForm.Item>
    </Col>
  )
}

interface HebFilterProps {
  filterCallback?: (query, pagination?: PaginateOptions) => Promise<void> | void;
  searchOptions?: { path: string, value?: string };
  paginateOptions?: PaginateOptions,
  setItemsPage?: any,
  setFilterProps?: any,
  onCloseFilter?: any,
  setSearchString?: any,
  specificFilteringOptions?: any,
  filtersOptions?: any
}

export const HebFilter = ({
                            filterCallback,
                            searchOptions,
                            paginateOptions,
                            setItemsPage,
                            setFilterProps,
                            onCloseFilter,
                            setSearchString,
                            specificFilteringOptions = {},
                            filtersOptions = []
                          }: HebFilterProps) => {
  const {t} = useTranslation();
  
  const [filterForm] = Form.useForm();
  
  const [filterValues, setFilterValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const setSearchValue = useCallback(value => setFilterValues(previousFilterValues => {
    const newFilterValues = merge({}, previousFilterValues);
    if (value === undefined || value === null || value === "") {
      unset(newFilterValues, searchOptions.path);
      setSearchString("");
    } else {
      set(newFilterValues, searchOptions.path, StringUtil.removeNikkudots(value.trim()));
      setSearchString(value.trim());
    }
    return newFilterValues;
  }), [searchOptions, setSearchString]);
  
  const filterValuesChangeByFieldName = useCallback((fieldName) => (value) => {
    setFilterValues(previousFilterValues => {
      const newFilterValues = merge({}, previousFilterValues);
      if (value === undefined || value === null || value === "") {
        unset(newFilterValues, fieldName);
      } else {
        set(newFilterValues, fieldName, value);
      }
      return newFilterValues;
    });
  }, []);
  
  const onSearch = useCallback(async (state: "filter" | "clear" | "clearSearchString" = "filter", searchString?: string) => {
    setIsLoading(true);
    try {
      const query = state === "clear" ? {...specificFilteringOptions}
        : {...filterValues, ...specificFilteringOptions}
      setFilterProps && setFilterProps(filterValues);
      
      if (searchString !== undefined && searchString !== null && `${searchString}`.trim() !== "") {
        set(query, searchOptions.path, StringUtil.removeNikkudots(searchString.trim()));
      }
      if (state == "clearSearchString") {
        unset(query, searchOptions.path);
      }
      const foundLessonPage = paginateOptions ? await filterCallback(query, paginateOptions)
        : await filterCallback(query);
      setItemsPage(foundLessonPage);
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
    setIsLoading(false);
  }, [
    filterCallback,
    searchOptions,
    setFilterProps,
    setItemsPage,
    filterValues,
    paginateOptions,
    specificFilteringOptions
  ]);
  
  const onSearchByText = useCallback(async (searchString: string = "") => {
    setSearchString(searchString.trim());
    await onSearch(searchString.trim().length > 0 ? "filter" : "clearSearchString", searchString.trim());
  }, [onSearch, setSearchString]);
  
  const onSearchAndClose = useCallback(async () => {
    await onSearch("filter");
    onCloseFilter && onCloseFilter();
  }, [onCloseFilter, onSearch]);
  
  const clearFilter = useCallback(async () => {
    setFilterValues({});
    await onSearch("clear");
    filterForm.resetFields();
  }, [onSearch, filterForm]);
  
  useEffect(() => {
    const newSearchOption = {};
    if (searchOptions?.path && searchOptions?.value) {
      set(newSearchOption, searchOptions.path, searchOptions.value);
    }
    setFilterValues(previousFilterValues => (merge({}, previousFilterValues, searchOptions)));
  }, [searchOptions]);
  
  const filterTitle = t("components.filter.title");
  const clearFilerButtonLabel = t("components.filter.buttons.on_clear");
  const onFilterButton = t("components.filter.buttons.filter.on_filter");
  
  return (
    <Spin spinning={isLoading}>
      <HebForm form={filterForm} layout="vertical" className="heb-filter">
        <HebForm.Item type="filter" form={filterForm}
                      label={<Typography.Title level={3}>{filterTitle}</Typography.Title>}>
          <Row gutter={[8, 57]}>
            <Col span={24}>
              <HebForm.Item type="filter"
                            form={filterForm}
                            name="search"
                            dir="rtl"
                            hidden={!searchOptions?.path}
                            initialValue={filterValues?.[searchOptions?.path]}>
                <HebInput.Search allowClear
                                 enterButton
                                 cssType="primary"
                                 onChange={e => setSearchValue(e.target.value)}
                                 onSearch={onSearchByText}/>
              </HebForm.Item>
            </Col>
            <Col span={24}>
              <Row gutter={[16, {xs: 0, lg: 8}]}>
                {
                  filtersOptions.map((filter, index) => (
                    <HebFilterSelect key={index} {...filter} setValue={filterValuesChangeByFieldName(filter?.filterTag)}
                                     onSearch={onSearch} t={t}/>
                  ))
                }
              </Row>
            </Col>
            <Col xs={24}>
              <Row gutter={[30, 12]} justify="center">
                <Col xs={20} lg={12}>
                  <HebButton block
                             viewType="primary"
                             icon={<CheckOutlined/>}
                             onClick={onSearchAndClose}>
                    {onFilterButton}
                  </HebButton>
                </Col>
                <Col xs={20} lg={12}>
                  <HebButton block onClick={clearFilter} icon={<ClearOutlined/>}>
                    {clearFilerButtonLabel}
                  </HebButton>
                </Col>
              </Row>
            </Col>
          </Row>
        </HebForm.Item>
      </HebForm>
    </Spin>
  );
}

type HebFilterWithDrawerProps = HebFilterProps & {
  onClose: (...args) => any;
  isVisible?: boolean;
};

const WithDrawer = ({onClose, isVisible = false, ...props}: HebFilterWithDrawerProps) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 768px)"
  })
  const isBigScreen = useMediaQuery({query: "(min-device-width: 1824px)"});
  const isTabletOrMobile = useMediaQuery({query: "(max-width: 768px)"});
  const isTabletOrMobileDevice = useMediaQuery({query: "(max-device-width: 768px)"});
  const isLandscape = useMediaQuery({query: "(orientation: landscape)"});
  const isHugeScreen = isDesktopOrLaptop || isBigScreen || ((isTabletOrMobile || isTabletOrMobileDevice) && isLandscape);
  const placement = isHugeScreen ? "right" : "top";
  return (
    <HebDrawer visible={isVisible}
               placement={placement}
               width={
                 process.browser ? isHugeScreen ? window.outerWidth * 0.4 : window.innerWidth : 200
               }
               height={
                 process.browser ? isHugeScreen ? window.innerHeight : window.outerHeight * 0.9 : 100
               }
               onClose={onClose}>
      <HebFilter {...props}/>
    </HebDrawer>
  );
};

HebFilter.WithDrawer = WithDrawer;