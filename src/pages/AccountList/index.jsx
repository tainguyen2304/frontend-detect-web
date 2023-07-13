import {
  CloseCircleOutlined,
  DeleteFilled,
  EditFilled,
  PlusOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
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
import React, { useState } from "react";
import styles from "./index.module.scss";
import { facultyOptions, subjectOptions } from "../../constant/Enum";
import { toast } from "react-toastify";
import { useAccount } from "../../hooks";
import md5 from "md5";
import Select from "../../components/Select";
import { useRef } from "react";
import Highlighter from "react-highlight-words";

const AccountList = (props) => {
  const [form] = Form.useForm();

  const searchInput = useRef(null);
  const [open, setOpen] = useState(false);
  const [idRecord, setIdRecord] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [submitType, setSubmitType] = useState("create");

  const {
    accountList,
    createAccount,
    deleteAccount,
    updateAccount,
    isLoading,
  } = useAccount();

  const handleOk = (record) => {
    if (!isLoading && record?.id !== undefined) {
      deleteAccount.mutate({
        email: record.email,
        password: record.password,
      });
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

  const showDrawer = () => {
    setSubmitType("create");
    setOpen(true);
  };

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
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
      title: "Tên giáo viên",
      dataIndex: "name",
      key: "name",
      width: 250,
      fixed: "left",
      ...getColumnSearchProps("name", (text) => text),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 250,
    },
    {
      title: "Thuộc khoa",
      dataIndex: "faculty",
      key: "faculty",
      width: 250,
      render: (text) =>
        facultyOptions.find((data) => data.value === text)?.label,
    },
    {
      title: "Thuộc bộ môn",
      dataIndex: "subject",
      key: "subject",
      width: 250,
      render: (text) =>
        subjectOptions.find((data) => data.value === text)?.label,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      key: "password",
      width: 250,
      render: (text) => (
        <Input.Password className={styles.password} value={text.slice(0, 8)} />
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
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

  const handleFinish = ({ confirm, id, ...values }) => {
    if (
      accountList?.find(
        (data) =>
          data?.email?.toUpperCase()?.replaceAll(" ", "") ===
          values?.email?.toUpperCase()?.replaceAll(" ", "")
      )
    ) {
      toast.error("Email đã tồn tại!");
      return;
    }

    try {
      if (submitType === "create") {
        // createAccount.mutate({ ...values, password: md5(values.password) });
        createAccount.mutate({ ...values, password: values.password });
      } else {
        updateAccount.mutate({ id, data: values });
        setOpen(false);
      }
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.accountList}>
      <div className={styles.header}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showDrawer}
          style={{ backgroundColor: "#001529" }}
        >
          Thêm tài khoản
        </Button>
      </div>
      <Table
        size="small"
        loading={isLoading}
        className={styles.table}
        bordered
        columns={columns}
        dataSource={accountList?.map((data, index) => ({
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
        title={
          submitType === "create" ? "Thêm tài khoản" : "Cập nhật tài khoản"
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
                {submitType === "create" ? "Lưu" : "Cập nhật"}
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
            faculty: null,
            name: "",
            phone: "",
            email: "",
            password: "",
            confirm: "",
          }}
          onFinish={handleFinish}
          onFinishFailed={handFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="id" hidden></Form.Item>
          <Form.Item
            label="Khoa"
            name="faculty"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn khoa!",
              },
            ]}
          >
            <Select options={facultyOptions} placeholder="Chọn khoa" />
          </Form.Item>

          <Form.Item
            label="Bộ môn"
            name="subject"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn bộ môn!",
              },
            ]}
          >
            <Select options={subjectOptions} placeholder="Chọn bộ môn" />
          </Form.Item>

          <Form.Item
            label="Tên giáo viên"
            name="name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Vui lòng nhập tên giáo viên!",
              },
            ]}
          >
            <Input placeholder="Nhập tên giáo viên" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại!",
              },
              {
                pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                message: "Vui lòng nhập số điện thoại hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          {submitType === "create" && (
            <>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    type: "email",
                    message: "Vui lòng nhập email hợp lệ!",
                  },

                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (
                        accountList.find(
                          (data) => data.email === getFieldValue("email")
                        )
                      ) {
                        return Promise.reject("Email đã tồn tại");
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Vui lòng nhập mật khẩu",
                  },
                  {
                    min: 6,
                    message: "Mật khẩu có ít nhất 6 kí tự",
                  },
                ]}
                hasFeedback
                className={styles.passWordInput}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Nhập lại mật khẩu"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lại mật khẩu",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Hai mật khẩu không trùng nhau!");
                    },
                  }),
                ]}
                className={styles.passWordInput}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>
            </>
          )}
        </Form>
      </Drawer>
    </div>
  );
};

export default AccountList;
