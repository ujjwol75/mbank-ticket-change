import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios/axiosInterceptor";
import Button from '@mui/material/Button';
import ConfirmationDialog from '../../components/deleteModal/ResponsiveDialog';
import ChannelPartnerModal from '../../components/modal/KeepMountedModal';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import FullScreenDialog from "../../components/viewPage/ViewPage";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import SearchBar from "../../components/searchBar/SearchBar";
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles({
  grid: {
    display: "flex",
    flexDirection: "column-reverse"
  }
});


const Invoices = () => {
  const classes = useStyles();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);

  const [customer, setCustomer] = useState({});
  const [open, setOpen] = useState(false);

  const [viewData, setViewData] = useState(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [customerData, setcustomerData] = useState("Customer")

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState('');

  //Pagination 
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20);
  const [totalRows, setTotalRows] = useState(0);

  const userRole = window.localStorage.getItem("userRole");

  const location = useLocation();

  //search API 

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

  const fetchData = async (page = pageNumber) => {
    try {
      const response = await axiosInstance.get(`/api/customer?pageNumber=${page}`);
      const { content, page: pageData } = response.data.detail;

      setData(content);
      setTotalRows(pageData.totalElements);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    fetchData(); // Fetch data on initial render and when pageNumber changes
  }, [pageNumber]);

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };


  const handleOpen = (partner = {}) => {
    const initialValues = {...partner,channelPartnerId:partner?.channelPartner?.id}
    console.log(initialValues)
    // setCustomer((...partner, channelPartner:partner.channelPartner.id));
    setCustomer(initialValues)
    setOpen(true);
  };

  const handleViewOpen = (data) => {
    setViewData(data);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => setViewDialogOpen(false);

  const handleClose = () => setOpen(false);


  const handleSave = async (values) => {
    try {
      let newRow;
      if (values.id) {
        // Edit an existing customer
        await axiosInstance.put(`/api/customer`, values);
        newRow = { ...values }; 
      } else {
        
        const response = await axiosInstance.post('/api/customer', values);
        newRow = response.data.detail; 
        toast.success("Customer Added Successfully!");
      }
  

      setData((prevData) => [newRow, ...prevData]);
  
      fetchData(pageNumber); 
      handleClose(); 
    } catch (error) {
      console.error('Error saving data:', error);
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
        await axiosInstance.delete(`/api/customer/${deleteItemId}`);
        toast.success("Customer Deleted Successfully!")
        fetchData(pageNumber);
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const columns = [
    {
      field: "name",
      headerName: "Customer Name",
      flex: 2,
      width: 300,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Typography
            noWrap
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
    { field: 'contactNumber', headerName: 'Phone', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'contactPerson', headerName: 'Contact Person', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
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


  const onSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/api/customer`, values);
        toast.success("Customer Updated Successfully!")
      } else {
        await axiosInstance.post('/api/customer', values);
        toast.success("Customer Added Successfully!")
      }
      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  //--------values to pass for the KeepMountedModal----------------

  const formik = useFormik({
    initialValues: {
      id: customer.id || '',
      channelPartnerId: customer.channelPartnerId || '',
      name: customer.name || '',
      address: customer.address || '',

      email: customer.email || '',
      url: customer.url || '',
      contactPerson: customer.contactPerson || '',

      contactNumber: customer.contactNumber || '',
      city: customer.city || '',
      state: customer.state || '',
      country: customer.country || '',
      cellNumber: customer.cellNumber || '',
      panNo: customer.panNo || '',
      vatNo: customer.vatNo || '',
    },
    validationSchema: Yup.object({
      channelPartnerId: Yup.string().required("Channel Partner is Required"),
      name: Yup.string().required('Customer Name is Required'),
      contactPerson: Yup.string(),
      contactNumber: Yup.string().required("Contact Number is Required"),
      email: Yup.string().email('Invalid email address').required('Email is Required'),
      address: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      country: Yup.string(),
      cellNumber: Yup.string()
        .matches(/^(984|985|986|980|981|982)\d{7}$/, 'Must be a valid contact number')
        .nullable(),
      panNo: Yup.string(),
      vatNo: Yup.string(),
      url: Yup.string()
        .matches(/^(https?:\/\/)?(\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, 'URL must start with "http://" or "https://" or "www." and be a valid domain.')
        .nullable(),
    }),
    onSubmit: (values) => {
      onSave(values);
      handleClose();
    },
  });

  //Edit data to be shown in modal
  React.useEffect(() => {
    formik.setValues({
      id: customer.id || '',
      channelPartnerId: customer.channelPartnerId || '',
      name: customer.name || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      country: customer.country || '',
      contactNumber: customer.contactNumber || '',
      email: customer.email || '',
      url: customer.url || '',
      contactPerson: customer.contactPerson || '',

      cellNumber: customer.cellNumber || '',
      panNo: customer.panNo || '',
      vatNo: customer.vatNo || '',
    });
  }, [customer]);


  //Add and Edit Data in Modal
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
    { label: "City", name: "city", type: "text", col: 12, required: false },

    { label: "State", name: "state", type: "text", col: 12, required: false },
    { label: "Country", name: "country", type: "text", col: 12, required: false },
    { label: "Contact Number", name: "contactNumber", type: "text", col: 12, required: true },

    { label: "Email", name: "email", type: "email", col: 12, required: true },
    { label: "URL", name: "url", type: "text", col: 12, required: false },
    { label: "Contact Person", name: "contactPerson", type: "text", col: 12, required: false },

    { label: "Cell Number", name: "cellNumber", type: "text", col: 12, required: false },
    { label: "PAN Number", name: "panNo", type: "text", col: 12, required: false },
    { label: "VAT Number", name: "vatNo", type: "text", col: 12, required: false },
    // { label: "Agreement Date", name: "agreementDate", type: "date", col: 12, required: false },
    // { label: "Agreement Expiry Date", name: "agreementExpiryDate", type: "date", col: 12, required: false },
  ];


  return (
    <Box m="20px">
      <Box m="40px 0 0 0" sx={{ height: '80vh', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button onClick={() => handleOpen()} color="secondary" variant="contained" sx={{ mb: 2 }}>
            Add Customer
          </Button>
          <SearchBar onSearch={handleSearch} />
        </Box>
        {/* <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid
            checkboxSelection
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pagination
            pageSize={pageSize}
            paginationMode="server"
            rowCount={totalRows} // Total rows
            onPageChange={handlePageChange}
            autoHeight
            row
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.secondary.main, 
                color: '#ffffff', 
                fontSize: '1rem'
              },
              '& .MuiDataGrid-cell': {
                fontSize: '1rem', 
              },
            }}
          />

        </Box> */}
        {/* <CustomPagination /> */}

        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid
            className={classes.grid}
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
        channelPartner={customer}
        onSave={handleSave}
        open={open}
        setOpen={setOpen}
        formik={formik}
        fields={fields}
        tableName={"Customer"}
      />

      <FullScreenDialog
        open={viewDialogOpen}
        onClose={handleViewClose}
        data={viewData}
        commentData={customerData}
        setCommentData={setcustomerData}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        handleClose={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
        itemName={itemToDelete}
      />
    </Box>
  );
};

export default Invoices;