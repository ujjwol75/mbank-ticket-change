import { Alert, Box, Button, IconButton, Snackbar, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { axiosInstance } from "../../axios/axiosInterceptor";
import React, { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/deleteModal/ResponsiveDialog";
import ChannelPartnerModal from "../../components/modal/KeepMountedModal";
import FullScreenDialog from "../../components/viewPage/ViewPage";
import * as Yup from "yup";
import { useFormik } from "formik";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Salary = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [salary, setSalary] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [allowances, setAllowances] = useState([]); // To store allowance data

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20); // pageSize is predefined
  const [totalRows, setTotalRows] = useState(0); // Total rows from backend response
  const [employees, setEmployees] = useState([]);


  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/api/employee/nameList");
      setEmployees(response.data); // Assuming the response is an array of employees
      console.log(employees,"hello")
    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  };

  useEffect(() => {
    fetchEmployees(); // Fetch employee names when the component mounts
  }, []);


  const formik = useFormik({
    initialValues: {
      id: salary.id || "",
      employeeId: salary.employeeId || "",
      salaryAmount: salary.salaryAmount || "",
      currency: salary.currency || "",
      effectiveDate: salary.effectiveDate || "",
      bonus: salary.bonus || "",
      allowanceIds: salary.allowanceIds || [], // Ensure it's an array, even if empty
    },
    validationSchema: Yup.object({
      salaryAmount: Yup.number().required("Salary amount is required"),
      currency: Yup.string().required("Currency is required"),
      allowanceIds: Yup.array().min(1, "At least one allowance is required").required("Allowance selection is required"),
    }),
    onSubmit: (values) => {
      onSave(values);
      handleClose();
    },
  });


  const handleOpen = (salary = {}) => {
    setSalary(salary);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const fetchData = async (pageNumber = 0) => {
    try {
      const response = await axiosInstance.get(`/api/salary?pageNumber=${pageNumber}`);
      const { content, page } = response.data.detail;
      setData(content);
      setTotalRows(page.totalElements); // Total number of salaries
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAllowances = async () => {
    try {
      const response = await axiosInstance.get("/api/allowance/nameList");
      if (response.data && Array.isArray(response.data)) {
        setAllowances(response.data); // Update the state with the fetched allowances
        console.log('Allowances fetched:', response.data); // Log allowancesallowance
      } else {
        console.error("Error: Invalid response format", response);
      }
    } catch (error) {
      console.error("Error fetching allowances:", error);
    }
  };



  useEffect(() => {
    console.log("Allowances fetched: ", allowances);
  }, [allowances]); // This will run whenever the allowances state is updated


  useEffect(() => {
    fetchData();
    fetchAllowances();
  }, []);

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
    fetchData(newPage); // Fetch data for the new page
  };

  const handleSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/api/salary`, values);
      } else {
        await axiosInstance.post("/api/salary", values);
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
        await axiosInstance.delete(`/api/salary/${deleteItemId}`);
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
    // { field: "employeeId", headerName: "Employee Name", flex: 1 },
    {
      field: "employeeId",
      headerName: "Employee Name",
      flex: 1,
      renderCell: (params) => {
        // Find the employee by matching the employeeId
        const employee = employees.find((emp) => emp.id === params.row.employeeId);
        return employee ? employee.name : "N/A"; // Display employee name or fallback to 'N/A'
      },
    },
    { field: "salaryAmount", headerName: "Salary Amount", flex: 1 },
    { field: "currency", headerName: "Currency", flex: 1 },
    { field: "effectiveDate", headerName: "Effective Date", flex: 1 },
    { field: "bonus", headerName: "Bonus", flex: 1 },
    { field: "allowanceIds", headerName: "AllowanceIds", flex: 1,renderCell:(params)=> {
      const allowance = params?.row?.allowanceIds
      if(allowance?.length > 0){
        return (
          <>
          {allowance?.map((id)=> {
               return allowances?.find((d)=> d?.id === id)?.type
          })}
          </>
        )
      }

    } },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleOpen(params.row)} sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDeleteClick(params.row.id, params.row.channelPartnerName)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  React.useEffect(() => {
    formik.setValues({
      id: salary.id || "",
      employeeId: salary.employeeId || "",
      salaryAmount: salary.salaryAmount || "",
      currency: salary.currency || "",
      effectiveDate: salary.effectiveDate || "",
      bonus: salary.bonus || "",
      allowanceIds: salary.allowanceIds || [],
    });
  }, [salary]);

  const fields = [
    // { label: "Employee Name", name: "employeeId", type: "text", col: 12, required: false },
    {
      label: "Employee Name",
      name: "employeeId",
      type: "dymaicDropDown",
      path: "/api/employee/nameList",
      col: 12,
      required: true,
      selectionType: "id",
    },
    { label: "Salary Amount", name: "salaryAmount", type: "text", col: 12, required: true },
    { label: "Currency", name: "currency", type: "email", col: 12, required: true },
    { label: "Effective Date", name: "effectiveDate", type: "datePicker", col: 12, required: false },
    { label: "Bonus", name: "bonus", type: "text", col: 12, required: false },
    {
      label: "Allowance",
      name: "allowanceIds",
      type: "multiSelect", 
      col: 12,
      required: true,
      options: allowances.map((allowance) => ({
        label: allowance.type,
        value: allowance.id,
      })),
    },
  ];

  const onSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/api/salary`, values);
      } else {
        await axiosInstance.post("/api/salary", values);
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
        <Button onClick={() => handleOpen()} color="secondary" variant="contained" sx={{ mb: 2 }}>
          Add Salary
        </Button>
        <Box sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            checkboxSelection
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pagination
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 20, 50]} // Add 20 here
            paginationMode="server"
            rowCount={totalRows}
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
        channelPartner={salary}
        onSave={handleSave}
        formik={formik}
        open={open}
        setOpen={setOpen}
        fields={fields}
        tableName={"Salary"}
        allowances={allowances}  // Pass allowances here
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        handleClose={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
        itemName={itemToDelete}
      />
      <FullScreenDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        data={viewData}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </LocalizationProvider>
  );
};

export default Salary;
