import React from "react";
import styles from "./index.module.scss";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Radio,
  Row,
  Select,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import clsx from "clsx";
import { useState } from "react";
import {
  CheckCircleOutlined,
  InboxOutlined,
  LoadingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

import { axiosDetect } from "../../axiosBase";
import {
  useAccount,
  useAttendance,
  useAuth,
  useClassList,
  useClassSectionList,
  useSubjectList,
} from "../../hooks";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { dayOptions, lessonOptions } from "../../constant/Enum";
import moment from "moment/moment";
import { useMemo } from "react";

const { Dragger } = Upload;

const { Option } = Select;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const Detect = () => {
  const [form] = Form.useForm();
  const classSectionIdWatch = Form.useWatch("classSectionId", form);

  const date = new Date();
  const current_day = date.getDay();
  const current_hour = date.getHours();
  const current_mintes = date.getMinutes();
  const currnet_time = current_hour + current_mintes / 100;

  const [result, setResult] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSave, setIsSave] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("none");
  const [loading, setLoading] = useState(false);
  const [limitedNumber, setLimitedNumber] = useState(1);
  const [lessonOption, setLessonOptions] = useState([]);

  const { attendanceList, createAttendance } = useAttendance();
  const { classSectionList } = useClassSectionList();
  const { classList } = useClassList();
  const { subjectList } = useSubjectList();
  const { accountList } = useAccount();
  const { currentUser } = useAuth();

  const attendanceLisTofToday = useMemo(
    () =>
      attendanceList?.filter(
        (data) =>
          moment(data?.statisticalDay).format("DD-MM-YYYY") ===
          moment(date).format("DD-MM-YYYY")
      ),
    [attendanceList, date]
  );

  const isClassSessionAttendanced = useMemo(
    () =>
      attendanceLisTofToday?.find(
        (data) => data.classSectionId === classSectionIdWatch
      ),
    [attendanceLisTofToday, classSectionIdWatch]
  );

  // const disabledDate = (current) => {
  //   return (
  //     current &&
  //     (current < dayjs(startDate) || current > dayjs(endDate).add(1, "day"))
  //   );
  // };

  const handleChangeClass = (_, selectedItem) => {
    const schedule = selectedItem?.schedule;
    const lessones = schedule?.find(
      (data) => data.days === current_day
    )?.lessones;
    const option = lessonOptions.filter((data) =>
      lessones?.includes(data.value)
    );

    setLessonOptions(
      option.map((data) => ({
        ...data,
        disabled:
          data.value > currnet_time ||
          currnet_time < 6.3 ||
          currnet_time > 17.3,
      }))
    );

    form.setFieldValue("lesson", null);

    setStartDate(selectedItem?.startDate);
    setEndDate(selectedItem?.endDate);
  };

  const handleUpload = async (file, typeYolo) => {
    if (!file) {
      return;
    }

    try {
      const {
        data: { detectedStudent, imgResult },
      } = await axiosDetect.post(`/detect/${typeYolo}`, {
        image: file,
      });
      await axiosDetect.get("/imageDetected");

      if (typeYolo === "person") {
        setResult({
          labels: detectedStudent.filter((data) => data === "person"),
          image: imgResult,
        });
      } else {
        setResult({ labels: detectedStudent, image: imgResult });
      }

      setStatus("done");
    } catch (error) {
      setStatus("fail");
      console.log(error);
    }
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status !== "uploading") {
      const isLt2M = info.file.size / 1024 / 1024 < 1;
      if (isLt2M) {
        getBase64(info.file.originFileObj, (url) => {
          setImageUrl(url);
        });
      } else {
        setImageUrl("");
      }
    }
  };

  const propsImage = {
    name: "file",
    showUploadList: false,
    action: "http://localhost:3000/",
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        toast.error("Bạn chỉ có thể tải lên tệp JPG/PNG!");
      }
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        toast.error("Hình ảnh phải nhỏ hơn 1MB!");
      }
      return isJpgOrPng && isLt2M;
    },
    onChange(info) {
      handleChange(info);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleFinish = async ({ imageDetect, statisticalDay, ...values }) => {
    const { id, ...classSectionSelected } = classSectionList.find(
      (data) => data.id === values.classSectionId
    );

    const attendanceNumberOfSessions = attendanceList.filter(
      (data) => data.classSectionId === values.classSectionId
    ).length;

    if (!isSave) {
      setStatus("loading");
      setLoading(false);
      await handleUpload(imageDetect.file.originFileObj, values.modelDetect);
      setLimitedNumber(classSectionSelected?.classSize);
    } else if (
      attendanceNumberOfSessions < classSectionSelected.sessionNumber
    ) {
      const dataReq = {
        id: uuidv4(),
        statisticalDay: statisticalDay.toISOString(),
        imageUrl: imageUrl,
        presence: result?.labels?.length,
        lecturerId: currentUser.localId,
        classSectionName: `${
          classList?.find(
            (data) => data.id === classSectionSelected.classNameId
          )?.className
        } - ${
          subjectList?.find(
            (data) => data.id === classSectionSelected.subjectId
          )?.subject
        }`,
        summaryNumber:
          classSectionSelected?.classSize > result?.labels?.length
            ? classSectionSelected?.classSize - result?.labels?.length
            : result?.labels?.length - classSectionSelected?.classSize,
        summaryStatus:
          classSectionSelected?.classSize >= result?.labels?.length
            ? "Vắng"
            : "Dư",
        ...values,
        ...classSectionSelected,
      };

      await createAttendance.mutateAsync(dataReq);
      form.resetFields();
      setImageUrl("");
      setStatus("none");
      setResult(null);
    } else {
      toast.error("Đã điểm danh đủ số buổi học!");
    }
  };

  return (
    <div className={styles.detect}>
      <Row className={styles.wrapper}>
        <Col span={6} className={styles.settingColumn}>
          <div className={styles.labelSider}>Cài đặt</div>
          <Form
            form={form}
            layout="vertical"
            className={styles.formAttendance}
            onFinish={handleFinish}
            initialValues={{
              classSectionId: null,
              statisticalDay: moment(date),
              modelDetect: null,
              imageDetect: null,
            }}
          >
            <div className={styles.body}>
              <Form.Item
                name="classSectionId"
                label="Lớp học phần"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn lớp học phần!",
                  },
                ]}
              >
                <Select
                  disabled={currnet_time < 6.3 || currnet_time > 17.3}
                  allowClear
                  showSearch
                  onChange={handleChangeClass}
                  filterOption={(search, item) =>
                    item?.className
                      ?.toLowerCase()
                      ?.indexOf(search?.toLowerCase()) >= 0 ||
                    item?.lecturerName
                      ?.toLowerCase()
                      ?.indexOf(search?.toLowerCase()) >= 0 ||
                    item?.subjectName
                      ?.toLowerCase()
                      ?.indexOf(search?.toLowerCase()) >= 0
                  }
                  optionLabelProp="label"
                  placeholder="Chọn lớp học phần"
                  popupClassName={styles.popupClassnameClassSession}
                  dropdownRender={(originNode) => (
                    <div className={styles.selectDropdownWrapper}>
                      <Row
                        className={styles.classSectionTitleWrapper}
                        gutter={16}
                      >
                        <Col className={styles.classSectionTitle} span={4}>
                          Giảng viên phụ trách
                        </Col>
                        <Col className={styles.classSectionTitle} span={3}>
                          Tên lớp học
                        </Col>
                        <Col className={styles.classSectionTitle} span={3}>
                          Tên môn
                        </Col>
                        <Col className={styles.classSectionTitle} span={2}>
                          Sỉ số
                        </Col>
                        <Col className={styles.classSectionTitle} span={3}>
                          Số buổi học
                        </Col>
                        <Col className={styles.classSectionTitle} span={3}>
                          Thời khóa biểu
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
                  {classSectionList?.map((item) => {
                    const date = new Date();
                    const current_day = date.getDay();

                    return (
                      <Option
                        key={item.id}
                        value={item.id}
                        lecturerName={
                          accountList?.find(
                            (data) => data.id === item.lecturerId
                          )?.name
                        }
                        className={
                          classList?.find(
                            (data) => data.id === item.classNameId
                          )?.className
                        }
                        subjectName={
                          subjectList?.find(
                            (data) => data.id === item.subjectId
                          )?.subject
                        }
                        label={
                          <>
                            <Typography.Text
                              className={styles.code}
                              ellipsis={{ tooltip: true }}
                            >
                              {`${
                                classList?.find(
                                  (data) => data.id === item.classNameId
                                )?.className
                              } - ${
                                subjectList?.find(
                                  (data) => data.id === item.subjectId
                                )?.subject
                              }`}
                            </Typography.Text>
                          </>
                        }
                        schedule={item.schedule}
                        startDate={item.startDate}
                        endDate={item.endDate}
                        disabled={
                          !item.days.includes(current_day) ||
                          dayjs(item.startDate) > dayjs(date) ||
                          dayjs(item.endDate) < dayjs(date)
                        }
                      >
                        <Row
                          className={styles.classSectionContentWrapper}
                          gutter={16}
                        >
                          <Col className={styles.classSectionContent} span={4}>
                            <Typography.Text
                              className={styles.code}
                              ellipsis={{ tooltip: true }}
                            >
                              {
                                accountList?.find(
                                  (data) => data.id === item.lecturerId
                                )?.name
                              }
                            </Typography.Text>
                          </Col>
                          <Col className={styles.classSectionContent} span={3}>
                            <Typography.Text
                              className={styles.code}
                              ellipsis={{ tooltip: true }}
                            >
                              {
                                classList?.find(
                                  (data) => data.id === item.classNameId
                                )?.className
                              }
                            </Typography.Text>
                          </Col>
                          <Col className={styles.classSectionContent} span={3}>
                            <Typography.Text
                              className={styles.title}
                              ellipsis={{ tooltip: true }}
                            >
                              {
                                subjectList?.find(
                                  (data) => data.id === item.subjectId
                                )?.subject
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
                              {dayOptions
                                .filter((data) =>
                                  item.days.includes(data.value)
                                )
                                .map((data) => `${data.label}, `)}
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
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Thứ tự tiết học"
                name="lesson"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn tiết học!",
                  },
                ]}
              >
                <Select
                  options={lessonOption}
                  placeholder="Chọn tiết học"
                  disabled={!lessonOption.length}
                />
              </Form.Item>
              <Form.Item
                name="statisticalDay"
                label="Ngày điểm danh"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày điểm danh!",
                  },
                ]}
              >
                <DatePicker
                  format="DD-MM-YYYY"
                  placeholder="Chọn ngày điểm danh"
                  className={styles.noneEvents}
                  // defaultValue={}
                  // disabledDate={disabledDate}
                  // disabled={!lessonOption.length}
                />
              </Form.Item>

              {/* <Form.Item
                label="Buổi học"
                name="session"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn buổi!",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="Sáng"> Sáng</Radio>
                  <Radio value="Chiều"> Chiều </Radio>
                </Radio.Group>
              </Form.Item> */}

              <Form.Item
                label="Điểm danh dựa trên"
                name="modelDetect"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại điểm danh!",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="face">Khuôn mặt</Radio>
                  <Radio value="person">Thân hình</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="imageDetect"
                label="Tải ảnh lên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng tải ảnh lên!",
                  },
                ]}
              >
                <Dragger {...propsImage}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                </Dragger>
              </Form.Item>

              {imageUrl && (
                <>
                  <div className={styles.label}>Xem lại</div>
                  <div className={styles.wrapperInput}>
                    <Image width="100%" src={imageUrl}></Image>
                  </div>
                </>
              )}
            </div>
          </Form>

          <div className={styles.footer}>
            <Tooltip
              title={
                isClassSessionAttendanced
                  ? "Lớp học đã được điểm danh rồi. Vui lòng thử lại vào buổi học kế tiếp."
                  : ""
              }
            >
              <Button
                disabled={isClassSessionAttendanced}
                type="primary"
                onClick={() => {
                  setIsSave(false);
                  form.submit();
                }}
              >
                Điểm danh
              </Button>
            </Tooltip>
          </div>
        </Col>
        <Col span={18} className={styles.resultColumn}>
          <div className={styles.header}>
            <div className={styles.labelOutput}>Kết quả</div>

            <div className={styles.wrapperIcons}>
              <div
                className={clsx(styles.statusWrapper, {
                  [styles.loading]: status === "loading",
                  [styles.done]: status === "done",
                  [styles.fail]: status === "fail",
                })}
              >
                {status === "loading" && (
                  <>
                    <LoadingOutlined />
                    ĐANG TẢI...
                  </>
                )}
                {status === "done" && (
                  <>
                    <CheckCircleOutlined />
                    HOÀN THÀNH
                  </>
                )}
                {status === "fail" && (
                  <>
                    <WarningOutlined />
                    THẤT BẠI
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.resultImageWrapper}>
              {status === "loading" && <LoadingOutlined />}
              {status === "done" && result && (
                <Image width="80%" src={result.image} id="resultImg"></Image>
              )}
              {status === "fail" && <WarningOutlined />}
            </div>
            {status === "done" && result && (
              <div className={styles.resultDatas}>
                <div className={styles.dataWrapper}>
                  <div className={styles.label}>Sỉ số lớp</div>
                  <div className={styles.data}>{limitedNumber}</div>
                </div>
                <div className={styles.dataWrapper}>
                  <div className={styles.label}>Hiện diện</div>
                  <div className={styles.data}>{result?.labels?.length}</div>
                </div>
                <div className={styles.dataWrapper}>
                  <div className={styles.label}>
                    {limitedNumber >= result?.labels?.length ? "Vắng" : "Dư"}
                  </div>
                  <div className={styles.data}>
                    {limitedNumber >= result?.labels?.length
                      ? limitedNumber - result?.labels?.length
                      : result?.labels?.length - limitedNumber}
                  </div>
                </div>
              </div>
            )}
          </div>
          {status === "done" && (
            <div className={styles.footer}>
              <Button
                // type="primary"
                style={{ color: "#fff" }}
                onClick={() => {
                  setIsSave(true);
                  form.submit();
                }}
              >
                LƯU
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Detect;
