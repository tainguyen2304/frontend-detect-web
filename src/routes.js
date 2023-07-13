import ClassList from "./pages/ClassList";
import Detect from "./pages/Detect";
import Home from "./pages/Home";
import Route from "./constant/Route";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import SubjectList from "./pages/SubjectList";
import AccountList from "./pages/AccountList";
import ClassListSection from "./pages/ClassListSection";
import AttendanceList from "./pages/History";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

const publicRoutes = [
    {
        path: Route.Admin,
        element: <Admin />,
        children: [
            {
                index: true,
                element: <AccountList />
            },
            {
                path: Route.ClassList,
                element: <ClassList />
            },
            {
                path: Route.SubjectList,
                element: <SubjectList />
            },

        ],
    },

    {
        path: Route.Homepage,
        element: <Home />,
        children: [
            {
                index: true,
                element: <Detect />
            },

            {
                path: Route.Dashboard,
                element: <Dashboard />
            },

            {
                path: Route.History,
                element: <AttendanceList />
            },
            {
                path: Route.ClassSectionList,
                element: <ClassListSection />
            },

        ],
    },

    {
        path: Route.Login,
        element: <Login />
    },
    {
        path: Route.ResetPassword,
        element: <ResetPassword />
    },
    {
        path: Route.ChangePassword,
        element: <ChangePassword />
    },

]

export default publicRoutes


