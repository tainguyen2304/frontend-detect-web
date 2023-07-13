import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import styles from "./index.module.scss";
import useAuth from "../../hooks/api/useAuth";
import Route from "../../constant/Route";
import { LogoIcon } from "../../icons";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const { handleLogin, handleResetPassword } = useAuth();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = (value) => {
    handleResetPassword.mutate(value);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.header}>
        <LogoIcon className={styles.iconSibarTitle} />
        <div
          style={{ fontSize: "60px", color: "#109BE0", textAlign: "center" }}
        >
          Ứng Dụng Điểm Danh <br /> Sinh Viên CĐKT Cao Thắng
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.loginPopup}>
          <div className={styles.header}>
            <div className={styles.title}>Lấy lại mật khẩu</div>
          </div>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={{
              email: "",
              requestType: "PASSWORD_RESET",
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Nhập email của bạn"
              name="email"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập email!",
                },
                {
                  type: "email",
                  message: "Vui lòng nhập đúng định dạng email!",
                },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
            <Form.Item name="requestType" hidden />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <i>
                <a style={{ color: "#fff" }} href={Route.Login}>
                  Đăng nhập
                </a>
              </i>
            </div>
            <br />
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.btnLogin}
                loading={handleLogin.isLoading}
              >
                Gửi
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
