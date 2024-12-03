// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Close';
// import toast from "react-hot-toast";
// import {
//     GridRowModes,
//     DataGrid,
//     GridToolbarContainer,
//     GridActionsCellItem,
//     GridRowEditStopReasons,
// } from '@mui/x-data-grid';
// import { axiosInstance } from '../../axios/axiosInterceptor';
// import { gridClasses, Typography } from '@mui/material';
// import { grey } from '@mui/material/colors';

// function EditToolbar({ setRows, setRowModesModel }) {
//     const handleClick = () => {
//         const id = Date.now();  // Unique ID for new row
//         const newRow = { id, title: '', description: '', ticketStatus: 'OPEN', ticketType: 'BUG', ticketRaisedById: 1, customerId: 1, assignedToId: 1, isNew: true };
//         setRows((oldRows) => [...oldRows, newRow]);
//         setRowModesModel((oldModel) => ({
//             ...oldModel,
//             [id]: { mode: GridRowModes.Edit, fieldToFocus: 'title' },
//         }));
//     };

//     return (
//         <GridToolbarContainer>
//             <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//                 Add Ticket
//             </Button>
//         </GridToolbarContainer>
//     );
// }

// export default function FullFeaturedCrudGrid() {
//     const [rows, setRows] = React.useState([]);
//     const [pageSize, setPageSize] = React.useState(20);
//     const [rowModesModel, setRowModesModel] = React.useState({});

//     const handleSaveClick = async (id) => {
//         try {
//             const updatedRow = rows.find((row) => row.id === id);

//             // If the row is new, don't include the 'id' in the POST request
//             if (updatedRow.isNew) {
//                 const response = await axiosInstance.post('/api/ticket', updatedRow);
//                 const createdTicket = response.data; // Assuming the response contains the created ticket with its ID
//                 setRows((oldRows) =>
//                     oldRows.map((row) => (row.id === id ? createdTicket : row)) // Update the row with the new ticket ID
//                 );
//             } else {
//                 // If it's an existing ticket, send the id in the PUT request
//                 const response = await axiosInstance.put(`/api/ticket`, updatedRow);
//                 const updatedRows = rows.map((row) => (row.id === id ? { ...row, ...updatedRow } : row));
//                 setRows(updatedRows);
//             }

//             setRowModesModel((prev) => ({
//                 ...prev,
//                 [id]: { mode: 'View' },
//             }));
//         } catch (error) {
//             console.error('Error saving ticket:', error);
//             toast.error('Failed to save ticket');
//         }
//     };

//     const handleRowEditStop = (params, event) => {
//         if (params.reason === GridRowEditStopReasons.rowFocusOut) {
//             event.defaultMuiPrevented = true;
//         }
//     };

//     const handleRowModesModelChange = (newRowModesModel) => {
//         setRowModesModel(newRowModesModel);
//     };

//     const handleEditClick = (id) => () => {
//         setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
//     };

//     const handleDeleteClick = (id) => () => {
//         axiosInstance.delete(`/api/ticket/${id}`).then(() => {
//             setRows(rows.filter((row) => row.id !== id));
//             toast.success('Ticket deleted successfully');
//         }).catch((error) => {
//             console.error('Error deleting ticket:', error);
//             toast.error('Failed to delete ticket');
//         });
//     };

//     const handleCancelClick = (id) => () => {
//         setRowModesModel({
//             ...rowModesModel,
//             [id]: { mode: GridRowModes.View, ignoreModifications: true },
//         });

//         const editedRow = rows.find((row) => row.id === id);
//         if (editedRow.isNew) {
//             setRows(rows.filter((row) => row.id !== id)); // Remove new row if canceled
//         }
//     };

//     const fetchData = async () => {
//         try {
//             const response = await axiosInstance.get("/api/ticket");
//             setRows(response.data.detail.content);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     React.useEffect(() => {
//         fetchData();
//     }, []);

//     const processRowUpdate = (newRow) => {
//         const updatedRow = { ...newRow, isNew: false };
//         setRows((rows) => rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
//         return updatedRow;
//     };

//     const columns = [
//         { field: 'title', headerName: 'Title', width: 180, editable: true },
//         { field: 'description', headerName: 'Description', width: 300, editable: true },
//         { field: 'ticketStatus', headerName: 'Status', width: 120, editable: true },
//         { field: 'ticketType', headerName: 'Type', width: 120, editable: true, type: 'singleSelect', valueOptions: ['BUG', 'DEVELOPMENT', 'SUPPORT'] },
//         { field: 'ticketRaisedById', headerName: 'Raised By', width: 150, renderCell: (params) => params.row.ticketRaisedBy ? params.row.ticketRaisedBy.id : '' },
//         { field: 'customerId', headerName: 'Customer ID', width: 120, editable: true, renderCell: (params) => params.row.customer ? params.row.customer.id : '' },
//         { field: 'assignedToId', headerName: 'Assigned To', width: 150, editable: true, renderCell: (params) => params.row.assignedTo ? params.row.assignedTo.id : '' },
//         {
//             field: 'actions',
//             type: 'actions',
//             headerName: 'Actions',
//             width: 100,
//             getActions: ({ id }) => {
//                 const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
//                 if (isInEditMode) {
//                     return [
//                         <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} />,
//                         <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={handleCancelClick(id)} />,
//                     ];
//                 }
//                 return [
//                     <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} />,
//                     <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} />,
//                 ];
//             },
//         },
//     ];

//     return (
//         <Box m="20px">
//             <Box m="40px 0 0 0" sx={{ height: '75vh', overflowX: 'auto' }}>
//                 <Typography variant='h3' component='h3' sx={{ textAlign: 'center', mt: '3', mb: '3' }}>
//                     Manage Tickets
//                 </Typography>
//                 <DataGrid
//                     rows={rows}
//                     columns={columns}
//                     editMode="row"
//                     getRowId={(row) => row.id}
//                     rowsPerPageOptions={[20, 40, 60]}
//                     pageSize={pageSize}
//                     onRowEditCommit={(params) => handleSaveClick(params.id)} // Handle row save directly
//                     onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
//                     rowModesModel={rowModesModel}
//                     onRowModesModelChange={handleRowModesModelChange}
//                     onRowEditStop={handleRowEditStop}
//                     getRowSpacing={(params) => ({
//                         top: params.isFirstVisible ? 0 : 5,
//                         bottom: params.isLastVisible ? 0 : 5,
//                     })}
//                     components={{
//                         Toolbar: () => <EditToolbar setRows={setRows} setRowModesModel={setRowModesModel} />,
//                     }}
//                     sx={{
//                         [`& .${gridClasses.row}`]: {
//                             bgcolor: (theme) => theme.palette.mode === 'light' ? grey[200] : grey[900],
//                         },
//                         '& .MuiDataGrid-columnHeaders': {
//                             backgroundColor: '#4caf50',
//                             color: 'white',
//                         },
//                         '& .MuiDataGrid-columnHeaderTitle': {
//                             fontWeight: 'bold',
//                         },
//                     }}
//                 />

//             </Box>
//         </Box>
//     );
// }



// ===================================================================================================================================================

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
import ViewTicket from "./ViewTicket";


const useStyles = makeStyles({
    //   grid: {
    //     display: "flex",
    //     flexDirection: "column-reverse"
    //   }
});


const Invoices = () => {
    const classes = useStyles();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [data, setData] = useState([]);

    const [ticket, setTicket] = useState({});
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
            const response = await axiosInstance.get(`/api/ticket`);
            const { content, page: pageData } = response.data.detail;
            console.log("ticket: :::", response.data.detail)
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
        const initialValues = { ...partner, channelPartnerId: partner?.channelPartner?.id }
        console.log(initialValues)
        // setCustomer((...partner, channelPartner:partner.channelPartner.id));
        setTicket(initialValues)
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

                const response = await axiosInstance.post('/api/ticket', values);
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
                await axiosInstance.delete(`/api/ticket/${deleteItemId}`);
                toast.success("Ticket Deleted Successfully!")
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

        { field: 'title', headerName: 'Title', flex: 1 },
        // { field: 'description', headerName: 'Description', flex: 1 },
        // { field: 'ticketStatus', headerName: 'Ticket Status', flex: 1 },
        { field: 'ticketStatus', headerName: 'Ticket Status', flex: 1, 
            cellClassName: (params) => {
              if (params.value === "OPEN") {
                return 'opened-status';
              }
              if (params.value === "IN_PROGRESS") {
                return 'inprogress-status';
              }
              return '';
            }
          },
        { field: 'ticketType', headerName: 'Ticket Type', flex: 1 },
        // { field: 'ticketRaisedById', headerName: 'Ticket Raised By', flex: 1 },
        // { field: 'resolvedAt', headerName: 'Resolved At', flex: 1 },
        { field: 'customerId', headerName: 'Customer', flex: 2},
        { field: 'assignedToId', headerName: 'Assigned To', flex: 1 },
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
                await axiosInstance.put(`/api/ticket`, values);
                toast.success("Customer Updated Successfully!")
            } else {
                await axiosInstance.post('/api/ticket', values);
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
            id: ticket.id || '',
            title: ticket.title || '',
            description: ticket.description || '',

            ticketStatus: ticket.ticketStatus || '',
            ticketType: ticket.ticketType || '',
            ticketRaisedById: ticket.ticketRaisedBy || '',

            resolvedAt: ticket.resolvedAt || '',
            customerId: ticket.customerId || '',
            assignedToId: ticket.assignedToId || ''
        },
        validationSchema: Yup.object({
        }),
        onSubmit: (values) => {
            onSave(values);
            handleClose();
        },
    });

    //Edit data to be shown in modal
    React.useEffect(() => {
        formik.setValues({
            id: ticket.id || '',
            title: ticket.title || '',
            description: ticket.description || '',
            ticketStatus: ticket.ticketStatus || "OPEN",
            ticketType: ticket.ticketType || "BUG",
            ticketRaisedById: ticket.ticketRaisedBy || '',
            resolvedAt: ticket.resolvedAt || '',
            customerId: ticket.customerId || '',
            assignedToId: ticket.assignedToId || '',
        });
    }, [ticket]);


    //Add and Edit Data in Modal
    const fields = [
        { label: "Title", name: "title", type: "text", col: 12, required: true },
        { label: "Description", name: "description", type: "text", col: 12, required: false },
        {
            label: "Ticket Status *", name: "ticketStatus", type: "select", options: [
                { id: "OPEN", value: "OPEN" },
                { id: "IN_PROGRESS", value: "IN_PROGRESS" },
                { id: "CLOSED", value: "CLOSED" },
            ], col: 12, required: true
        },
        {
            label: "Ticket Type", name: "ticketType", type: "select", col: 12, required: true, options: [
                { id: "BUG", value: "BUG" },
                { id: "DEVELOPMENT", value: "DEVELOPMENT" },
                { id: "GENERAL_SUPPORT", value: "GENERAL_SUPPORT" }
            ]
        },
        // { label: "Ticket Raised By", name: "ticketRaisedById", type: "text", col: 12, required: false },
        // { label: "Resolved At", name: "resolvedAt", type: "date", col: 12, required: true },

        {
            label: "Customer",
            name: "customerId",
            type: "dymaicDropDown",
            path: "/api/customer/nameList",
            col: 12,
            required: true,
            selectionType: "id",
        },
        //   {
        //     label: "User",
        //     name: "assignedToId",
        //     type: "dymaicDropDown",
        //     path: "/api/user/nameList",
        //     col: 12,
        //     required: true,
        //     selectionType: "id",
        //   },

        // { label: "Customer", name: "customerId", type: "text", col: 12, required: true },
        { label: "Assigned To", name: "assignedToId", type: "text", col: 12, required: false },
    ];

    // const getRowClassName = (params) => {
    //     if (params.row.ticketStatus === "OPEN") {
    //         return 'opened-row';
    //     }
    //     if(params.row.ticketStatus === "IN_PROGRESS"){
    //         return 'inprogress-row'
    //     }
    //     return '';

    // };


    return (
        <Box m="20px">
            <Box m="40px 0 0 0" sx={{ height: '80vh', overflowX: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Button onClick={() => handleOpen()} color="secondary" variant="contained" sx={{ mb: 2 }}>
                        Add Ticket
                    </Button>
                    <SearchBar onSearch={handleSearch} />
                </Box>
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
                        // getRowClassName={getRowClassName}
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
                            '& .opened-status': {
                                backgroundColor: '#f8d7da', 
                                color: 'black', 
                            },
                            '& .inprogress-status': {
                                backgroundColor: '#d6d6d6', 
                                color: 'black', 
                            }
                        }}
                    />

                </Box>

            </Box>




            <ChannelPartnerModal
                channelPartner={ticket}
                onSave={handleSave}
                open={open}
                setOpen={setOpen}
                formik={formik}
                fields={fields}
                tableName={"Ticket"}
            />

            <ViewTicket
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