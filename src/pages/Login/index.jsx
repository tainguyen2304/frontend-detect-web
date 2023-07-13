import { Button, Form, Input, Switch } from "antd";
import React from "react";
import styles from "./index.module.scss";
import Logo from "../../images/logo.png";
import useAuth from "../../hooks/api/useAuth";
import Route from "../../constant/Route";
import { LogoIcon } from "../../icons";
import md5 from "md5";

const Login = () => {
  const [form] = Form.useForm();
  const { handleLogin } = useAuth();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = ({ remember, ...values }) => {
    try {
      handleLogin.mutate({
        ...values,
        // password: md5(values.password),
        password: values.password,
      });
      form.setFieldValue("password", "");
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
          Ứng Dụng Điểm Danh Sinh Viên Cao Thắng
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.loginPopup}>
          <div className={styles.header}>
            <div className={styles.title}>Đăng nhập</div>
          </div>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={{
              remember: true,
              email: "",
              password: "",
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
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

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              className={styles.forgetPwWrapper}
            >
              <div style={{ color: "#fff" }}>
                <Switch defaultChecked style={{ marginRight: "6px" }} />
                Ghi nhớ tôi
              </div>
              <div>
                <i>
                  <a href={Route.ResetPassword} style={{ color: "#fff" }}>
                    Quên mật khẩu?
                  </a>
                </i>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.btnLogin}
                loading={handleLogin.isLoading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
