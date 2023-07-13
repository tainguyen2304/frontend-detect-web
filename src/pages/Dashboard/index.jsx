import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./index.module.scss";
import { Col, Empty, Row, Typography } from "antd";
import {
  useAccount,
  useAttendance,
  useClassList,
  useClassSectionList,
  useSubjectList,
} from "../../hooks";
import { useState } from "react";
import Select from "../../components/Select";
import moment from "moment";
const { Option } = Select;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  animations: {
    tension: {
      duration: 1000,
      easing: "linear",
      from: 1,
      to: 0,
      loop: true,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ thống kê số lượng sinh viên hiện diện ",
    },
  },
};

const Dashboard = () => {
  const [labels, setLabels] = useState([]);
  const [frequency, setFrequency] = useState([]);
  const [wholesale, setWholesale] = useState([]);
  const [averageFrequency, setAverageFrequency] = useState([]);
  const [averagePresence, setAveragePresence] = useState(null);
  const [averagePercent, setAveragePercent] = useState(null);

  const { classList } = useClassList();
  const { subjectList } = useSubjectList();
  const { attendanceList } = useAttendance();
  const { classSectionList } = useClassSectionList();
  const { accountList } = useAccount();

  const handleChange = (value) => {
    const classSelected = classSectionList?.find((data) => data.id === value);
    const attendancedList = attendanceList?.reduce(
      (prev, cur) =>
        cur.classSectionId === value ? [...prev, cur.presence] : prev,
      []
    );

    const labels = attendanceList.reduce(
      (prev, cur) =>
        cur.classSectionId === value
          ? [...prev, moment(cur.statisticalDay).format("DD-MM-YYYY")]
          : prev,
      []
    );

    const averagePresence =
      attendancedList.reduce((prev, cur) => prev + cur, 0) /
      attendancedList.length;

    const averageFrequency = [];
    if (classSelected) {
      for (let index = 0; index < classSelected.sessionNumber; index++) {
        averageFrequency.push(Math.round(averagePresence));
      }
      setLabels(labels);
      setFrequency(attendancedList);
      setAverageFrequency(averageFrequency);
      setWholesale(classSelected?.classSize);
      if (!isNaN(averagePresence)) {
        setAveragePresence(Math.round(averagePresence));
        const averagePercent =
          (Math.round(averagePresence) / classSelected.classSize) * 100;
        setAveragePercent(`${averagePercent.toFixed()} %`);
      } else {
        setAveragePresence(null);
        setAveragePercent(null);
      }
    } else {
      setAveragePresence(null);
      setAveragePercent(null);
      setFrequency([]);
      setWholesale(null);
    }
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Số lượng sinh viên hiện diện",
        data: frequency,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Trung bình số lượng sinh viên hiện diện",
        data: averageFrequency,
        borderColor: "rgb(53, 235, 96)",
        backgroundColor: "rgba(53, 235, 96, 0.5)",
      },
    ],
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <label>Xem theo: </label>

        <Select
          showSearch
          filterOption={(search, item) =>
            item?.className?.toLowerCase()?.indexOf(search?.toLowerCase()) >=
              0 ||
            item?.lecturerName?.toLowerCase()?.indexOf(search?.toLowerCase()) >=
              0 ||
            item?.subjectName?.toLowerCase()?.indexOf(search?.toLowerCase()) >=
              0
          }
          onChange={handleChange}
          optionLabelProp="label"
          placeholder="Chọn lớp học phần"
          className={styles.classSessionSelect}
          popupClassName={styles.popupClassnameClassSession}
          dropdownRender={(originNode) => (
            <div className={styles.selectDropdownWrapper}>
              <Row className={styles.classSectionTitleWrapper} gutter={16}>
                <Col className={styles.classSectionTitle} span={4}>
                  Giảng viên phụ trách
                </Col>
                <Col className={styles.classSectionTitle} span={4}>
                  Tên lớp học
                </Col>
                <Col className={styles.classSectionTitle} span={5}>
                  Tên môn
                </Col>
                <Col className={styles.classSectionTitle} span={2}>
                  Sỉ số
                </Col>
                <Col className={styles.classSectionTitle} span={3}>
                  Số buổi học
                </Col>
                <Col className={styles.classSectionTitle} span={3}>
                  Loại lớp học
                </Col>
                <Col className={styles.classSectionTitle} span={3}>
                  Phòng học
                </Col>
              </Row>
              <div className={styles.dropdownContent}>{originNode}</div>
            </div>
          )}
        >
          {classSectionList?.map((item) => (
            <Option
              key={item.id}
              value={item.id}
              lecturerName={
                accountList?.find((data) => data.id === item.lecturerId)?.name
              }
              className={
                classList?.find((data) => data.id === item.classNameId)
                  ?.className
              }
              subjectName={
                subjectList?.find((data) => data.id === item.subjectId)?.subject
              }
              label={
                <>
                  <Typography.Text
                    className={styles.code}
                    ellipsis={{ tooltip: true }}
                  >
                    {`${
                      classList?.find((data) => data.id === item.classNameId)
                        ?.className
                    } - ${
                      subjectList?.find((data) => data.id === item.subjectId)
                        ?.subject
                    }`}
                  </Typography.Text>
                </>
              }
            >
              <Row className={styles.classSectionContentWrapper} gutter={16}>
                <Col className={styles.classSectionContent} span={4}>
                  <Typography.Text
                    className={styles.code}
                    ellipsis={{ tooltip: true }}
                  >
                    {
                      accountList?.find((data) => data.id === item.lecturerId)
                        ?.name
                    }
                  </Typography.Text>
                </Col>
                <Col className={styles.classSectionContent} span={4}>
                  <Typography.Text
                    className={styles.code}
                    ellipsis={{ tooltip: true }}
                  >
                    {
                      classList?.find((data) => data.id === item.classNameId)
                        ?.className
                    }
                  </Typography.Text>
                </Col>
                <Col className={styles.classSectionContent} span={5}>
                  <Typography.Text
                    className={styles.title}
                    ellipsis={{ tooltip: true }}
                  >
                    {
                      subjectList?.find((data) => data.id === item.subjectId)
                        ?.subject
                    }
                  </Typography.Text>
                </Col>
                <Col className={styles.classSectionContent} span={2}>
                  <Typography.Text
                    className={styles.title}
                    ellipsis={{ tooltip: true }}
                  >
                    {item.classSize}
                  </Typography.Text>
                </Col>
                <Col className={styles.classSectionContent} span={3}>
                  <Typography.Text
                    className={styles.title}
                    ellipsis={{ tooltip: true }}
                  >
                    {item.sessionNumber}
                  </Typography.Text>
                </Col>
                <Col className={styles.classSectionContent} span={3}>
                  <Typography.Text
                    className={styles.title}
                    ellipsis={{ tooltip: true }}
                  >
                    {item.typeOfClass}
                  </Typography.Text>
                </Col>

                <Col className={styles.classSectionContent} span={3}>
                  <Typography.Text
                    className={styles.title}
                    ellipsis={{ tooltip: true }}
                  >
                    {item.room}
                  </Typography.Text>
                </Col>
              </Row>
            </Option>
          ))}
        </Select>
      </div>
      <div className={styles.note}>
        <div>
          <label>
            <b>Sỉ số: </b>
          </label>
          <label>{wholesale}</label>
        </div>
        <div>
          <label>
            <b>Trung bình hiện diện : </b>
          </label>
          <label>{averagePresence}</label>
        </div>
        <div>
          <label>
            <b>Phần trăm trung bình : </b>
          </label>
          <label>{averagePercent}</label>
        </div>
      </div>

      {frequency.length ? (
        <Line options={options} data={data} className={styles.chart} />
      ) : (
        <Empty
          description={<p>Lớp học phần chưa có lịch sử điểm danh</p>}
          style={{
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
