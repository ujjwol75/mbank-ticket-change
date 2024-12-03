import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../layout/AppLayout";
import LoginPage from "../pages/auth/login/LoginPage";
import { routes } from "./routes";
import { Suspense } from "react";

const AppRoutes = () => {
  return (
    <HashRouter>
      <Suspense fallback={<h1>...Loading</h1>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <Routes>
                  <Route path="/" element={<AppLayout />}>
                    {routes.map((route, index) => (
                      <Route
                        path={route.path}
                        element={route.component}
                        key={index + route.path}
                      />
                    ))}
                  </Route>
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default AppRoutes;
