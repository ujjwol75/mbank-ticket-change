import React, { useState } from 'react';
import { Box, Button, Modal, Typography, CircularProgress, styled } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { Toaster, toast } from 'react-hot-toast';
import { axiosInstance } from '../../axios/axiosInterceptor';

// const DropZone = styled(Box)(({ theme }) => ({
//     border: `2px dashed ${theme.palette.primary.main}`,
//     borderRadius: '8px',
//     padding: '20px',
//     textAlign: 'center',
//     cursor: 'pointer',
//     transition: 'background-color 0.3s ease, border-color 0.3s ease',
//     '&:hover': {
//         backgroundColor: theme.palette.action.hover,
//         borderColor: theme.palette.secondary.main,
//     },
// }));

// const UploadExcelFile = () => {
//     const [open, setOpen] = useState(false);
//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(false); // New loading state

//     const handleOpen = () => setOpen(true);
//     const handleClose = () => setOpen(false);

//     const handleFileUpload = (event) => {
//         const uploadedFile = event.target.files[0];
//         if (uploadedFile) {
//             setFile(uploadedFile);
//         }
//     };

//     const handleDrop = (event) => {
//         event.preventDefault();
//         const uploadedFile = event.dataTransfer.files[0];
//         if (uploadedFile) {
//             setFile(uploadedFile);
//         }
//     };

//     const handleSubmitFile = async () => {
//         if (!file) {
//             toast.error("Please select a file to upload.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);

//         setLoading(true); // Set loading to true

//         try {
//             await axiosInstance.post('/api/channelpartner/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             toast.success('File uploaded successfully!'); 
//             setFile(null);
//             handleClose(); 
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             toast.error('Error uploading file. Please try again.'); // Show error message
//         } finally {
//             setLoading(false); // Reset loading state
//         }
//     };

//     return (
//         <Box sx={{ padding: 2 }}>
//             <Button variant="contained" color="secondary" onClick={handleOpen}>
//                 Upload Excel File
//             </Button>

//             <Modal open={open} onClose={handleClose}>
//                 <Box sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     padding: 4,
//                     bgcolor: 'background.paper',
//                     borderRadius: 2,
//                     boxShadow: 24,
//                     width: '50%',
//                     height: 'auto',
//                     maxHeight: '80%',
//                     overflowY: 'auto',
//                     margin: 'auto',
//                     marginTop: '10%',
//                 }}>
//                     <Typography variant="h6" component="h2" gutterBottom>
//                         Upload Excel File
//                     </Typography>

//                     <DropZone
//                         onDragOver={(e) => e.preventDefault()}
//                         onDrop={handleDrop}
//                         onClick={() => document.getElementById('fileInput').click()}
//                     >
//                         {file ? (
//                             <Typography variant="body1" color="text.secondary">{file.name}</Typography>
//                         ) : (
//                             <Typography variant="body1" color="text.secondary">Drag & drop your file here or click to browse</Typography>
//                         )}
//                         <input
//                             type="file"
//                             id="fileInput"
//                             accept=".xlsx, .xls"
//                             onChange={handleFileUpload}
//                             style={{ display: 'none' }} // Hide the default file input
//                         />
//                     </DropZone>

//                     <Button
//                         onClick={handleSubmitFile}
//                         color="secondary"
//                         variant="contained"
//                         sx={{ marginTop: 2, display: 'flex', alignItems: 'center' }}
//                         disabled={!file || loading} // Disable button if no file is selected or if loading
//                     >
//                         {loading ? (
//                             <CircularProgress size={24} sx={{ marginRight: 1 }} />
//                         ) : (
//                             <UploadIcon sx={{ marginRight: 1 }} />
//                         )}
//                         {loading ? 'Uploading...' : 'Upload'}
//                     </Button>

//                     <Typography variant="body2" sx={{ marginTop: 2 }}>
//                         Template:
//                     </Typography>
//                     <img
//                         src="/path/to/template-image.png" // Update this path to your template image
//                         alt="Template"
//                         style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }}
//                     />
//                 </Box>
//             </Modal>

//             <Toaster position="top-right" />
//         </Box>
//     );
// };

// export default UploadExcelFile;


// Define DropZone styled component


const DropZone = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderColor: theme.palette.secondary.main,
    },
}));

const UploadExcelFile = () => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [uploadedData, setUploadedData] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }
    };

    const handleSubmitFile = async () => {
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setErrors([]);
        setUploadedData([]);

        try {
            const response = await axiosInstance.post('/api/channelpartner/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Assume response structure
            const { uploadedData, errors } = response.data;

            setUploadedData(uploadedData || []);
            if (errors && errors.length > 0) {
                setErrors(errors);
                toast.error('There are errors in the uploaded file. Please check the highlighted areas.');
            } else {
                toast.success('File uploaded successfully!');
                setFile(null);
                handleClose();
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            const errorMessage = error.response?.data?.message || 'Error uploading file. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const renderUploadedData = () => {
        return uploadedData.map((row, index) => {
            const errorRow = errors.find(err => err.rowNumber === index + 1);
            return (
                <Box 
                    key={index} 
                    sx={{ 
                        padding: 1, 
                        backgroundColor: errorRow ? 'rgba(255, 0, 0, 0.1)' : 'transparent', 
                        border: errorRow ? '1px solid red' : 'none',
                    }}
                >
                    <Typography variant="body2">{JSON.stringify(row)}</Typography>
                    {errorRow && (
                        <Typography variant="caption" color="error">
                            {errorRow.errorMessage}
                        </Typography>
                    )}
                </Box>
            );
        });
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
                Upload Excel File
            </Button>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 4,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    width: '50%',
                    maxHeight: '80%',
                    overflowY: 'auto',
                    margin: 'auto',
                    marginTop: '10%',
                }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Upload Excel File
                    </Typography>

                    <DropZone
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const uploadedFile = e.dataTransfer.files[0];
                            if (uploadedFile) {
                                setFile(uploadedFile);
                            }
                        }}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        {file ? (
                            <Typography variant="body1" color="text.secondary">{file.name}</Typography>
                        ) : (
                            <Typography variant="body1" color="text.secondary">Drag & drop your file here or click to browse</Typography>
                        )}
                        <input
                            type="file"
                            id="fileInput"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                    </DropZone>

                    <Button
                        onClick={handleSubmitFile}
                        color="secondary"
                        variant="contained"
                        sx={{ marginTop: 2, display: 'flex', alignItems: 'center' }}
                        disabled={!file || loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ marginRight: 1 }} />
                        ) : (
                            <UploadIcon sx={{ marginRight: 1 }} />
                        )}
                        {loading ? 'Uploading...' : 'Upload'}
                    </Button>

                    <Box sx={{ marginTop: 2, width: '100%', maxHeight: '300px', overflowY: 'auto' }}>
                        {renderUploadedData()}
                    </Box>

                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                        Template:
                    </Typography>
                    <img
                        src="/path/to/template-image.png"
                        alt="Template"
                        style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }}
                    />
                </Box>
            </Modal>

            <Toaster position="top-right" />
        </Box>
    );
};

export default UploadExcelFile;