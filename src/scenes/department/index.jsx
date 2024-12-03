import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, esES, GridToolbar } from '@mui/x-data-grid';
import ConfirmationDialog from '../../components/deleteModal/ResponsiveDialog';
import { axiosInstance } from '../../axios/axiosInterceptor';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import ChannelPartnerModal from '../../components/modal/KeepMountedModal';

const Department = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState('');

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20); // pageSize is predefined
  const [totalRows, setTotalRows] = useState(0);

  const userRole = window.localStorage.getItem("userRole");


  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/department")
      const content = response.data.detail;
      setData(content);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  


  useEffect(() => {
    fetchData();
  }, []);


  const handleOpen = (partner = {}) => {
    setDepartment(partner);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/api/department`, values);
      } else {
        await axiosInstance.post('/api/department', values);
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
        await axiosInstance.delete(`/api/department/${deleteItemId}`);
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
    { field: 'name', headerName: 'Department Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
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
        </Box>
      ),
    },
  ];



  const onSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.post(`/api/department`, values);
      } else {
        await axiosInstance.post('/api/department', values);
      }
      fetchData(); // Refresh the data
      handleClose(); // Close the modal
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  const formik = useFormik({
    initialValues: {
      id: department.id || '', // Make sure to include ID for edit operations
      name: department.name || '',
      description: department.description || '',

    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string(),

    }),
    onSubmit: (values) => {
      onSave(values);
      handleClose();
    },
  });

  React.useEffect(() => {
    formik.setValues({
      id: department.id || '',
      name: department.name || '',
      description: department.description || '',

    });
  }, [department]);

  const fields = [
    { label: "Department Name", name: "name", type: "text", col: 12, required: true },
    { label: "Description", name: "description", type: "text", col: 12, required: true },

  ];




  return (
    <Box m="20px">
      <Box m="40px 0 0 0" sx={{ height: '75vh', overflowX: 'auto' }}>
        <Button onClick={() => handleOpen()} color="secondary" variant="contained" sx={{ mb: 2 }}>
          Add Department
        </Button>
        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid
            checkboxSelection
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            // pagination
            // pageSize={pageSize} // This sets the number of rows per page
            // paginationMode="server" // Ensure this is set for server-side pagination
            // rowCount={totalRows} // Total rows from your API response
            // onPageChange={handlePageChange} // This will handle page changes
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
        department={department}
        onSave={handleSave}
        open={open}
        setOpen={setOpen}
        formik={formik}
        fields={fields}
        tableName={"Department"}
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

export default Department;
