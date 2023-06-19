import {
  CheckCircleOutlined,
  InboxOutlined,
  LoadingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Image,
  InputNumber,
  Layout,
  message,
  Radio,
  Row,
  Space,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import axiosClient from "./axiosBase";
import clsx from "clsx";
import { ReactComponent as ChairIcon } from "./icons/chair.svg";
import { ReactComponent as PersonIcon } from "./icons/person.svg";

const { Dragger } = Upload;

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [mode, setMode] = useState("image");
  const [collapsed, setCollapsed] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [limitedNumber, setLimitedNumber] = useState(10);
  const [status, setStatus] = useState("none");

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const onChange = (e) => {
    setMode(e.target.value);
  };

  const handleUpload = async (file) => {
    if (!file) {
      return;
    }

    try {
      const {
        data: { labelsFaceModel, labelsPersonModel, imgResult },
      } = await axiosClient.post("/upload", {
        image: file,
      });
      await axiosClient.get("/result");

      const labelsPerson = labelsPersonModel.filter(
        (data) => data === "person"
      );

      if (labelsFaceModel.length < labelsPerson.length) {
        setResult({ labels: labelsPerson, image: imgResult });
      } else {
        setResult({ labels: labelsFaceModel, image: imgResult });
      }

      setStatus("done");
    } catch (error) {
      setStatus("fail");
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(result);
  }, [result]);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status !== "uploading") {
      getBase64(info.file.originFileObj, (url) => {
        setStatus("loading");
        setLoading(false);
        setImageUrl(url);
        handleUpload(info.file.originFileObj);
      });
    }
  };

  const propsImage = {
    name: "file",
    showUploadList: false,
    accept: "image/*",
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        message.error("Hình ảnh phải nhỏ hơn 2MB!");
      }

      return isLt2M;
    },
    onChange(info) {
      handleChange(info);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const propsVideo = {};

  const propsUpload = mode === "image" ? propsImage : propsVideo;

  return (
    <Layout className={styles.app}>
      <Sider
        className={styles.sider}
        collapsedWidth={0}
        collapsible
        width={340}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className={styles.titleSider}>PersonDectect Sidebar</div>
        <div className={styles.contentSider}>
          <div className={styles.labelSider}>standard input</div>

          <ul className={styles.listStandard}>
            <li>High image sharpness</li>
            <li>Low image opacity</li>
            <li>People in the photo are less obscured</li>
          </ul>

          <div className={styles.labelSider}>parameters</div>

          <div className={styles.label}>Input Limited Number of People</div>

          <InputNumber
            controls={false}
            value={Number(limitedNumber)}
            onChange={(value) => {
              setLimitedNumber(value);
            }}
            onBlur={(value) => {
              if (value < 10) {
                setLimitedNumber(10);
              }
            }}
            min={10}
            className={styles.inputLimited}
          ></InputNumber>

          <div className={styles.label}>Choose the App mode</div>
          <Radio.Group
            onChange={onChange}
            value={mode}
            className={styles.groupMode}
          >
            <Space direction="vertical">
              <Radio value="image">Image</Radio>
              <Radio value="video">Video</Radio>
            </Space>
          </Radio.Group>

          {mode === "image" ? (
            <>
              <div className={styles.label}>Upload a Image</div>
              <div className={styles.wrapperUpload}>
                <Dragger {...propsUpload}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                </Dragger>
              </div>
            </>
          ) : (
            <div className={styles.wrapperCommingSoon}>Comming Soon</div>
          )}

          {imageUrl && (
            <>
              <div className={styles.label}>
                {mode === "image" ? "Input Image" : "Input Video"}
              </div>
              <div className={styles.wrapperInput}>
                <Image width="100%" src={imageUrl}></Image>
              </div>
            </>
          )}
        </div>
      </Sider>
      <Layout className={styles.screenMain}>
        <Header className={styles.header}>
          <div className={styles.content}>
            <div className={styles.title}>
              Application of class number statistics
              <div className={styles.note}>
                <b>Note:</b>{" "}
                <i>Image quality determines how accurate the results</i>
                are
              </div>
            </div>

            <div className={styles.navbar}>
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
                    LOADING...
                  </>
                )}
                {status === "done" && (
                  <>
                    <CheckCircleOutlined />
                    DONE
                  </>
                )}
                {status === "fail" && (
                  <>
                    <WarningOutlined />
                    FAIL
                  </>
                )}
              </div>

              <Button
                disabled={status !== "done"}
                className={styles.stopBtn}
                onClick={() => {
                  setLimitedNumber(10);
                  setStatus();
                  setImageUrl();
                }}
              >
                RESTART
              </Button>
            </div>
          </div>
        </Header>
        <Content className={styles.body}>
          <div className={styles.content}>
            <div className={styles.labelOutput}>Output</div>
            <div className={styles.resultImageWrapper}>
              {status === "loading" && <LoadingOutlined />}
              {status === "done" && result && (
                <Image width="100%" src={result.image} id="resultImg"></Image>
              )}
              {status === "fail" && <WarningOutlined />}
            </div>
            {status === "done" && result && (
              <>
                <div className={styles.resultDatas}>
                  <div className={styles.dataWrapper}>
                    <div className={styles.label}>Number Of People Limited</div>
                    <div className={styles.data}>
                      <div>
                        <ChairIcon />
                      </div>
                      <div>{limitedNumber}</div>
                    </div>
                  </div>
                  <div className={styles.dataWrapper}>
                    <div className={styles.label}>Detected Persons</div>
                    <div className={styles.data}>
                      <div>
                        <PersonIcon />
                      </div>
                      <div>{result?.labels?.length}</div>
                    </div>
                  </div>
                  <div className={styles.summaryWrapper}>
                    <div className={styles.label}>Summary</div>
                    <div className={styles.data}>
                      {limitedNumber < result?.labels?.length ? (
                        <div className={styles.redundant}>
                          Has exceeded the capacity of the classroom !
                        </div>
                      ) : limitedNumber > result?.labels?.length ? (
                        <div className={styles.still}>
                          There's still room for people
                        </div>
                      ) : (
                        <div className={styles.enough}>Enough people </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Content>
        <Footer className={styles.footer}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
