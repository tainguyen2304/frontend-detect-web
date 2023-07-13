import React, { useEffect } from "react";
import { Avatar, Button, Layout, Menu, Popover } from "antd";
import styles from "./index.module.scss";
import { useState } from "react";
import {
  DashboardIcon,
  SettingIcon,
  HistoryIcon,
  LogoIcon,
} from "../../icons/index";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Route from "../../constant/Route";
import clsx from "clsx";
import { OrderedListOutlined } from "@ant-design/icons";
import useAuth from "../../hooks/api/useAuth";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(
    "Công cụ điểm danh",
    Route.Homepage,
    <SettingIcon className={styles.iconSidevar} />
  ),
  getItem(
    "Danh sách lớp học phần",
    Route.ClassSectionList,
    <OrderedListOutlined className={styles.iconSidevar} />
  ),
  getItem(
    "Lịch sử diểm danh",
    Route.History,
    <HistoryIcon className={styles.iconSidevar} />
  ),
  getItem(
    "Thống kê",
    Route.Dashboard,
    <DashboardIcon className={styles.iconSidevar} />
  ),
];

const { Header, Content, Footer, Sider } = Layout;

const Home = (props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { handleGetCurtentUser } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState();

  const handleClickMenu = ({ _, key, keypath }) => {
    navigate(key);
    setSelectedKeys(keypath);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("bg");
    window.location.reload();
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate(Route.Login);
    }
  }, [navigate]);

  useEffect(() => {
    setSelectedKeys([pathname]);
  }, [pathname]);

  useEffect(() => {
    handleGetCurtentUser.mutate({ idToken: localStorage.getItem("token") });
  }, []);

  return localStorage.getItem("email") !== "admin@caothang.edu" ? (
    <Layout className={styles.home}>
      <Sider
        className={clsx(styles.sider)}
        collapsible
        width={300}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <>
          <div className={styles.titleSider}>
            <LogoIcon className={styles.iconSibarTitle} />
          </div>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            PersonDectect
            Sidebar
            theme="dark"
            items={items}
            onClick={handleClickMenu}
          />
        </>
      </Sider>
      <Layout className={styles.screenMain}>
        <Header className={styles.header}>
          <div className={styles.content}>
            <div className={styles.title} styles={{ textAlign: "center" }}>
              Ứng Dụng Điểm Danh Sinh Viên Cao Thắng
              <div className={styles.note}>
                <b>Chú ý: </b>
                <i>Chất lượng hình ảnh xác định mức độ chính xác của kết quả</i>
              </div>
            </div>
            <div className={styles.infoCurrentUser}>
              <Popover
                placement="bottomLeft"
                title="Thông tin tài khoản"
                content={
                  <div className={styles.contentInfo}>
                    <div
                      className={styles.email}
                    >{`Email: ${localStorage.getItem("email")}`}</div>

                    <Button
                      type="primary"
                      onClick={() => navigate(Route.ChangePassword)}
                      style={{ width: "100%", marginBottom: "10px" }}
                    >
                      Đổi mật khẩu
                    </Button>
                    <Button
                      danger
                      onClick={handleLogout}
                      style={{ width: "100%" }}
                    >
                      Đăng xuất
                    </Button>
                  </div>
                }
              >
                <Avatar
                  className={styles.avatar}
                  style={{
                    backgroundColor: localStorage.getItem("bg"),
                    color: "#fff",
                  }}
                >
                  {localStorage.getItem("email")?.slice(0, 1)?.toUpperCase()}
                </Avatar>
              </Popover>
            </div>
          </div>
        </Header>
        <Content className={styles.body}>
          <Outlet />
        </Content>
        <Footer className={styles.footer}>
          <div style={{ textAlign: "center" }}>
            <div>AWOC ©2023 Attendance With One Click</div>
          </div>
        </Footer>
      </Layout>
    </Layout>
  ) : (
    <Navigate to={Route.Admin} />
  );
};

export default Home;
