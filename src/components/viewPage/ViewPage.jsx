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

export default function FullScreenDialog({ open, onClose, data, commentData }) {
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
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        View Details
                    </Typography>
                    <Button autoFocus color="inherit" onClick={onClose}>
                        Close
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container sx={{ height: 'calc(100% - 64px)', display: 'flex', flexDirection: 'row' }}>
                <Grid item xs={12} sm={6} sx={{ height: '100%', overflowY: 'auto', borderRight: '1px solid', borderColor: 'divider' }}>
                    <List>
                        {data ? (
                            <>
                                <ListItemButton>
                                    <ListItemText primary="Name" secondary={data.name || 'N/A'} />
                                </ListItemButton>
                                <Divider />
                                <ListItemButton>
                                    <ListItemText primary="Contact Person" secondary={data.contactPerson || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Phone Number" secondary={data.contactNumber || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Email" secondary={data.email || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Address" secondary={data.address || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Introduced On" secondary={formatDate(data.introducedOn)} />
                                </ListItemButton>
                                <Divider />
                                <ListItemButton>
                                    <ListItemText primary="Channel Partner" secondary={data.channelPartner?.channelPartnerName || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Created By" secondary={data.createdBy || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Created Date" secondary={formatDate(data.createdDate)} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Designation" secondary={data.designation || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Marketing Status" secondary={data.marketingStatus || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Lead Status" secondary={data.leadStatus || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Total Branch" secondary={data.totalBranch || 'N/A'} />
                                </ListItemButton>
                                <ListItemButton>
                                    <ListItemText primary="Existing Software" secondary={data.existingSoftware || 'N/A'} />
                                </ListItemButton>
                                {/* Add more fields as needed */}
                            </>
                        ) : (
                            <ListItemText primary="No details available" />
                        )}
                    </List>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ flex: '1', overflowY: 'auto', padding: 16 }}>
                        <Typography variant="h2" sx={{ mb: 2 }}>Comments Section</Typography>
                        <div style={{ height: '90%', border: '1px solid #ccc', padding: 16, overflowY: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} style={{ marginBottom: 16 }}>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: 'text.secondary', marginBottom: 4 }}
                                            >
                                                {comment.user} - {formatDate(comment.createdDate)}
                                            </Typography>
                                            <div
                                                style={{
                                                    backgroundColor: '#f1f1f1',
                                                    borderRadius: 8,
                                                    padding: 8,
                                                    maxWidth: '80%',
                                                }}
                                            >
                                                {comment.text}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <ListItemText primary="No comments available" />
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendComment();
                                }
                            }}
                            placeholder="Type a message..."
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendComment}
                            sx={{ mt: 1 }}
                            fullWidth
                        >
                            Send
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </Dialog>
    );
    
}
