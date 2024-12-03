import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import React, { useState } from "react";
import Sidebar from "../scenes/global/Sidebar";
import { ColorModeContext, useMode } from "../theme";
import Topbar from "../scenes/global/Topbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ display: "flex", height: "100vh" }}>
          {isSidebar && (
            <div style={{overflowY: "auto"}}>
              <Sidebar isSidebar={isSidebar} />
            </div>
          )}

          {/* Main Content Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Topbar setIsSidebar={setIsSidebar} />
            <main
              style={{
                flex: 1,
                overflowY: "auto",
              }}
              className="content"
            >
              <Outlet />
            </main>
            {/* <footer style={{backgroundColor:"#000",color:"#fcfcfc"}}> */}
              {/* <div>This is Footer</div> */}
            {/* </footer> */}
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppLayout;
