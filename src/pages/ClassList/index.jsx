import {
  CloseCircleOutlined,
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useMemo, useState } from "react";
import styles from "./index.module.scss";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useAccount, useClassList } from "../../hooks";
import { schoolYearOptions } from "../../constant/Enum";
import Select from "../../components/Select";
import { useRef } from "react";
import Highlighter from "react-highlight-words";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const ClassList = (props) => {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [idRecord, setIdRecord] = useState();
  const [submitType, setSubmitType] = useState("create");
  const [recordEditing, setRecordEditing] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const { accountList } = useAccount();
  const {
    createClass,
    classList,
    isLoading,
    deleteClasses,
    updateClasses,
    showClasses,
  } = useClassList();

  const showDrawer = () => {
    setSubmitType("create");
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleOk = ({ id, ...values }) => {
    if (!isLoading && id !== undefined) {
      deleteClasses.mutate({ id, data: { ...values, isActive: false } });
      setIdRecord("");
    }
  };

  const handleCancel = () => {
    setIdRecord("");
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setRecordEditing(record);
    setSubmitType("update");
    setOpen(true);
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

  const accountListOptions = useMemo(
    () =>
      accountList?.map((data) => ({
        label: data.name,
        value: data.id,
      })),
    [accountList]
  );

  const columns = [
    {
      title: "STT",
      dataIndex: "no",
      key: "no",
      width: 50,
      fixed: "left",
    },
    {
      title: "Tên lớp học",
      dataIndex: "className",
      key: "className",
      width: 200,
      ...getColumnSearchProps("className", (text) => text),
    },
    {
      title: "Giảng viên chủ nhiệm",
      dataIndex: "lecturerId",
      key: "lecturerId",
      width: 200,
      fixed: "left",
      render: (text) => accountList?.find((data) => data.id === text)?.name,
    },
    {
      title: "Niên khóa",
      dataIndex: "schoolYear",
      key: "schoolYear",
      width: 100,
      render: (text) =>
        schoolYearOptions.find((data) => data.value === text)?.label,
    },

    {
      title: "Thao tác",
      dataIndex: "classSize",
      key: "classSize",
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
          {record.isActive ? (
            <Tooltip title="Ẩn">
              <Button
                type="text"
                icon={
                  <RemoveCircleIcon style={{ width: "20px", height: "20px" }} />
                }
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
                <p>
                  Ẩn lớp học sẽ ẩn những <b> lớp học phần</b> thuộc về lớp học
                  này.
                </p>
                <p>Bạn có muốn ẩn lớp học không?</p>
              </Modal>
            </Tooltip>
          ) : (
            <Tooltip title="Hiện">
              <Button
                type="primary"
                ghost
                style={{
                  border: "none",
                }}
                icon={
                  <AddCircleIcon
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                  />
                }
                onClick={() =>
                  showClasses.mutate({
                    id: record.id,
                    data: { ...record, isActive: true },
                  })
                }
              ></Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handFinishFailed = (e) => {
    console.log(e);
  };

  const handleFinish = ({ id, ...values }) => {
    if (submitType === "create") {
      if (
        classList.find(
          (data) =>
            data.className.toUpperCase().replaceAll(" ", "") ===
            values.className.toUpperCase().replaceAll(" ", "")
        )
      ) {
        toast.error("Tên lớp đã tồn tại!");
        return;
      }
      createClass.mutate({ id: uuidv4(), ...values, isActive: true });
    } else {
      if (
        classList
          ?.filter(
            (data) =>
              data.className.toUpperCase().replaceAll(" ") !==
              recordEditing.className.toUpperCase().replaceAll(" ")
          )
          .find(
            (data) =>
              data.className.toUpperCase().replaceAll(" ") ===
              values.className.toUpperCase().replaceAll(" ")
          )
      ) {
        toast.error("Môn học đã tồn tại!");
        return;
      }
      updateClasses.mutate({ id, data: values });
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
          Thêm lớp
        </Button>
      </div>
      <Table
        size="small"
        loading={isLoading}
        className={styles.table}
        bordered
        columns={columns}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              handleEdit(record);
            },
          };
        }}
        dataSource={classList?.map((data, index) => ({
          no: index + 1,
          ...data,
        }))}
        scroll={{
          x: "100%",
          y: "calc(100vh - 340px)",
        }}
      />
      <Drawer
        title={submitType === "create" ? "Thêm lớp học" : "Cập nhật lớp học"}
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
            className: "",
            schoolYear: null,
          }}
          onFinish={handleFinish}
          onFinishFailed={handFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="id" hidden></Form.Item>
          <Form.Item
            label="Tên lớp học"
            name="className"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Vui lòng nhập tên lớp học",
              },
            ]}
          >
            <Input placeholder="Nhập tên lớp học" />
          </Form.Item>{" "}
          <Form.Item
            label="Niên khóa"
            name="schoolYear"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Vui lòng chọn niên khóa",
              },
            ]}
          >
            <Select options={schoolYearOptions} placeholder="Chọn niên khóa" />
          </Form.Item>
          <Form.Item
            label="Giảng viên chủ nhiệm"
            name="lecturerId"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn giảng viên chủ nhiệm",
              },
            ]}
          >
            <Select
              placeholder="Chọn giảng viên chủ nhiệm"
              options={accountListOptions}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ClassList;
