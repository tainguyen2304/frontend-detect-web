import { Button, Form, Input } from "antd";
import React from "react";
import styles from "./index.module.scss";
import Logo from "../../images/logo.jpg";
import Route from "../../constant/Route";
import { useNavigate } from "react-router-dom";
import { LogoIcon } from "../../icons";
import { useAuth } from "../../hooks";
import md5 from "md5";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const naviagate = useNavigate();
  const { handleChangePassword } = useAuth();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = ({ confirm, password }) => {
    try {
      handleChangePassword.mutate({
        // password: md5(password),
        password: password,
        returnSecureToken: true,
        idToken: localStorage.getItem("token"),
      });

      form.resetFields();
      localStorage.removeItem("token");
      naviagate(Route.Login);
    } catch (error) {
      console.log(error);
    }
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
            <div className={styles.title}>Đổi mật khẩu</div>
          </div>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={{
              password: "",
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="password"
              label="Mật khẩu mới"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập mật khẩu mới!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Nhập lại mật khẩu"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lại mật khẩu mới",
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
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <i>
                <a href={Route.Homepage} style={{ color: "#fff" }}>
                  Quay lại
                </a>
              </i>
            </div>
            <br />
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.btnLogin}
                loading={handleChangePassword.isLoading}
              >
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
