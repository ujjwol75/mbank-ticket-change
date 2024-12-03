import { nanoid } from "nanoid";
import { lazy } from "react";
import PageNotFound from "../scenes/notFound";

const Customer = lazy(() => import("../scenes/customer"));
const Leads = lazy(() => import("../scenes/leads"));
const ChannelPartners = lazy(() => import("../scenes/channelPartners"));
const Form = lazy(() => import("../scenes/form"));
const FAQ = lazy(() => import("../scenes/faq"));
const Geography = lazy(() => import("../scenes/geography"));
const Employee = lazy(() => import("../scenes/employee"));
const Department = lazy(() => import("../scenes/department"));
const Allowance = lazy(() => import("../scenes/allowance"));
const Salary = lazy(() => import("../scenes/salary"));
const UserRoles = lazy(() => import("../scenes/userRoles"));
const Users = lazy(() => import("../scenes/users"));
const Projects = lazy(() => import("../scenes/project"));
const Tasks = lazy(() => import("../scenes/task"));
const Ticket = lazy(() => import("../scenes/ticket"))


const Dashboard = lazy(() => import("../scenes/dashboard"));
export const routes = [
  { path: "/", component: <Dashboard />, id: nanoid() },
  { path: "/customers", component: <Customer />, id: nanoid() },
  { path: "/leads", component: <Leads />, id: nanoid() },
  { path: "/channel-partners", component: <ChannelPartners />, id: nanoid() },
  { path: "/hrm/employees", component: <Employee />, id: nanoid() },
  { path: "/hrm/departments", component: <Department />, id: nanoid() },
  { path: "/hrm/allowances", component: <Allowance />, id: nanoid() },
  { path: "/hrm/salary", component: <Salary />, id: nanoid() },
  { path: "/config/user-role", component: <UserRoles />, id: nanoid() },
  { path: "/config/users", component: <Users />, id: nanoid() },
  { path: "*", component: <PageNotFound />, id: nanoid() },
  { path: "/task-management/project", component: <Projects />, id: nanoid() },
  { path: "/task-management/task", component: <Tasks />, id: nanoid() },
  { path: "/ticket", component: <Ticket />, id: nanoid() },
  // { path: "/geography", component: <Geography />, id: nanoid() },
  // { path: "/contacts", component: <Geography />, id: nanoid() },
];
