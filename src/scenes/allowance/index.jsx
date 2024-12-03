// import React from 'react'

// const index = () => {
//   return (
//     <div>Allowance</div>
//   )
// }

// export default index

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

const Allowance = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [allowance, setAllowance] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState('');

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20); // pageSize is predefined
  const [totalRows, setTotalRows] = useState(0);

  const userRole = window.localStorage.getItem("userRole");


  const fetchData = async (page = pageNumber) => {
    try {
      const response = await axiosInstance.get(`/api/allowance?pageNumber=${page}`)
      // setData(response.data.detail.content);
      // setTotalRows(response.data.detail.page.totalElements); // Update total rows
      const { content, page: pageData } = response.data.detail;

      setData(content);
      console.log("Content allowance: ", content)
      setTotalRows(pageData.totalElements);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  useEffect(() => {
    fetchData();
  }, [pageNumber]);

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  const handleOpen = (partner = {}) => {
    setAllowance(partner);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.post(`/api/allowance/edit`, values);
      } else {
        await axiosInstance.post('/api/allowance', values);
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
        await axiosInstance.delete(`/api/allowance/${deleteItemId}`);
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
    { field: 'type', headerName: 'Allowance Type', flex: 1 },
    { field: 'amount', headerName: 'Amount', flex: 1 },
 
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
        await axiosInstance.put(`/api/allowance`, values);
      } else {
        await axiosInstance.post('/api/allowance', values);
      }
      fetchData(); // Refresh the data
      handleClose(); // Close the modal
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  const formik = useFormik({
    initialValues: {
      id: allowance.id || '', // Make sure to include ID for edit operations
      type: allowance.type || '',
      amount: allowance.amount || '',
    },
    validationSchema: Yup.object({
      type: Yup.string().required('Required'),
      amount: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onSave(values);
      handleClose();
    },
  });

  React.useEffect(() => {
    formik.setValues({
      id: allowance.id || '',
      type: allowance.type || '',
      amount: allowance.amount || '',

    });
  }, [allowance]);

  const fields = [
    { label: "Allowance Type", name: "type", type: "text", col: 12, required: true },
    { label: "Amount", name: "amount", type: "text", col: 12, required: true },
  ];




  return (
    <Box m="20px">
      <Box m="40px 0 0 0" sx={{ height: '75vh', overflowX: 'auto' }}>
        <Button onClick={() => handleOpen()} color="secondary" variant="contained" sx={{ mb: 2 }}>
          Add Allowance
        </Button>
        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid
            checkboxSelection
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pagination
            pageSize={pageSize} // This sets the number of rows per page
            paginationMode="server" // Ensure this is set for server-side pagination
            rowCount={totalRows} // Total rows from your API response
            onPageChange={handlePageChange} // This will handle page changes
            autoHeight
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.secondary.main, // Use theme secondary color
                color: '#ffffff', // Customize header text color
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
        channelPartner={allowance}
        onSave={handleSave}
        open={open}
        setOpen={setOpen}
        formik={formik}
        fields={fields}
        tableName={"Allowance"}
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

export default Allowance;
