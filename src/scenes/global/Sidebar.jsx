import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { menu } from "../../routes/menu";
import { GroupsOutlined } from "@mui/icons-material";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      style={{
        color: selected === title ? '#1D2A6C' : '#1D2A6C', // Set title color to black
        backgroundColor: selected === title ? '#f6f6f6' : 'transparent',
      }}
      onClick={() => {
        setSelected(title);
        localStorage.setItem("selectedMenuItem", title);
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const SubMenuItem = ({ title, submenus, selected, setSelected }) => {
  return (
    <SubMenu
      title={title}
      icon={<GroupsOutlined />} 
      style={{
        color: '#1D2A6C', 
      }}
    >
      {submenus.map((submenu) => (
        <Item
          key={submenu.id}
          title={submenu.title}
          to={submenu.path}
          icon={submenu.icon}
          selected={selected === submenu.title}
          setSelected={setSelected}
        />
      ))}
    </SubMenu>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const savedSelection = localStorage.getItem("selectedMenuItem");
    setSelected(savedSelection || "Dashboard");
  }, []);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: '#f6f6f6 !important' ,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: '#1D2A6C !important',
          backgroundColor: colors.grey[800] + " !important",
        },
        "& .pro-menu-item": {
          color: 'black !important', // Set menu item color to black
        },
      }}
      style={{
        height: "100vh",
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: '#1D2A6C', 
              backgroundColor: 'transparent',
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color='black'>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon style={{ color: 'black' }} />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color='black'
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  mBank
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  mBank Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {menu.map((item) => {
              if (item.submenus && item.submenus.length > 0) {
                return (
                  <SubMenuItem
                    key={item.id}
                    title={item.title}
                    submenus={item.submenus}
                    selected={selected}
                    setSelected={setSelected}
                  />
                );
              }
              return (
                <Item
                  key={item.id}
                  title={item.title}
                  to={item.path}
                  icon={item.icon}
                  selected={selected === item.title}
                  setSelected={setSelected}
                />
              );
            })}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
