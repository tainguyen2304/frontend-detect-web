import { ConfigProvider } from "antd";
import { useRoutes } from "react-router-dom";
import styles from "./App.module.scss";
import publicRoutes from "./routes";

const App = () => {
  const routing = useRoutes(publicRoutes);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#109BE0  ",
        },
      }}
    >
      <div className={styles.app}>{routing}</div>;
    </ConfigProvider>
  );
};
export default App;
