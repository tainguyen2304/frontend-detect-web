import {
  CloseCircleOutlined,
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useRef, useState } from "react";
import styles from "./index.module.scss";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useMemo } from "react";
import {
  useAccount,
  useAuth,
  useClassList,
  useClassSectionList,
  useSubjectList,
} from "../../hooks";
import { dayOptions, lessonOptions, roomMasterData } from "../../constant/Enum";
import Select from "../../components/Select";
import Highlighter from "react-highlight-words";
import moment from "moment";

const ClassListSection = (props) => {
  const [form] = Form.useForm();
  const typeOfClassWatch = Form.useWatch("typeOfClass", form);
  const startDateWatch = Form.useWatch("startDate", form);
  const scheduleWatch = Form.useWatch("schedule", form);

  const [open, setOpen] = useState(false);
  const [idRecord, setIdRecord] = useState();
  const [searchText, setSearchText] = useState("");
  const [roomOptons, setRoomOptions] = useState(false);
  const [submitType, setSubmitType] = useState("create");
  const [recordEditing, setRecordEditing] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const {
    createClassSectionList,
    classSectionList,
    updateClassSection,
    deleteClassSection,
    isLoading,
  } = useClassSectionList();
  const { classList } = useClassList();
  const { subjectList } = useSubjectList();
  const { accountList } = useAccount();
  const { currentUser } = useAuth();

  const classListOptions = useMemo(
    () =>
      classList?.map((data) => ({
        label: data.className,
        value: data.id,
      })),
    [classList]
  );

  const subjectListOptions = useMemo(
    () =>
      subjectList?.map((data) => ({
        label: data.subject,
        value: data.id,
      })),
    [subjectList]
  );

  const accountListOptions = useMemo(
    () =>
      accountList?.map((data) => ({
        label: data.name,
        value: data.id,
      })),
    [accountList]
  );

  const disabledDate = (current) => {
    return current && current <= startDateWatch;
  };

  const handleChangeDays = (days) => {
    const prevData = scheduleWatch.map((data) => data.days);
    console.log(scheduleWatch);

    const selectedDays = dayOptions.filter((data) => days.includes(data.value));
    console.log(selectedDays);
    const scheduleInit = selectedDays.map((data) => {
      return prevData.includes(data.value)
        ? scheduleWatch.find((a) => a.days === data.value)
        : {
            days: data.value,
            lessones: [],
          };
    });

    // console.log(scheduleInit);

    form.setFieldValue("schedule", scheduleInit);
  };

  const handleChangeTypeOfClass = (e) => {
    setRoomOptions(roomMasterData[e.target.value]);
  };

  const showDrawer = () => {
    setSubmitType("create");
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, textColumn) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm lớp học phần`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Làm mới
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Thoát
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      textColumn(record[dataIndex].toString())
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={textColumn(text) ? textColumn(text).toString() : ""}
        />
      ) : (
        <Typography.Text ellipsis={{ tooltip: true }}>
          {textColumn(text)}
        </Typography.Text>
      ),
  });

  const handleOk = (record) => {
    if (!isLoading && record?.id !== undefined) {
      deleteClassSection.mutate(record.id);
      setIdRecord("");
    }
  };

  const handleCancel = () => {
    setIdRecord("");
  };

  const handleEdit = ({ startDate, endDate, ...record }) => {
    form.setFieldsValue({
      ...record,
      startDate: moment(startDate),
      endDate: moment(endDate),
    });
    setRecordEditing(record);
    setSubmitType("update");
    setOpen(true);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "no",
      key: "no",
      width: 100,
      fixed: "left",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Giảng viên phụ trách",
      dataIndex: "lecturerId",
      key: "lecturerId",
      width: 170,
      ...getColumnSearchProps(
        "lecturerId",
        (text) => accountList?.find((data) => data.id === text)?.name
      ),
    },
    {
      title: "Tên lớp học",
      dataIndex: "classNameId",
      key: "classNameId",
      width: 150,
      ...getColumnSearchProps(
        "classNameId",
        (text) => classList?.find((data) => data.id === text)?.className
      ),
    },
    {
      title: "Tên môn",
      dataIndex: "subjectId",
      key: "subjectId",
      width: 150,
      ...getColumnSearchProps(
        "subjectId",
        (text) => subjectList?.find((data) => data.id === text)?.subject
      ),
    },
    {
      title: "Sỉ số",
      dataIndex: "classSize",
      key: "classSize",
      width: 200,
    },
    {
      title: "Thời khóa biểu",
      dataIndex: "schedule",
      key: "schedule",
      width: 250,
      render: (schedules) =>
        schedules?.map(({ days, lessones }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "2px",
            }}
          >
            <div style={{ fontWeight: 700 }}>
              {dayOptions.find((data) => data.value === days)?.label}:{" "}
            </div>
            <div style={{ marginLeft: "10px" }}>
              {lessonOptions
                .filter((data) => lessones.includes(data.value))
                .map((data) => (
                  <span>{data.label}, </span>
                ))}
            </div>
          </div>
        )),
    },
    {
      title: "Số buổi học",
      dataIndex: "sessionNumber",
      key: "sessionNumber",
      width: 200,
    },
    {
      title: "Loại phòng học",
      dataIndex: "typeOfClass",
      key: "typeOfClass",
      width: 200,
    },
    {
      title: "Phòng học",
      dataIndex: "room",
      key: "room",
      width: 200,
    },
    {
      title: "Thao tác",
      dataIndex: "acitons",
      key: "acitons",
      width: 100,
      fixed: "right",
      render: (text, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditFilled />}
              onClick={() => handleEdit(record)}
            ></Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteFilled />}
              onClick={() => setIdRecord(record.id)}
              danger
            ></Button>
            <Modal
              title={
                <div>
                  <ExclamationCircleOutlined />
                  Xác nhận
                </div>
              }
              open={record.id === idRecord}
              onOk={() => handleOk(record)}
              onCancel={handleCancel}
              className={styles.modalDelete}
              okText="Xóa"
              cancelText="Hủy"
            >
              <p>Bạn có muốn xóa tài khoản này không?</p>
            </Modal>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handFinishFailed = (e) => {
    console.log(e);
  };

  const handleFinish = ({ id, startDate, endDate, ...values }) => {
    const dataRed = {
      ...values,
      lecturerId: currentUser.localId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    if (submitType === "create") {
      if (
        classSectionList.find(
          (data) =>
            data.classNameId === values.classNameId &&
            data.subjectId === values.subjectId
        )
      ) {
        toast.error("Lớp học phần đã tồn tại!");
        return;
      }
      createClassSectionList.mutate({ id: uuidv4(), ...dataRed });
    } else {
      if (
        classSectionList
          .filter(
            (data) =>
              data.classNameId !== recordEditing.classNameId ||
              data.subjectId !== recordEditing.subjectId
          )
          .find(
            (data) =>
              data.classNameId === values.classNameId &&
              data.subjectId === values.subjectId
          )
      ) {
        toast.error("Lớp học phần đã tồn tại!");
        return;
      }
      updateClassSection.mutate({ id, data: dataRed });
      setOpen(false);
    }

    setRecordEditing(null);
    form.resetFields();
  };

  return (
    <div className={styles.classList}>
      <div className={styles.header}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showDrawer}
          style={{ backgroundColor: "#001529" }}
        >
          Thêm lớp học phần
        </Button>
      </div>
      <Table
        size="small"
        loading={isLoading}
        className={styles.table}
        bordered
        columns={columns}
        dataSource={classSectionList?.map((data, index) => ({
          no: index + 1,
          ...data,
        }))}
        scroll={{
          x: "max-content",
          y: "calc(100vh - 340px)",
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              handleEdit(record);
            },
          };
        }}
      />
      <Drawer
        width={500}
        title={
          submitType === "create"
            ? "Thêm lớp học phần"
            : "Cập nhật lớp học phần"
        }
        open={open}
        onClose={onClose}
        className={styles.classDrawer}
        footer={
          <div className={styles.footer}>
            <Space>
              <Button
                style={{ backgroundColor: "#001529" }}
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => form.submit()}
              >
                Lưu
              </Button>
              <Button
                icon={<CloseCircleOutlined />}
                onClick={showDrawer}
                danger
              >
                Hủy
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          name="class"
          initialValues={{
            classNameId: null,
            subjectId: null,
            lecturerId: null,
            room: null,
            classSize: "",
            sessionNumber: "",
            typeOfClass: "",
            startDate: null,
            endDate: null,
            schedule: [],
          }}
          onFinish={handleFinish}
          onFinishFailed={handFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="id" hidden></Form.Item>

          <Form.Item
            label="Tên lớp học"
            name="classNameId"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn lớp học",
              },
            ]}
          >
            <Select placeholder="Chọn lớp học" options={classListOptions} />
          </Form.Item>

          <Form.Item
            label="Tên môn học"
            name="subjectId"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Vui lòng chọn môn học",
              },
            ]}
          >
            <Select placeholder="Chọn môn học" options={subjectListOptions} />
          </Form.Item>

          <Form.Item
            label="Sỉ số lớp "
            name="classSize"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập sỉ số",
              },
              {
                validator(_, value) {
                  if (value < 20 && value) {
                    return Promise.reject(
                      new Error("Tối thiểu 20 người mới được mở lớp")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập sỉ số lớp"
            />
          </Form.Item>
          <Form.Item
            label="Từ ngày"
            name="startDate"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD-MM-YYYY"
              placeholder="Từ ngày"
            />
          </Form.Item>
          <Form.Item
            label="Đến ngày"
            name="endDate"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày",
              },
            ]}
          >
            <DatePicker
              disabledDate={disabledDate}
              style={{ width: "100%" }}
              format="DD-MM-YYYY"
              placeholder="Dến ngày"
            />
          </Form.Item>

          <Form.Item
            label="Số buổi học"
            name="sessionNumber"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số buổi học",
              },
              // {
              //   validator(_, value) {
              //     if (value < 12 && value) {
              //       return Promise.reject(
              //         new Error("Tối thiểu 12 buổi mới được mở lớp")
              //       );
              //     }
              //     return Promise.resolve();
              //   },
              // },
            ]}
          >
            <InputNumber
              min={12}
              max={17}
              style={{ width: "100%" }}
              placeholder="Nhập số buổi học"
            />
          </Form.Item>

          <Form.Item
            label="Loại phòng học"
            name="typeOfClass"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại phòng học",
              },
            ]}
          >
            <Radio.Group onChange={handleChangeTypeOfClass}>
              <Radio value="Lý thuyết">Lý thuyết</Radio>
              <Radio value="Thực hành">Thực hành</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Phòng học"
            name="room"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn phòng học",
              },
            ]}
          >
            <Select
              placeholder="Chọn phòng học"
              options={roomOptons}
              disabled={!typeOfClassWatch}
            />
          </Form.Item>

          <Form.Item
            label="Thời khóa biểu"
            name="days"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn thời khóa biểu",
              },
            ]}
          >
            <Select
              mode="multiple"
              onChange={handleChangeDays}
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Chọn thời khóa biểu"
              options={dayOptions}
            />
          </Form.Item>

          <Form.List
            name="schedule"
            rules={[
              {
                validator: async (_, schedule) => {
                  if (!schedule || schedule.length < 1) {
                    return Promise.reject(
                      new Error("Vui lòng thêm thời khóa biểu.")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Form.Item
                      {...restField}
                      style={{ width: "50%" }}
                      label="Ngày dạy trong tuần"
                      name={[name, "days"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ngày dạy trong tuần",
                        },
                      ]}
                    >
                      <Select
                        onChange={handleChangeDays}
                        allowClear
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn ngày dạy trong tuần"
                        options={dayOptions}
                        disabled
                        preF
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      style={{ width: "46%" }}
                      label="Tiết dạy"
                      name={[name, "lessones"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn tiết dạy",
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn tiết dạy"
                        options={lessonOptions}
                      />
                    </Form.Item>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Drawer>
    </div>
  );
};

export default ClassListSection;
