import {
  DeleteFilled,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Image,
  Input,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
import styles from "./index.module.scss";
import { useAccount, useAttendance, useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";
import Route from "../../constant/Route";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { useRef } from "react";
import { lessonOptions } from "../../constant/Enum";

const AttendanceList = (props) => {
  const navigate = useNavigate();

  const { accountList } = useAccount();
  const { isLoading, attendanceList, deleteAttendance } = useAttendance();

  const [idRecord, setIdRecord] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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
      deleteAttendance.mutate(record.id);
      setIdRecord("");
    }
  };

  const handleCancel = () => {
    setIdRecord("");
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "no",
      key: "no",
      width: 50,
      fixed: "left",
      align: "center",
    },
    {
      title: "Giảng viên diểm danh",
      dataIndex: "lecturerId",
      key: "lecturerId",
      width: 200,
      ...getColumnSearchProps(
        "lecturerId",
        (text) => accountList?.find((data) => data.id === text)?.name
      ),
    },
    {
      title: "Lớp học phần",
      dataIndex: "classSectionName",
      key: "classSectionName",
      width: 200,
      ...getColumnSearchProps("classSectionName", (text) => text),
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 100,
    },
    {
      title: "Loại phòng",
      dataIndex: "typeOfClass",
      key: "typeOfClass",
      width: 100,
    },
    {
      title: "Thời gian điểm danh",
      dataIndex: "statisticalDay",
      key: "statisticalDay",
      width: 150,
      render: (text) =>
        text && (
          <Typography.Text ellipsis={{ tooltip: true }}>
            {moment(text).format("DD-MM-YYYY")}
          </Typography.Text>
        ),
    },
    {
      title: "Thứ tự tiết học",
      dataIndex: "lesson",
      key: "lesson",
      width: 150,
      render: (text) => {
        const result = lessonOptions.find((data) => data.value === text)?.label;
        return (
          <Typography.Text ellipsis={{ tooltip: true }}>
            {result}
          </Typography.Text>
        );
      },
    },

    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      align: "center",
      render: (url) => <Image src={url} width={100} />,
    },
    {
      title: "Loại điểm danh",
      dataIndex: "modelDetect",
      key: "modelDetect",
      width: 150,
      render: (text) => (
        <Typography.Text ellipsis={{ tooltip: true }}>
          {text === "face" ? "Dựa trên khuôn mặt" : "Dựa trên thân hình"}
        </Typography.Text>
      ),
    },
    {
      title: "Sỉ số",
      dataIndex: "classSize",
      key: "classSize",
      width: 100,
    },
    {
      title: "Hiện diện",
      dataIndex: "presence",
      key: "presence",
      width: 100,
    },
    {
      title: "Phần trăm hiện diện",
      dataIndex: "percentPresent",
      key: "percentPresent",
      width: 150,
      render: (text, record) => {
        const result = (record?.presence / record?.classSize) * 100;
        return `${result.toFixed()} %`;
      },
    },
    {
      title: "Tổng kết",
      dataIndex: "summaryStatus",
      key: "summaryStatus",
      width: 100,
      render: (text, record) => <div>{`${text}: ${record.summaryNumber}`}</div>,
    },
    {
      title: "Thao tác",
      dataIndex: "classSize",
      key: "classSize",
      width: 100,
      fixed: "right",
      render: (text, record) => (
        <Space>
          {/* <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditFilled />}
              onClick={() => handleEdit(record)}
            ></Button>
          </Tooltip> */}
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
              <p>
                Lịch sử này sẽ bị xóa <b>vĩnh viễn</b> khỏi hệ thống!
              </p>
              <p>Bạn có muốn xóa lịch sử này không?</p>
            </Modal>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.attendanceList}>
      <div className={styles.header}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(Route.Homepage)}
          style={{ backgroundColor: "#001529" }}
        >
          Điểm danh
        </Button>
      </div>
      <Table
        size="small"
        loading={isLoading}
        className={styles.table}
        bordered
        columns={columns}
        dataSource={attendanceList?.map((data, index) => ({
          no: index + 1,
          ...data,
        }))}
        scroll={{
          x: "max-content",
          y: "calc(100vh - 340px)",
        }}
      />
    </div>
  );
};

export default AttendanceList;
