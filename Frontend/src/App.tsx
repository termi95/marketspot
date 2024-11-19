import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainView from "./View/Main";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsMobile } from "./State/User/userSlice";
import React from "react";
import CustomLoader from "./Components/Loader";
import GeneralHelper from "./Helpers/general/general";

const LoginView = React.lazy(() => import("./View/Login"));
const ForgetPasswordView = React.lazy(() => import("./View/ForgetPassword"));
const ChangePasswordView = React.lazy(
  () => import("./View/ChangePasswordView")
);
const AddingCategory = React.lazy(() => import("./View/AddingCategory"));
const AddingOferView = React.lazy(() => import("./View/AddingOferView"));
const ProfileView = React.lazy(() => import("./View/Profile"));
const OfferView = React.lazy(() => import("./View/OfferView/Index"));
const MyOffer = React.lazy(() => import("./View/Profile/myOffer"));
const Settings = React.lazy(() => import("./View/Profile/settings"));
const Gallery = React.lazy(() => import("./View/Profile/Likes"));
const UserOffersView = React.lazy(() => import("./View/UserOffers/index"));

function App() {
  const dispatch = useDispatch();
  const { isLogin } = GeneralHelper();
  function isMobile() {
    if (window.screen.width <= 1280) {
      dispatch(setIsMobile(true));
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
    <Suspense fallback={<CustomLoader setBg={true} />}>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/forget-password" element={<ForgetPasswordView />} />
        <Route path="/change-password/:id" element={<ChangePasswordView />} />
        <Route path="/adding" element={<AddingOferView />} />
        <Route path="/add-category" element={<AddingCategory />} />
        <Route path="/profile" element={<ProfileView />}>
          <Route path=":tabValue" element={<Gallery />} />
          <Route path=":tabValue" element={<MyOffer />} />
          <Route path=":tabValue" element={<Settings />} />
        </Route>
        <Route path="/offer/:id" element={<OfferView />} />
        <Route path="/offers/:id" element={<UserOffersView />} />
      </Routes>
    </Suspense>
  );
}
export default App;
