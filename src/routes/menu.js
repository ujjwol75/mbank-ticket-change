import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

import { nanoid } from "nanoid";

export const menu = [
  {
    title: "Dashboard",
    path: "/",
    icon: <HomeOutlinedIcon />,
    submenus: [],
    id: nanoid(),
  },
  {
    title: "Customers and Sales",
    path: "/customers-sales",
    icon: <PeopleOutlinedIcon />,
    submenus: [
      {
        title: "Customers",
        path: "/customers",
        icon: <PeopleOutlinedIcon />,
        id: nanoid(),
      },
      {
        title: "Leads",
        path: "/leads",
        icon: <ContactsOutlinedIcon />,
        id: nanoid(),
      },
      {
        title: "Channel Partners",
        path: "/channel-partners",
        icon: <ReceiptOutlinedIcon />,
        id: nanoid(),
      },
      {
        title: "Ticket",
        path: "/ticket",
        icon: <ConfirmationNumberOutlinedIcon />,
        id: nanoid(),
      },
    ],
    id: nanoid(),
  },
  {
    title: "HRM",
    path: "/hrm",
    icon: <GroupOutlinedIcon />,
    submenus: [
      {
        title: "Employees",
        path: "/hrm/employees",
        icon: <GroupOutlinedIcon />,
        id: nanoid(),
      },
      {
        title: "Allowance",
        path: "/hrm/allowances",
        icon: <GroupOutlinedIcon />,
        id: nanoid(),
      },
      {
        title: "Departments",
        path: "/hrm/departments",
        icon: <WorkOutlineOutlinedIcon />,
        id: nanoid(),
      },
      {
        title: "Salary",
        path: "/hrm/salary",
        icon: <WorkOutlineOutlinedIcon />,
        id: nanoid(),
      },
    ],
    id: nanoid(),
  },

  {
    title: "Config",
    path: "/config",
    icon: <GroupOutlinedIcon />,
    submenus: [
      {
        title: "User Roles",
        path: "/config/user-role",
        icon: <GroupOutlinedIcon />,
        id: nanoid(),
      },
      {
        title: "Users",
        path: "/config/users",
        icon: <GroupOutlinedIcon />,
        id: nanoid(),
      },
      
    ],
    id: nanoid(),
  },


  {
    title: "Task Management",
    path: "/task-management",
    icon: <GroupOutlinedIcon />,
    submenus: [
      {
        title: "Projects",
        path: "/task-management/project",
        icon: <GroupOutlinedIcon />,
        id: nanoid(),
      },
      {
        title: "Tasks",
        path: "/task-management/task",
        icon: <GroupOutlinedIcon />,
        id: nanoid(),
      },
      
    ],
    id: nanoid(),
  },

];
