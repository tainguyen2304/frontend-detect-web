import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useState } from "react";

import styles from "./UploadImage.module.scss";

const UploadImage = ({ onChange }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
    }

    return isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status !== "uploading") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        onChange(info.file.originFileObj);
      });
    }
  };

  const uploadButton = (
    <div className={styles.wrapperUploadBtn}>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <div className={styles.btnUpload}>
          <div>
            <UploadOutlined className={styles.addPhoto} />
          </div>
          <div>Tải ảnh lên</div>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.uploadImage}>
      <div className={styles.imgReviewWrapper}>
        {imageUrl && (
          <img src={imageUrl} alt="icons" className={styles.imgReview} />
        )}
      </div>
      <div className={styles.imgReviewWrapper}>
        {imageUrl && (
          <img
            src="http://192.168.11.31:8080/result"
            alt="icons"
            className={styles.imgReview}
          />
        )}
        b
      </div>
      <Upload
        listType="text"
        className={styles.upload}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        accept="image/*"
      >
        {uploadButton}
      </Upload>
    </div>
  );
};

export default UploadImage;
