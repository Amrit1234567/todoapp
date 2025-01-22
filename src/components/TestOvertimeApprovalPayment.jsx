import React, {
    useState,
    useContext,
    useEffect,
    useImperativeHandle,
  } from 'react';
  // import PropTypes from 'prop-types';
  import { Button, Tooltip, message, Tag } from 'antd';
  import { CheckOutlined } from '@ant-design/icons';
  import {
    getRandomColor,
    showError,
    useTableScroll,
    useNewState,
  } from 'helpers/utility';
  import * as ajax from 'helpers/ajax';
  import { UserContext } from 'components/Common/UserContext';
  import { useTranslation } from 'react-i18next';
  
  import PropTypes from 'prop-types';
  import { ConfirmDialog } from 'components/Common';
  import CustomImage from 'components/Common/CustomImage';
  import PreviewImage from 'components/Common/PreviewImage';
  import { DEFAULT_PAGE_SIZE } from 'components/Common/constants';
  import CustomFilterInline from 'components/Filters/CustomFilterInline';
  import { UserSettingContext } from 'components/Common/UserSettingContext';
  
  import { v4 as uuidv4 } from 'uuid';
  import { filterTypes, operatorOptions } from 'components/Filters/constants';
  
  import EmptyInfo from 'components/Common/EmptyInfo';
  import GridTableView from 'components/GridTableView';
  
  const getEmployeeOvertimePayments = (tenantCode, payload, callback) => {
    const url = `${window.BASE_URL}/${tenantCode}/api/v1/HumanResource/OvertimeRemunerationRules/GetApprovedEmployeeOvertime`;
    return ajax.post(url, payload, (resp) => {
      const { Results, ...rest } = resp;
      const datas = Results.map((x) => ({
        ...x,
        color: getRandomColor(),
      }));
      callback({ Results: datas, ...rest });
    });
  };
  
  const OvertimeApprovalPaymentTab = (props) => {
    const { forwardRef } = props;
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewURL, setPreviewURL] = useState();
    const [loading, setLoading] = useState(false);
  
    const {
      user: { tenantCode, branchID, isBranchBased },
    } = useContext(UserContext);
    const { userSetting } = useContext(UserSettingContext);
    const [filterCount, setFilterCount] = useState(1);
    const [initialFilters, setInitialFilters] = useState([]);
    const [filterItem, setFilterItem] = useState([]);
    const branchName = userSetting.Settings.BranchName;
    const { t } = useTranslation([
      'common',
      'otherIncomeDeductionSetting',
      'actionMenu',
      'employee',
    ]);
  
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0,
      hideOnSinglePage: true,
    });
  
    // filters
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [filter, setFilter] = useNewState({
      visible: false,
      total: 0,
      filters: [],
      dataSource: [
        {
          label: 'Department',
          value: 'DepartmentID',
          type: 'list',
          dataType: 'VARCHAR(50)',
          textField: 'Text',
          valueField: 'Value',
          ajax: {
            url: `${window.BASE_URL}/${tenantCode}/api/v1/Admin/Masters/GetDepartmentLookup?isEmployeeType=true`,
            method: 'get',
          },
        },
        {
          label: 'Designation',
          value: 'DesignationID',
          type: 'list',
          dataType: 'VARCHAR(50)',
          textField: 'Text',
          valueField: 'Value',
          ajax: {
            url: `${window.BASE_URL}/${tenantCode}/api/v1/Admin/Masters/GetDesignationLookup?categoryNo=3&isEmployeeType=true`,
            method: 'get',
          },
        },
        {
          label: 'Employee',
          value: 'EmployeeID',
          type: 'list',
          dataType: 'VARCHAR(50)',
          textField: 'FullName',
          valueField: 'EmployeeID',
          ajax: {
            url: `${window.BASE_URL}/${tenantCode}/api/v1/HumanResource/Employees/GetEmployeesForLookup?isEmployee=true`,
            method: 'get',
            filterAsYouType: {
              enabled: true,
              fieldName: 'FullName',
            },
          },
        },
        {
          label: t('employee:gender'),
          value: 'GenderID',
          type: filterTypes.LIST,
          dataType: 'INT',
          textField: 'Text',
          valueField: 'Value',
          ajax: {
            url: `${window.BASE_URL}/${tenantCode}/api/v1/Admin/Masters/GetGenderLookup`,
            method: 'get',
          },
        },
        {
          label: t('employee:maritalStatus'),
          value: 'MaritalStatusID',
          type: filterTypes.LIST,
          dataType: 'INT',
          textField: 'Text',
          valueField: 'Value',
          ajax: {
            url: `${window.BASE_URL}/${tenantCode}/api/v1/Admin/Masters/GetMaritalStatusLookup`,
            method: 'get',
          },
        },
        {
          label: t('employee:jobType'),
          value: 'JobTypeID',
          type: filterTypes.LIST,
          dataType: 'INT',
          textField: 'Text',
          valueField: 'Value',
          ajax: {
            url: `${window.BASE_URL}/${tenantCode}/api/v1/Admin/Masters/GetJobTypeLookup`,
            method: 'get',
          },
        },
        {
          label: t('employee:isHandicaped'),
          value: 'IsHandicaped',
          type: filterTypes.BOOLEAN,
          dataType: 'BIT',
        },
        {
          label: t('common:name'),
          value: 'BranchID',
          type: filterTypes.LIST,
          dataType: 'INT',
          textField: 'Text',
          valueField: 'Value',
          ajax: {
            url: `${window.BASE_URL}/${tenantCode}/api/v1/Admin/Masters/GetUserBranchLookup`,
            method: 'get',
          },
        },
      ],
    });
  
    const handleSave = (data) => {
      // handleChangePeriod();
      const items = [...dataSource];
      data.forEach((element) => {
        const index = items.findIndex(
          (elem) => elem.OverTimeRequestID === element.OverTimeRequestID
        );
        if (index === -1) {
          items.unshift(element);
        }
      });
      setDataSource(items);
    };
  
    useEffect(() => {
      const data = [
        {
          conjunction: 'and',
          groups: [
            {
              id: uuidv4(),
              conjunction: 'and',
              field: 'BranchID',
              dataType: 'INT',
              operator: operatorOptions.equals.value,
              title: `Branch equals ${branchName}`,
              valueLabel: branchName,
              values: [Number(branchID)],
            },
          ],
        },
      ];
      setInitialFilters(data);
      setFilterItem(data);
  
      const payload = {
        PageNr: 1,
        PageSize: DEFAULT_PAGE_SIZE,
        SortColumn: 'FullName',
        SortOrder: 'ascend',
        isEmployee: true,
        Filters: data,
      };
      setLoading(true);
      getEmployeeOvertimePayments(tenantCode, payload, (resp) => {
        setDataSource(resp.Results);
        setPagination({
          current: payload.PageNr,
          pageSize: payload.PageSize,
          total: resp.Total,
          hideOnSinglePage: true,
        });
      })
        .catch((error) => {
          showError(error);
        })
        .then(() => {
          setLoading(false);
        });
    }, [tenantCode, branchID, branchName]);
  
    const handlePaymentRow = (data) => {
      if (data.IsRejectBySupervisor) {
        showError(t('otherIncomeDeductionSetting:errRejected'));
        return;
      }
      if (data.IsApprovedBySupervisor === false) {
        message.info('otherIncomeDeductionSetting:errApprove');
        return;
      }
      if (data.IsApprovedForPayment === true) {
        message.info('otherIncomeDeductionSetting:errApprovepay');
        return;
      }
      const url = `${window.BASE_URL}/${tenantCode}/api/v1/HumanResource/OvertimeRemunerationRules/OvertimePaymentApproval`;
      setLoading(true);
      ajax
        .put(url, { key: data.OvertimeRequestID }, () => {
          const items = [...dataSource];
          const index = items.findIndex(
            (elem) => elem.OvertimeRequestID === data.OvertimeRequestID
          );
  
          if (index === -1) {
            items.unshift(data);
          } else {
            // data.IsApprovedForPayment=true;
            items[index] = data;
            items[index].IsApprovedForPayment = true;
          }
          setDataSource(items);
        })
        .catch((error) => {
          showError(error);
        })
        .then(() => {
          setLoading(false);
        });
    };
  
    useImperativeHandle(forwardRef, () => ({
      handleSave,
    }));
  
    const getAvatarUrl = (id) =>
      `${window.BASE_URL}/${tenantCode}/api/v1/Admin/Documents/GetThumbnail/${id}`;
  
    const handlePreviewImageModal = (id, isVisible) => {
      if (id === null || id === undefined) return;
      const url = `${window.BASE_URL}/${tenantCode}/api/v1/Admin/Documents/${id}`;
      setPreviewURL(url);
      setPreviewVisible(isVisible);
    };
  
    // Slab Tax
    // const getFilterColumn = (dataIndex, placeHolderText) =>
    //   new TableColumnFilter(dataIndex, placeHolderText);
    const columns = [
      {
        title: t('otherIncomeDeductionSetting:fullName'),
        dataIndex: 'FullName',
        sorter: true,
        render: (text, record) => (
          <CustomImage
            size={40}
            src={getAvatarUrl(record.ImageDocumentID)}
            name={record.FullName}
            imageId={record.ImageDocumentID}
            code={record.EmployeeCode}
            designation={record.Designation}
            color={record.color}
          />
        ),
      },
      {
        title: t('common:date'),
        dataIndex: 'OvertimeFromBS',
        sorter: true,
        // width: '100px',
        render: (text, record) =>
          `${record.OvertimeFromBS} - ${record.OvertimeToBS}`,
      },
      {
        title: t('otherIncomeDeductionSetting:noOfMinutesEachDay'),
        dataIndex: 'NoOfMinutesEachDay',
        sorter: true,
        // width: '100px',
      },
      {
        title: t('otherIncomeDeductionSetting:approveDate'),
        dataIndex: 'ApproveFromBS',
        sorter: true,
        // width: '100px',
        render: (text, record) =>
          `${record.ApproveFromBS} - ${record.ApproveToBS}`,
      },
      {
        title: t('otherIncomeDeductionSetting:perDay'),
        dataIndex: 'ApprovedMinutesEachDay',
        sorter: true,
        // width: '100px',
      },
  
      {
        title: t('otherIncomeDeductionSetting:status'),
        render: (text, record) => {
          // eslint-disable-next-line
          const status = record.IsApprovedBySupervisor
            ? 'Approved'
            : record.IsRejectBySupervisor
              ? 'Rejected'
              : 'Pending';
          return status;
        },
      },
      {
        title: t('otherIncomeDeductionSetting:isApprovedForPayment'),
        render: (text, record) => {
          const status = record.IsApprovedForPayment ? 'Approved' : 'Pending';
          return status;
        },
      },
      // {
      //   title: t('otherIncomeDeductionSetting:isApprovedForPayment'),
      //   dataIndex: 'IsApprovedForPayment',
      //   render: (val) => <Checkbox checked={val} disabled />,
      // },
      {
        title: t('common:status'),
        dataIndex: 'Active',
        sorter: true,
        render: (isActive) => {
          const color = isActive ? 'green' : 'red';
          const status = isActive ? t('common:active') : t('common:inactive');
          return (
            <Tag color={color} className="ant-tag-status-tag">
              {status}
            </Tag>
          );
        },
      },
      {
        title: t('common:actions'),
        dataIndex: 'Action',
        width: '90px',
        render: (text, record) => (
          <Button.Group>
            <Tooltip
              placement="topLeft"
              title={t('common:approve', {
                pageName: t('otherIncomeDeductionSetting:overtime'),
              })}
            >
              <ConfirmDialog
                placement="left"
                message={t('otherIncomeDeductionSetting:confirmPayment')}
                onConfirm={() => handlePaymentRow(record)}
              >
                <Button
                  type="primary"
                  size="medium"
                  shape="circle"
                  disabled={
                    record.IsApprovedForPayment || record.IsRejectBySupervisor
                  }
                >
                  <CheckOutlined />
                </Button>
              </ConfirmDialog>
            </Tooltip>
          </Button.Group>
        ),
      },
    ];
  
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedKeys) => {
        setSelectedRowKeys(selectedKeys);
      },
      getCheckboxProps: (record) => ({
        disabled: record.IsApprovedForPayment || record.IsRejectBySupervisor, // Column configuration not to be checked
        // name: record.name,
      }),
    };
  
    const handleTableChange = (paging, filter, sorter) => {
      const payload = {
        PageNr: paging.current,
        PageSize: paging.pageSize,
        SortColumn: sorter.field || 'FullName',
        SortOrder: sorter.order || 'ascend',
        Filters: filterItem,
        IsEmployee: true,
      };
      setLoading(true);
      getEmployeeOvertimePayments(tenantCode, payload, (resp) => {
        setDataSource(resp.Results);
        setPagination({
          current: payload.current,
          pageSize: payload.PageSize,
          total: resp.Total,
          hideOnSinglePage: true,
        });
        setLoading(false);
      })
        .catch((error) => {
          showError(error);
        })
        .then(() => {
          setLoading(false);
        });
    };
  
    const onApplyFilter = (filters, count) => {
      setFilterCount(count);
      setFilterItem(filters);
      const payload = {
        PageNr: 1,
        PageSize: DEFAULT_PAGE_SIZE,
        SortColumn: 'FullName',
        SortOrder: 'ascend',
        IsEmployee: true,
        Filters: filters,
      };
      setLoading(true);
      getEmployeeOvertimePayments(tenantCode, payload, (resp) => {
        setDataSource(resp.Results);
        setPagination({
          current: payload.PageNr,
          pageSize: payload.PageSize,
          total: resp.Total,
          hideOnSinglePage: true,
        });
      })
        .catch((error) => {
          showError(error);
        })
        .then(() => {
          setLoading(false);
        });
    };
  
    const handleFilter = () => {
      setDrawerVisible(true);
    };
  
    return (
      <div>
        <div className="filter-content">
          <div>
            <CustomFilterInline
              open={filter.visible}
              onFilter={onApplyFilter}
              data={filter.dataSource}
              primaryFilter={{
                placeholder: t('common:name'),
                filters: [
                  {
                    fieldName: 'FullName',
                    fieldColumn: 'FullName',
                    fieldType: filterTypes.TEXT,
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="filter-selection">
          <GridTableView
            rowKey="OvertimeRequestID"
            size="small"
            showSorterTooltip={false}
            dataSource={dataSource}
            columns={columns}
            rowSelection={rowSelection}
            loading={loading}
            onChange={handleTableChange}
            pagination={pagination}
            scroll={useTableScroll(dataSource)}
            locale={{
              emptyText: (
                <EmptyInfo
                  image=""
                  description={t('common:listOf', {
                    pageName: t('otherIncomeDeductionSetting:overtime'),
                  })}
                />
              ),
            }}
          />
  
          {/* </div> */}
        </div>
        {previewVisible && (
          <PreviewImage
            src={previewURL}
            modalVisible={previewVisible}
            handlePreviewImageModal={handlePreviewImageModal}
          />
        )}
      </div>
    );
  };
  OvertimeApprovalPaymentTab.propTypes = {
    // onEarningDeductionEdit: PropTypes.func,
    forwardRef: PropTypes.any,
  };
  export default OvertimeApprovalPaymentTab;
  