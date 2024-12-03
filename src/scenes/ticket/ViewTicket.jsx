import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { List, TextField } from '@mui/material';
import { axiosInstance } from '../../axios/axiosInterceptor';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Utility function to format the date
const formatDate = (date) => {
    if (!date) return 'N/A'; // Return 'N/A' if no date is provided
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
};

export default function ViewTicket({ open, onClose, data, commentData }) {
    const [comments, setComments] = React.useState([]);
    const [message, setMessage] = React.useState('');
    const messagesEndRef = React.useRef(null);

    // Function to fetch comments
    // const fetchComments = async () => {
    //     if (!data || !data.id) {
    //         console.error("No valid ID provided for fetching comments.");
    //         return;
    //     }



    //     try {
    //         let response;
    //         if (data.lead === true) {
    //             response = await axiosInstance.get(`/api/comment/lead/${data.id}`);
    //         } else if (data.customer === true ) {
    //             response = await axiosInstance.get(`/api/comment/customer/${data.id}`);
    //         } else {
    //             console.error("Invalid commentData type.");
    //             return;
    //         }

    //         const fetchedComments = response.data.detail || [];
    //         setComments(fetchedComments.map(comment => ({
    //             id: comment.id,
    //             text: comment.comment || 'No comment text',
    //             createdDate: comment.createdDate,
    //             user: comment.user ? comment.user.name : 'Unknown User'
    //         })));
    //     } catch (error) {
    //         console.error("Error fetching comments:", error);
    //     }
    // };


    const fetchComments = async () => {
        if (!data || !data.id) {
            console.error("No valid ID provided for fetching comments.");
            return;
        }


        try {
            let response;
            if (data.lead) {
                response = await axiosInstance.get(`/api/comment/lead/${data.id}`);
            } else if (data.customer) {
                response = await axiosInstance.get(`/api/comment/customer/${data.id}`);
            } else {
                console.error("Invalid commentData type.");
                return;
            }

            const fetchedComments = response.data.detail || [];
            setComments(fetchedComments.map(comment => ({
                id: comment.id,
                text: comment.comment || 'No comment text',
                createdDate: comment.createdDate,
                user: comment.user ? comment.user.name : 'Unknown User'
            })));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };


    // Fetch comments when `data` or `commentData` changes
    React.useEffect(() => {
        fetchComments();
    }, [data, commentData]);

    // Auto-scroll to the bottom of the messages list when new messages are added
    React.useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [comments]);

    // Handle sending a new comment
    const handleSendComment = async () => {
        if (message.trim() === '') return;

        try {
            let endpoint;
            if (commentData === "Lead") {
                endpoint = `/api/comment/lead/${data.id}`;
            } else if (commentData === "Customer") {
                endpoint = `/api/comment/customer/${data.id}`;
            } else {
                console.error("Invalid commentData type.");
                return;
            }

            const response = await axiosInstance.post(endpoint, {
                comment: message,
                // Include any other necessary data for the comment, e.g., userId
            });

            const newComment = {
                id: response.data.id, // Assuming the server returns the new comment's ID
                text: message,
                createdDate: new Date().toISOString(), // Use current date as createdDate
                user: 'You' // Replace with actual user info if available
            };

            // Update comments state
            setComments([...comments, newComment]);
            setMessage(''); // Clear the input field
        } catch (error) {
            console.error("Error sending comment:", error);
        }
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            sx={{ '& .MuiDialog-paper': { padding: 2, borderRadius: 4 } }} // Add padding to the Dialog and rounded corners
        >
            <AppBar sx={{ position: 'relative', backgroundColor: '#000' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                        sx={{ padding: 1 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        View Details
                    </Typography>
                    <Button autoFocus color="inherit" onClick={onClose} sx={{ fontWeight: 'bold' }}>
                        Close
                    </Button>
                </Toolbar>
            </AppBar>

            <Grid container sx={{ height: 'calc(100% - 64px)', display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={12} sm={12} sx={{ height: '100%', overflowY: 'auto', borderRight: '1px solid', borderColor: 'divider', padding: 2 }}>
                    <List sx={{ padding: 0 }}>
                        {data ? (
                            <>
                                <ListItemButton sx={{ padding: '8px 16px', borderRadius: 4, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <ListItemText primary="Title" secondary={data.title || 'N/A'} />
                                </ListItemButton>
                                <Divider />
                                <ListItemButton sx={{ padding: '8px 16px', borderRadius: 4, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <ListItemText primary="Description" secondary={data.description || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton sx={{ padding: '8px 16px', borderRadius: 4, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <ListItemText primary="Ticket Status" secondary={data.ticketStatus || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton sx={{ padding: '8px 16px', borderRadius: 4, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <ListItemText primary="Ticket Type" secondary={data.ticketType || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton sx={{ padding: '8px 16px', borderRadius: 4, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <ListItemText primary="Ticket Raised By" secondary={data.ticketRaisedById || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton sx={{ padding: '8px 16px', borderRadius: 4, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <ListItemText primary="Resolved At Time" secondary={data.resolvedAt || 'Not Resolved Yet'} />
                                </ListItemButton>
                                <Divider />
                                <ListItemButton sx={{ padding: '8px 16px', borderRadius: 4, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <ListItemText primary="Customer Name" secondary={data.customerId?.customerId || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton sx={{ padding: '8px 16px', borderRadius: 4, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <ListItemText primary="Assigned To" secondary={data.assignedToId || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton sx={{ padding: '8px 16px', borderRadius: 4, '&:hover': { backgroundColor: '#f1f1f1' } }}>
                                    <ListItemText primary="Created Date" secondary={formatDate(data.createdDate)} />
                                </ListItemButton>
                                
                            </>
                        ) : (
                            <ListItemText primary="No details available" />
                        )}
                    </List>
                </Grid>
            </Grid>
        </Dialog>
    );

}
