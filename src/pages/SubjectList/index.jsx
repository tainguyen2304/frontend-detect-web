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
  InputNumber,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useRef, useState } from "react";
import styles from "./index.module.scss";
import { v4 as uuidv4 } from "uuid";
import useSubjectList from "../../hooks/api/useSubjectList";
import { toast } from "react-toastify";
import Select from "../../components/Select";
import { subjectOptions } from "../../constant/Enum";
import Highlighter from "react-highlight-words";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const SubjectList = (props) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [idRecord, setIdRecord] = useState();
  const [submitType, setSubmitType] = useState("create");
  const [recordEditing, setRecordEditing] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const {
    createSubject,
    subjectList,
    isLoading,
    updateSubject,
    deleteSubject,
    showSubject,
  } = useSubjectList();

  const showDrawer = () => {
    setSubmitType("create");
    setOpen(true);
  };

  const handleOk = ({ id, ...values }) => {
    if (!isLoading && id !== undefined) {
      deleteSubject.mutate({ id, data: { ...values, isActive: false } });

      setIdRecord("");
    }
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

  const handleCancel = () => {
    setIdRecord("");
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
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
      title: "Tên môn",
      dataIndex: "subject",
      key: "subject",
      width: 300,
      ...getColumnSearchProps("subject", (text) => text),
    },
    {
      title: "Số tiết",
      dataIndex: "numberOfLessons",
      key: "numberOfLessons",
      width: 250,
    },
    {
      title: "Thuộc bộ môn",
      dataIndex: "bySubjects",
      key: "bySubjects",
      width: 250,
      render: (text) =>
        subjectOptions.find((data) => data.value === text)?.label,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
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
                  Ẩn môn học sẽ ẩn những <b> lớp học phần</b> về môn học này.
                </p>
                <p>Bạn có muốn ẩn môn học không?</p>
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
                  showSubject.mutate({
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
        subjectList.find(
          (data) =>
            data.subject.toUpperCase().replaceAll(" ") ===
            values.subject.toUpperCase().replaceAll(" ")
        )
      ) {
        toast.error("Môn học đã tồn tại!");
        return;
      }
      createSubject.mutate({ id: uuidv4(), ...values });
    } else {
      if (
        subjectList
          .filter(
            (data) =>
              data.subject.toUpperCase().replaceAll(" ") !==
              recordEditing.subject.toUpperCase().replaceAll(" ")
          )
          .find(
            (data) =>
              data.subject.toUpperCase().replaceAll(" ") ===
              values.subject.toUpperCase().replaceAll(" ")
          )
      ) {
        toast.error("Môn học đã tồn tại!");
        return;
      }
      updateSubject.mutate({ id, data: values });
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
          Thêm môn học
        </Button>
      </div>
      <Table
        size="small"
        loading={isLoading}
        className={styles.table}
        bordered
        columns={columns}
        dataSource={subjectList?.map((data, index) => ({
          no: index + 1,
          ...data,
        }))}
        scroll={{
          x: "max-content",
          y: "calc(100vh - 170px)",
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
            subject: "",
          }}
          onFinish={handleFinish}
          onFinishFailed={handFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="id" hidden></Form.Item>
          <Form.Item
            label="Tên môn học"
            name="subject"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Vui lòng nhập tên môn học",
              },
            ]}
          >
            <Input placeholder="Nhập tên môn học" />
          </Form.Item>
          <Form.Item
            label="Số tiết"
            name="numberOfLessons"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số tiết",
              },
            ]}
          >
            <InputNumber
              min={30}
              max={135}
              placeholder="Nhập số tiết"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Bộ môn"
            name="bySubjects"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn bộ môn!",
              },
            ]}
          >
            <Select options={subjectOptions} placeholder="Chọn bộ môn" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default SubjectList;
