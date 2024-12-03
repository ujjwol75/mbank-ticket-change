import { Alert, Box, Button, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
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
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from "react-hot-toast";
import SearchBar from "../../components/searchBar/SearchBar";
import { useLocation } from "react-router-dom";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [lead, setLead] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [leadData, setLeadData] = useState("Lead")

  const userRole = window.localStorage.getItem("userRole");

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20); // pageSize is predefined
  const [totalRows, setTotalRows] = useState(0); // Total rows from backend response
  const [file, setFile] = useState(null);

  //search API 

  const location = useLocation();

  const [searchResults, setSearchResults] = useState([]); // New state for search results
  // ... other state variables

  const handleSearch = async (query) => {
    let endpoint = '';

    if (location.pathname.includes("customers")) {
      endpoint = `/api/customer/search?search=${query}`;
    } else if (location.pathname.includes("leads")) {
      endpoint = `/api/lead/search?search=${query}`;
    } else if (location.pathname.includes("channel-partners")) {
      endpoint = `/api/channelpartner/search?search=${query}`;
    }

    if (endpoint) {
      try {
        const response = await axiosInstance.get(endpoint);
        console.log('Search results:', response.data);
        const results = response.data.detail || [];
        setSearchResults(results);

        console.log("Updated Search Results: ", results);
      } catch (error) {
        console.error('Error searching:', error);
      }
    }

    if (!query) {
      fetchData();
      return;
    }
  };


  // to handle excel file upload 
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); // Store the file in state
    }
  };

  const handleSubmitFile = async () => {
    if (!file) {
      alert("Please select a file to upload."); // Alert if no file is selected
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosInstance.post('/api/lead/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchData(); // Refresh data after upload
      setFile(null); // Reset file state
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };



  const formik = useFormik({
    initialValues: {
      id: lead.id || "",
      channelPartnerId: lead.channelPartnerId || "",
      name: lead.name || "",
      address: lead.address || "",
      email: lead.email || "",
      url: lead.url || "",
      contactPerson: lead.contactPerson || "",
      contactNumber: lead.contactNumber || "",
      landLineNumber: lead.landLineNumber || "",
      designation: lead.designation || "",
      usingServices: lead.usingServices || "",
      existingSoftware: lead.existingSoftware || "",
      totalBranch: lead.totalBranch || "",
      marketingStatus: lead.marketingStatus || "",
      leadStatus: lead.leadStatus || "",
    },
    validationSchema: Yup.object({
      id: Yup.string(),
      createdBy: Yup.string(),

      // contactPerson: Yup.string(),
      name: Yup.string()
        .required("Lead Name is Required"),
      channelPartnerId: Yup.string().required("Select Channel Partner"),

      contactNumber: Yup.string()
        .required('Contact Number is required'),

      email: Yup.string()
        .email('Invalid email format')
        .nullable(),

      totalBranch: Yup.number()
        .typeError("Total branches must be a number")
        .nullable(),

      leadStatus: Yup.string().required("Select Lead Status"),
      marketingStatus: Yup.string().required("Select Marketing Status"),
      url: Yup.string()
        .matches(/^(https?:\/\/)?(\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, 'URL must start with "http://" or "https://" or "www." and be a valid domain.')
        .nullable(),

    }),
    onSubmit: (values) => {
      onSave(values);
      handleClose();
    },
  });

  const handleOpen = (partner = {}) => {
    // setLead(partner);
    // setOpen(true);
    console.log("partner: ", partner)
    const initialValues = {...partner,channelPartnerId:partner?.channelPartner?.id}
    console.log("initialValues",initialValues)
    // setCustomer((...partner, channelPartner:partner.channelPartner.id));
    setLead(initialValues)
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
      const response = await axiosInstance.get(`/api/lead?pageNumber=${pageNumber}`);
      const { content, page } = response.data.detail;

      setData(content);
      setTotalRows(page.totalElements); // Total number of leads
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

  const handleConvert = async (leadId) => {
    try {
      await axiosInstance.post(`/api/lead/${leadId}/convert`);
      toast.success("Lead Converted to Customer Successfully!")
      fetchData(pageNumber);
      setSnackbarMessage('Lead has been converted to Customer successfully.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error converting lead to customer:", error);
      setSnackbarMessage('Error converting lead to customer.');
      setSnackbarOpen(true);
    }
  };

  const handleSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/api/lead`, values);
      } else {
        await axiosInstance.post("/api/lead", values);
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
        await axiosInstance.delete(`/api/lead/${deleteItemId}`);
        toast.success("Lead Deleted Successfully!")
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
    {
      field: "name",
      headerName: "Lead Name",
      flex: 2,
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Typography
            noWrap // Prevent text wrapping
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              fontSize: '1rem'
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },

    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "contactNumber", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleOpen(params.row)}
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleViewOpen(params.row)}
            sx={{ mr: 1 }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleConvert(params.row.id)}
            sx={{ mr: 1 }}
          >
            <MonetizationOnIcon />
          </IconButton>
          {userRole === 'ROLE_SUPERADMIN' && (
            <IconButton
              color="secondary"
              onClick={() => handleDeleteClick(params.row.id, params.row.channelPartnerName)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  React.useEffect(() => {
    formik.setValues({
      id: lead.id || "",
      channelPartnerId: lead.channelPartnerId || "",
      name: lead.name || "",
      address: lead.address || "",
      email: lead.email || "",
      url: lead.url || "",
      contactPerson: lead.contactPerson || "",
      contactNumber: lead.contactNumber || "",
      landLineNumber: lead.landLineNumber || "",
      designation: lead.designation || "",
      existingSoftware: lead.existingSoftware || "",
      usingServices: lead.usingServices || "",
      totalBranch: lead.totalBranch || "",
      marketingStatus: lead.marketingStatus || "",
      leadStatus: lead.leadStatus || "",
    });
  }, [lead]);

  const fields = [
    {
      label: "Channel Partner",
      name: "channelPartnerId",
      type: "dymaicDropDown",
      path: "/api/channelpartner/nameList",
      col: 12,
      required: true,
      selectionType: "id",
    },
    { label: "Name", name: "name", type: "text", col: 12, required: true },
    { label: "Address", name: "address", type: "text", col: 12, required: false },
    { label: "Email", name: "email", type: "email", col: 12, required: true },
    { label: "URL", name: "url", type: "text", col: 12, required: false },
    { label: "Contact Person", name: "contactPerson", type: "text", col: 12, required: false },
    { label: "Contact Number", name: "contactNumber", type: "text", col: 12, required: true },
    { label: "Land Line Number", name: "landLineNumber", type: "text", col: 12, required: false },
    { label: "Designation", name: "designation", type: "text", col: 12, required: false },
    { label: "Existing Software", name: "existingSoftware", type: "text", col: 12, required: false },
    { label: "Using Services", name: "usingServices", type: "text", col: 12, required: false },
    { label: "Total Branch", name: "totalBranch", type: "text", col: 12, required: false },
    {
      label: "Marketing Status *", name: "marketingStatus", type: "select", options: [
        { id: "Viber", value: "Viber" },
        { id: "Whatsapp", value: "Whatsapp" },
        { id: "Messenger", value: "Messenger" },
        { id: "Facebook", value: "Facebook" }
      ], col: 12, required: true
    },
    {
      label: "Lead Status *", name: "leadStatus", type: "select", options: [
        { id: "Hot", value: "Hot" },
        { id: "Warm", value: "Warm" },
        { id: "Cold", value: "Cold" },
      ], col: 12, required: true
    },
  ];

  const onSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/api/lead`, values);
        toast.success("Lead Updated Successfully!")
      } else {
        await axiosInstance.post("/api/lead", values);
        toast.success("Lead Added Successfully!")
      }
      fetchData(pageNumber); // Refresh the data
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error adding Lead!")
    }
  };

  return (
    <Box m="20px">
      <Box m="40px 0 0 0" sx={{ height: "75vh", overflowX: "auto" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            onClick={() => handleOpen()}
            color="secondary"
            variant="contained"
            sx={{ mb: 2 }}
          >
            Add Lead
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              style={{ marginLeft: '10px' }} // Reduce margin to bring closer
            />
            <Button sx={{ marginRight: '4px' }} onClick={handleSubmitFile} color="secondary" variant="contained"> {/* Change color to match Add button */}
              Upload
            </Button>

            <SearchBar onSearch={handleSearch} />
          </Box>
        </Box>
        {/* <Box sx={{ height: "100%", width: "100%" }}>
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
                fontSize: '1rem', // Adjust the font size for cell content
              },
            }}
          />
        </Box> */}

        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid
            checkboxSelection
            rows={
              searchResults.length > 0
                ? searchResults
                : (data.length > 0 ? data : [])
            }
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pagination
            pageSize={pageSize}
            paginationMode="server"
            rowCount={totalRows}
            onPageChange={handlePageChange}
            autoHeight
            getRowId={(row) => row.id || `${row.contactNumber}-${row.channelPartnerName}`}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.secondary.main,
                color: '#ffffff',
                fontSize: '1rem',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '1rem',
              },
            }}
          />

        </Box>

      </Box>

      <ChannelPartnerModal
        channelPartner={lead}
        onSave={handleSave}
        formik={formik}
        open={open}
        setOpen={setOpen}
        fields={fields}
        tableName={"Lead"}
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
        commentData={leadData}
        setCommentData={setLeadData}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
  );
};

export default Contacts;