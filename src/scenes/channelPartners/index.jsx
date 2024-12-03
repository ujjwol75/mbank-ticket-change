import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import ConfirmationDialog from '../../components/deleteModal/ResponsiveDialog';
import ChannelPartnerModal from '../../components/modal/KeepMountedModal';
import { axiosInstance } from '../../axios/axiosInterceptor';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Tooltip, Typography } from '@mui/material';
import toast from "react-hot-toast";
import UploadExcelFile from '../../components/UploadExcelFile/UploadExcelFile';
import SearchBar from '../../components/searchBar/SearchBar';
import { useLocation } from 'react-router-dom';

const Invoices = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [channelPartner, setChannelPartner] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState('');

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20); // pageSize is predefined
  const [totalRows, setTotalRows] = useState(0);
  const [file, setFile] = useState(null); // State to hold the uploaded file

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
      const response = await axiosInstance.get(`/api/channelpartner?pageNumber=${page}`);
      const { content, page: pageData } = response.data.detail;

      setData(content);
      setTotalRows(pageData.totalElements);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };





  // const fetchData = async (page = pageNumber) => {
  //   try {
  //     const response = await axiosInstance.get(`/api/channelpartner?pageNumber=${page}`)
  //     const { content, page: pageData } = response.data.detail;

  //     setData(content);
  //     setTotalRows(pageData.totalElements);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // to handle excel file upload 
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleSubmitFile = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosInstance.post('/api/channelpartner/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchData();
      setFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };




  useEffect(() => {
    fetchData();
  }, [pageNumber]);

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  const handleOpen = (partner = {}) => {
    setChannelPartner(partner);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.post(`/api/channelpartner/edit`, values);

      } else {
        await axiosInstance.post('/api/channelpartner', values);
      }
      fetchData();
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
        await axiosInstance.delete(`/api/channelpartner/${deleteItemId}`);
        toast.success("Channel Partner successfully Deleted!")
        fetchData();
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
    // { field: 'id', headerName: 'ID', width: 90 },
    // { field: 'channelPartnerName', headerName: 'Channel Partner Name', flex: 1 },
    {
      field: 'channelPartnerName',
      headerName: 'Channel Partner Name',
      flex: 2,
      width: 200, // Set a fixed width here
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Typography
            noWrap // Prevent text wrapping
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%', // Ensure it takes full width
              fontSize: '1rem', // Increase font size here
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
    { field: 'city', headerName: 'City', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleOpen(params.row)}
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          {userRole === 'ROLE_SUPERADMIN' && ( // Check user role before rendering the delete icon
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
        await axiosInstance.post(`/api/channelpartner/edit`, values);
        toast.success("Channel Partner successfully Updated!")
      } else {
        await axiosInstance.post('/api/channelpartner', values);
        toast.success("Channel Partner successfully Added!")

      }
      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  const formik = useFormik({
    initialValues: {
      id: channelPartner.id || '',
      channelPartnerName: channelPartner.channelPartnerName || '',
      email: channelPartner.email || '',
      contactNumber: channelPartner.contactNumber || '',
      address: channelPartner.address || '',
      city: channelPartner.city || '',
      state: channelPartner.state || '',
      country: channelPartner.country || '',
      url: channelPartner.url || '',
      cellNumber: channelPartner.cellNumber || '',
      vat: channelPartner.vat || '',
    },
    validationSchema: Yup.object({

      channelPartnerName: Yup.string()
        .matches(/^(?!\d+$)[A-Za-z0-9\s!@&()_.-]+$/, 'Channel partner name must be alphabetic, alphanumeric, or include specific special characters (not numeric only)')
        .required('Channel Partner Name is Required'),



      email: Yup.string()
        .email('Invalid email format')
        .required("Email is required"),

      contactNumber: Yup.string()
        .required("Contact Number is required"),


      address: Yup.string(),

      city: Yup.string(),

      state: Yup.string(),

      country: Yup.string()
        .required("Required"),

      url: Yup.string()
        .matches(/^(https?:\/\/)?(\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, 'URL must start with "http://" or "https://" or "www." and be a valid domain.')
        .nullable(),


      cellNumber: Yup.string()
        .matches(/^(984|985|986|980|981|982)\d{7}$/, 'Must be a valid contact number')
        .nullable(),



      vat: Yup.string()
        .matches(/^[A-Za-z0-9]+$/, 'VAT must be alphanumeric')
        .nullable(),
    }),



    onSubmit: (values) => {
      onSave(values);
      handleClose();
    },
  });

  React.useEffect(() => {
    formik.setValues({
      id: channelPartner.id || '',
      channelPartnerName: channelPartner.channelPartnerName || '',
      email: channelPartner.email || '',
      contactNumber: channelPartner.contactNumber || '',
      address: channelPartner.address || '',
      city: channelPartner.city || '',
      state: channelPartner.state || '',
      country: channelPartner.country || '',
      url: channelPartner.url || '',
      cellNumber: channelPartner.cellNumber || '',
      vat: channelPartner.vat || '',
    });
  }, [channelPartner]);

  const fields = [
    { label: "Channel Partner Name", name: "channelPartnerName", type: "text", col: 12, required: true },
    { label: "Email", name: "email", type: "email", col: 12, required: true },
    { label: "Contact Number", name: "contactNumber", type: "text", col: 12, required: true },
    { label: "Address", name: "address", type: "text", col: 12, required: false },
    { label: "City", name: "city", type: "text", col: 12, required: false },
    { label: "State", name: "state", type: "text", col: 12, required: false },
    { label: "Country", name: "country", type: "text", col: 12, required: true },
    { label: "URL", name: "url", type: "text", col: 12, required: false },
    {
      label: "Cell Number",
      name: "cellNumber",
      type: "text",
      col: 12,
      required: false,
      validation: Yup.string()
        .max(10, "Cell number must be at most 10 characters")
        .nullable(),
    },
    { label: "VAT", name: "vat", type: "text", col: 12, required: false },
  ];




  return (
    <Box m="20px">
      <Box m="40px 0 0 0" sx={{ height: '75vh', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button onClick={() => handleOpen()} color="secondary" variant="contained">
            Add Channel Partner
          </Button>

          <UploadExcelFile />

          <SearchBar onSearch={handleSearch} />

        </Box>

        <Box sx={{ height: '100%', width: '100%' }}>
          {/* <DataGrid
            checkboxSelection
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pagination
            pageSize={pageSize}
            paginationMode="server"
            rowCount={totalRows}
            onPageChange={handlePageChange}
            autoHeight
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
          /> */}

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
      </Box>
      <ChannelPartnerModal
        channelPartner={channelPartner}
        onSave={handleSave}
        open={open}
        setOpen={setOpen}
        formik={formik}
        fields={fields}
        tableName={"Channel Partner"}
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