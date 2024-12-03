import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import MenuListComposition from "../../components/dashboard/MenuListComposition";
import Notification from "../../components/notification/Notification";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Box display="flex" justifyContent="space-between" px={1} py={2}>
        {/* SEARCH BAR */}
        

        <Box>
          
        </Box>
        {/* ICONS */}
        <Box display="flex">
          {/* <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton> */}
          {/* <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton> */}
          <Notification />
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            
            <MenuListComposition />
          </IconButton>
          
        </Box>
      </Box>
      <div style={{ height: "1px", backgroundColor: "#000" }}></div>
    </div>
  );
};

export default Topbar;
