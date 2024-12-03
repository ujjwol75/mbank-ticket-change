import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import ConfirmationDialog from '../../components/deleteModal/ResponsiveDialog';
import userRolesModal from '../../components/modal/KeepMountedModal';
import { axiosInstance } from '../../axios/axiosInterceptor';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ChannelPartnerModal from '../../components/modal/KeepMountedModal';

const UserRoles = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [userRoles, setUserRoles] = useState({});
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
      const response = await axiosInstance.get(`/api/userrole?pageNumber=${page}`)
      // setData(response.data.detail.content);
      // setTotalRows(response.data.detail.page.totalElements); // Update total rows
      const { content, page: pageData } = response.data.detail;

      setData(content);
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
    setUserRoles(partner);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/api/userrole`, values);
      } else {
        await axiosInstance.post('/api/userrole', values);
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
        await axiosInstance.delete(`/api/userrole/${deleteItemId}`);
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
    { field: 'userRoleName', headerName: 'User Role Name', flex: 1 },


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
          {userRole === 'ROLE_SUPERADMIN' && ( 
            <IconButton
              color="secondary"
              onClick={() => handleDeleteClick(params.row.id, params.row.userRolesName)}
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
        await axiosInstance.put(`/api/userrole`, values);
      } else {
        await axiosInstance.post('/api/userrole', values);
      }
      fetchData(); // Refresh the data
      handleClose(); // Close the modal
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  const formik = useFormik({
    initialValues: {
      id: userRoles.id || '', // Make sure to include ID for edit operations
      userRoleName: userRoles.userRoleName || '',

    },
    validationSchema: Yup.object({
        userRoleName: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onSave(values);
      handleClose();
    },
  });

  React.useEffect(() => {
    formik.setValues({
      id: userRoles.id || '',
      userRoleName: userRoles.userRoleName || '',

    });
  }, [userRoles]);

  const fields = [
    { label: "User Role Name", name: "userRoleName", type: "text", col: 12, required: true },

  ];




  return (
    <Box m="20px">
      <Box m="40px 0 0 0" sx={{ height: '75vh', overflowX: 'auto' }}>
        <Button onClick={() => handleOpen()} color="secondary" variant="contained" sx={{ mb: 2 }}>
          Add User Roles
        </Button>
        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid
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
            // rowHeight={70}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.secondary.main, 
                color: '#ffffff',
                fontSize: '1rem' 
              },
              '& .MuiDataGrid-cell': {
                fontSize: '1rem', // Adjust the font size for cell content
              },
            }}
          />


        </Box>
      </Box>
      <ChannelPartnerModal
        channelPartner={userRoles}
        onSave={handleSave}
        open={open}
        setOpen={setOpen}
        formik={formik}
        fields={fields}
        tableName={"ADD USER ROLES"}
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

export default UserRoles;
