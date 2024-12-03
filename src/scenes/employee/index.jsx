import { Alert, Box, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { axiosInstance } from "../../axios/axiosInterceptor";
import React, { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/deleteModal/ResponsiveDialog";
import ChannelPartnerModal from "../../components/modal/KeepMountedModal";
import FullScreenDialog from "../../components/viewPage/ViewPage"; // Adjust path if needed
import * as Yup from "yup";
import { useFormik } from "formik";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CakeIcon from '@mui/icons-material/Cake';




const Employee = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [employee, setEmployee] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);


  const [employeeData, setEmployeeData] = useState("employee")

  const userRole = window.localStorage.getItem("userRole");

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20); // pageSize is predefined
  const [totalRows, setTotalRows] = useState(0); // Total rows from backend response

  // Fetch upcoming birthdays
  useEffect(() => {
    const fetchUpcomingBirthdays = async () => {
      try {
        const response = await axiosInstance.get('/api/birthday/today');
        console.log("Upcoming Birthdays Response:", response.data);
        // Set the state with the detail array
        setUpcomingBirthdays(Array.isArray(response.data.detail) ? response.data.detail : []);
        console.log("first", upcomingBirthdays)
      } catch (error) {
        console.error("Error fetching upcoming birthdays:", error);
      }
    };

    fetchUpcomingBirthdays();
  }, []);

  const isBirthdayUpcoming = (employee) => {
    // Check if upcomingBirthdays is an array before using .some()
    return Array.isArray(upcomingBirthdays) && upcomingBirthdays.some(birthday => birthday.id === employee.id);
  };

  const formik = useFormik({
    initialValues: {
      id: employee.id || "",
      fullName: employee.fullName || "",
      email: employee.email || "",
      dateOfBirth: employee.dateOfBirth || "",
      gender: employee.gender || "",
      phoneNumber: employee.phoneNumber || "",
      address: employee.address || "",
      maritalStatus: employee.maritalStatus || "",
      country: employee.country || "",
      joinedDate: employee.joinedDate || "",
      employeeStatus: employee.employeeStatus || "INACTIVE", // Default to a valid status
      department: employee.department || "", // Ensure departmentId is included
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      gender: Yup.string().required("Select Gender"),
      department: Yup.string().required("Select Department"), 
      employeeStatus: Yup.string().required("Select Employee Status"),
    }),
    onSubmit: (values) => {
      onSave(values)
      handleClose();
    },
  });


  const handleOpen = (partner = {}) => {
    console.log("employee: ", partner)
    // setEmployee(partner);

    const initialValues = {...partner, department:partner?.department?.id}
    console.log(initialValues)
    setEmployee(initialValues)
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleViewOpen = (data) => {
    setViewData(data);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => setViewDialogOpen(false);

  const fetchData = async (pageNumber = 0) => {
    try {
      const response = await axiosInstance.get(`/api/employee?pageNumber=${pageNumber}`);
      const { content, page } = response.data.detail;

      setData(content);
      
      setTotalRows(page.totalElements); // Total number of employees
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
    fetchData(newPage); // Fetch data for the new page
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleSave = async (values) => {
    try {
      
      if (values.id) {
        await axiosInstance.put("/api/employee", values)
      } else {
        await axiosInstance.post("/api/employee", values);
      }
      fetchData(pageNumber);
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteItemId(id);
    setItemToDelete(name);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteItemId) {
        await axiosInstance.delete(`/api/employee/${deleteItemId}`);
        fetchData(pageNumber);
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const columns = [
    // { field: "id", headerName: "ID", flex: 0.5 },
    { field: "fullName", headerName: "Full Name", flex: 1},
    // { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      renderCell: (params) => {
        return params.row.department ? params.row.department.name : "N/A";  
      },
    },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      // flex: 2,
      renderCell: (params) => (
        <Box>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleOpen(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>

          {userRole === 'ROLE_SUPERADMIN' && ( // Check user role before rendering the delete button
            <Button
              color="secondary"
              variant="contained"
              onClick={() => handleDeleteClick(params.row.id, params.row.departmentName)}
            >
              Delete
            </Button>
          )}

          {isBirthdayUpcoming(params.row) && (
            <Button
              sx={{ cursor: 'pointer', color: 'orange' }} // Button for upcoming birthday
              onClick={() => {
                setSnackbarMessage(`Birthday reminder for ${params.row.firstName} ${params.row.lastName}`);
                setSnackbarOpen(true);
              }}
            >
              <CakeIcon />
            </Button>
          )}


        </Box>
      ),
    },
  ];

  React.useEffect(() => {
    formik.setValues({
      id: employee.id || "",
      fullName: employee.fullName || "",

      email: employee.email || "",
      dateOfBirth: employee.dateOfBirth || "",
      gender: employee.gender || "",
      phoneNumber: employee.phoneNumber || "",
      address: employee.address || "",
      maritalStatus: employee.maritalStatus || "",
      country: employee.country || "",
      joinedDate: employee.joinedDate || null,
      employeeStatus: employee.employeeStatus || "ACTIVE",
      // department: employee.department || "",
      // department: employee.department ? employee.department.id : "",
      department: employee.department || { id: "", name: "" },  // Ensure it's an object

    });
  }, [employee]);

  const fields = [
    {
      label: "Department",
      name: "department",
      type: "dymaicDropDown",
      path: "/api/department/nameList",
      col: 12,
      required: true,
      selectionType: "id",
      defaultValue: employee.department?.name || ""
    },
    { label: "Full Name", name: "fullName", type: "text", col: 12, required: true },
    { label: "Email", name: "email", type: "email", col: 12, required: true },
    { label: "Date Of Birth", name: "dateOfBirth", type: "datePicker", col: 12, required: false },
    { label: "Gender", name: "gender", type: "select", options: [{ id: "MALE", value: "MALE" }, { id: "FEMALE", value: "FEMALE" }, { id: "OTHER", value: "OTHER" }], col: 12, required: false },
    { label: "Phone Number", name: "phoneNumber", type: "text", col: 12, required: false },
    { label: "Address", name: "address", type: "text", col: 12, required: false },
    { label: "Marital Status", name: "maritalStatus", type: "select", col: 12, options: [{ id: "SINGLE", value: "SINGLE" }, { id: "MARRIED", value: "MARRIED" }, {id:"DIVORCED", value:"DIVORCED"}, {id:"WIDOWED", value:"WIDOWED"}, {id:"SEPARATED", value:"SEPARATED"}], required: false },
    { label: "Country", name: "country", type: "text", col: 12, required: false },
    { label: "Joined Date", name: "joinedDate", type: "datePicker", col: 12, required: false },
    { label: "Employee Status", name: "employeeStatus", type: "select", options: [{ id: "ACTIVE", value: "ACTIVE" }, { id: "INACTIVE", value: "INACTIVE" }], col: 12, required: false },
  ];

  const onSave = async (values) => {
    if (values.department && typeof values.department === 'object') {
      values.department = values.department.id ? { id: values.department.id, name: values.department.name } : { id: "", name: "" };
    } else {
      // If it's just an ID, convert it to an object
      values.department = { id: values.department, name: "" }; // Set a default or empty name
    }

    try {
      
      if (values.id) {
        await axiosInstance.put(`/api/employee`, values);
      } else {
        await axiosInstance.post("/api/employee", values);
      }
      fetchData(pageNumber); // Refresh the data
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box m="20px">
        <Box m="40px 0 0 0" sx={{ height: "75vh", overflowX: "auto" }}>
          <Button
            onClick={() => handleOpen()}
            color="secondary"
            variant="contained"
            sx={{ mb: 2 }}
          >
            Add Employee
          </Button>
          <Box sx={{ height: "100%", width: "100%" }}>
            <DataGrid
              checkboxSelection
              rows={data}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              pagination
              pageSize={pageSize}
              rowsPerPageOptions={[2]} // Only one option since pageSize is fixed
              paginationMode="server"
              rowCount={totalRows} // Total rows
              onPageChange={handlePageChange}
              autoHeight
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: theme.palette.secondary.main,
                  color: "#ffffff",
                  fontSize: '1rem'
                },
                '& .MuiDataGrid-cell': {
                fontSize: '1rem',
              },
              }}
            />
          </Box>
        </Box>

        <ChannelPartnerModal
          channelPartner={employee}
          onSave={handleSave}
          formik={formik}
          open={open}
          setOpen={setOpen}
          fields={fields}
          tableName={"Employee"}
          selectedDepartment={formik.values.department.id}
        />
        <ConfirmationDialog
          open={deleteDialogOpen}
          handleClose={handleDeleteCancel}
          handleConfirm={handleDeleteConfirm}
          itemName={itemToDelete}
        />
        <FullScreenDialog
          open={viewDialogOpen}
          onClose={handleViewClose}
          data={viewData}
          commentData={employeeData}
          setCommentData={setEmployeeData}
        />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'auto',
            }
          }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarMessage.includes("Error") ? "error" : "success"}
            sx={{
              width: '100%',
              textAlign: 'center',
              justifyContent: 'center'
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Employee;
