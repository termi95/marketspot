import "@mantine/core/styles.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainView from "./View/Main";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsMobile } from "./State/User/userSlice";
import LoginView from "./View/Login";
import ForgetPasswordView from "./View/ForgetPassword";
import ChangePasswordView from "./View/ChangePasswordView";

function App() {
  const dispatch = useDispatch();
  function isMobile() {
    if (window.screen.width <= 1280) {
      dispatch(setIsMobile(true));
    }
  }
  useEffect(() => {
    isMobile();
    return () => {
      isMobile();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/forget-password" element={<ForgetPasswordView />} />
      <Route path="/change-password/:id" element={<ChangePasswordView />} />
    </Routes>
  );
}

export default App;
