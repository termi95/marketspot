import "@mantine/core/styles.css";
import '@mantine/dropzone/styles.css';
import '@mantine/dates/styles.css';
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainView from "./View/Main";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsLogin, setIsMobile, setUserRole } from "./State/User/userSlice";
import LoginView from "./View/Login";
import ForgetPasswordView from "./View/ForgetPassword";
import ChangePasswordView from "./View/ChangePasswordView";
import { Api } from "./Helpers/Api/Api";
import AddingOferView from "./View/AddingOferView";
import AddingCategory from "./View/AddingCategory";

function App() {
  const { isTokenExpired, GetUserRole } = Api();
  const dispatch = useDispatch();
  function isMobile() {
    if (window.screen.width <= 1280) {
      dispatch(setIsMobile(true));
    }
  }
  function isLogin() {
    if (!isTokenExpired()) {
      dispatch(setIsLogin(true));
      dispatch(setUserRole(GetUserRole()))
    } else {
      dispatch(setIsLogin(false));
    }
  }
  useEffect(() => {
    isMobile();
    isLogin();
    return () => {
      isMobile();
      isLogin();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/forget-password" element={<ForgetPasswordView />} />
      <Route path="/change-password/:id" element={<ChangePasswordView />} />
      <Route path="/adding" element={<AddingOferView />} />
      <Route path="/add-category" element={<AddingCategory />} />
    </Routes>
  );
}

export default App;
