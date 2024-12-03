import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import ConfirmationDialog from '../../components/deleteModal/ResponsiveDialog';
import { axiosInstance } from '../../axios/axiosInterceptor';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ChannelPartnerModal from '../../components/modal/KeepMountedModal';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const Users = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState('');

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20);
  const [totalRows, setTotalRows] = useState(0);

  const [passwordResetDialogOpen, setPasswordResetDialogOpen] = useState(false);
  const [passwordResetUser, setPasswordResetUser] = useState(null);

  const userRole = window.localStorage.getItem("userRole");

  // const fetchUserRoles = () => {
  //   return axiosInstance.get('/api/userrole/nameList')
  //     .then(response => {
  //       return response.data;
  //     })
  //     .catch(error => {
  //       console.error('Error fetching user roles:', error);
  //     });
  // };


  // const fetchDepartments = () => {
  //   return axiosInstance.get('/api/department/nameList')
  //     .then(response => {
  //       return response.data;
  //     })
  //     .catch(error => {
  //       console.error('Error fetching deapartment Role', error)
  //     })

  // };

  // const fetchData = () => {
  //   axiosInstance.get('/api/user')
  //     .then(userResponse => {
  //       const userData = userResponse.data.detail;

  //       return Promise.all([fetchUserRoles(), fetchDepartments()])
  //         .then(([rolesData, departmentsData]) => {
  //           const roleMap = Object.fromEntries(rolesData.map(role => [role.id, role.name]));
  //           const departmentMap = Object.fromEntries(departmentsData.map(dept => [dept.id, dept.name]));

  //           const transformedData = userData.map(user => ({
  //             ...user,
  //             userRoleId: roleMap[user.userRoleId] || user.userRoleId,
  //             departmentId: departmentMap[user.departmentId] || user.departmentId,
  //           }));

  //           setData(transformedData);
  //         })
  //         .catch(error => {
  //           console.error('Error fetching roles or departments:', error);
  //         });
  //     })
  //     .catch(error => {
  //       console.error('Error fetching users:', error);
  //     });
  // };


  const fetchData = async (pageNumber = 0) => {
    try {
      const response = await axiosInstance.get('/api/user');
      const usersData = response.data.detail;

      // const usersData = content;
      console.log("users: ", usersData)
      setData(usersData)
      // setTotalRows(page.totalElements); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("fetchData", fetchData)
  }, [pageNumber]);

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  const handleOpen = (partner = {}) => {

    
    setUser(partner);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/api/user`, values);
      } else {
        await axiosInstance.post('/api/user', values);
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
        await axiosInstance.delete(`/api/user/${deleteItemId}`);
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

  // handle password reset
  const handlePasswordReset = async (userId) => {
    try {
      await axiosInstance.post(`/api/user/password-reset`, { userId });
      alert("Password reset request sent successfully.");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password.");
    }
  };

  // Open password reset dialog
  const handlePasswordResetDialogOpen = (user) => {
    setPasswordResetUser(user);
    setPasswordResetDialogOpen(true);
  };

  const handlePasswordResetDialogClose = () => {
    setPasswordResetDialogOpen(false);
    setPasswordResetUser(null);
  };

  // Handle password reset form submission
  const handlePasswordResetSubmit = async (values) => {
    try {
      if (passwordResetUser) {
        await axiosInstance.post(`/api/user/password-reset`, {
          userId: passwordResetUser.id,
          newPassword: values.newPassword,
        });
        alert("Password reset successfully.");
        handlePasswordResetDialogClose();
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password.");
    }
  };



  const columns = [
    { field: 'name', headerName: 'User Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'contact', headerName: 'Contact Number', flex: 1 },
    { field: 'userRoleId', headerName: 'User Role', flex: 1 },
    // { field: 'departmentId', headerName: 'Department', flex: 1 },
    {
      field: "departmentId",
      headerName: "Department",
      flex: 1,
      renderCell: (params) => {
        console.log("columns in user: ", params)
        return params.row.department ? params.row.department.name : "N/A";  
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          {userRole === 'ROLE_SUPERADMIN' && (
            <IconButton
              color="primary"
              onClick={() => handleOpen(params.row)}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          )}
          {userRole === 'ROLE_SUPERADMIN' && (
            <IconButton
              color="secondary"
              onClick={() => handleDeleteClick(params.row.id, params.row.name)}
            >
              <DeleteIcon />
            </IconButton>
          )}
          {userRole === 'ROLE_SUPERADMIN' && (
            <IconButton
              color="default"
              onClick={() => handlePasswordResetDialogOpen(params.row)}
              sx={{ ml: 1 }} // Add some margin-left to space out the icons
            >
              <LockResetIcon />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  const formik = useFormik({
    initialValues: {
      id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      contact: user.contact || '',
      password: user.password || '',
      departmentId: user.departmentId || '',
      userRoleId: user.userRoleId || '',
    },
    validationSchema: Yup.object({
      userRoleId: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      handleSave(values);
      handleClose();
    },
  });

  useEffect(() => {
    formik.setValues({
      id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      contact: user.contact || '',
      password: user.password || '',
      departmentId: user.departmentId || '',
      userRoleId: user.userRoleId || '',
    });
  }, [user]);

  const fields = [
    {
      label: "Department Name",
      name: "departmentId",
      type: "dymaicDropDown",
      path: "/api/department/nameList",
      col: 12,
      required: false,
      selectionType: "id",
    },
    { label: "User Name", name: "name", type: "text", col: 12, required: true },
    { label: "Email", name: "email", type: "email", col: 12, required: true },
    { label: "Password", name: "password", type: "password", col: 12, required: true },

    { label: "Contact", name: "contact", type: "text", col: 12, required: true },

    {
      label: "User Role",
      name: "userRoleId",
      type: "dymaicDropDown",
      path: "/api/userrole/nameList",
      col: 12,
      required: false,
      selectionType: "id",
    },
  ];

  return (
    <Box m="20px">
      <Box m="40px 0 0 0" sx={{ height: '75vh', overflowX: 'auto' }}>
        {userRole === 'ROLE_SUPERADMIN' && (
          <Button onClick={() => handleOpen()} color="secondary" variant="contained" sx={{ mb: 2 }}>

            Add User
          </Button>
        )}
        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid
            checkboxSelection
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
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
        channelPartner={user}
        onSave={handleSave}
        open={open}
        setOpen={setOpen}
        formik={formik}
        fields={fields}
        tableName={"ADD USER"}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        handleClose={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
        itemName={itemToDelete}
      />

      {/* Password Reset Dialog */}
      <Dialog
        open={passwordResetDialogOpen}
        onClose={handlePasswordResetDialogClose}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="New Password"
              name="password"
              type="password"
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordResetDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePasswordResetSubmit} color="primary">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Users;
