import "@mantine/core/styles.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./View/MainPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsMobile } from "./State/User/userSlice";
import LoginView from "./View/Login";
import ForgetPasswordView from "./View/ForgetPassword";

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
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/forget-password" element={<ForgetPasswordView />} />
      </Routes>
    </>
  );
}

export default App;
