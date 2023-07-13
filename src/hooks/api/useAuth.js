import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Route from '../../constant/Route';
import AuthService from '../../services/AuthService';
import { create } from 'zustand'
const ColorList = ["#29F500", "#65B9E6", "#FF5900", "#00a2ae"];


const useAuthStore = create((set) => ({
    currentUser: null,
    setCurrentUser: currentUser => set({ currentUser }),
}))

const useAuth = () => {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useAuthStore()
    const handleLogin = useMutation({
        mutationFn: AuthService.login,
        onSuccess: ({ data }) => {
            if (data) {
                localStorage.setItem("token", data.idToken);
                localStorage.setItem("email", data.email);
                localStorage.setItem("bg", ColorList[Math.floor(Math.random() * 4)]);
                if (data.email === 'admin@caothang.edu') {
                    navigate(Route.Admin);
                } else {
                    navigate(Route.Homepage);
                }
                toast.success("Đăng nhập thành công!");
            } else {
                toast.error("Email hoặc mật khẩu không đúng!");
            }
        },
        onError: () => {
            toast.error("Đã xảy ra lỗi, vui lòng thử lại");

        },
    });

    const handleResetPassword = useMutation({
        mutationFn: AuthService.resetPassword,
        onSuccess: () => {
            toast.success("Đã gửi, vui lòng kiểm tra email của bạn.");
        },
        onError: () => {
            toast.error("Đã xảy ra lỗi, vui lòng thử lại");
        },
    })

    const handleChangePassword = useMutation({
        mutationFn: AuthService.changePassword,
        onSuccess: () => {
            toast.success("Đổi mật khẩu thành công");
        },
        onError: () => {
            toast.error("Đã xảy ra lỗi, vui lòng thử lại");
        },
    })

    const handleGetCurtentUser = useMutation({
        mutationFn: AuthService.getCurrentUser,
        onSuccess: (data) => {
            const result = data.data.users
            setCurrentUser(result[0])
            return result[0]
        },
        onError: () => {
        },
    })


    return { currentUser, handleLogin, handleResetPassword, handleChangePassword, handleGetCurtentUser }
};

export default useAuth;