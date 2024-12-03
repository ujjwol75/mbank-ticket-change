import { IconButton, Popper, Paper, List, MenuItem, ListItemText, Badge, Divider } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { axiosInstance } from '../../axios/axiosInterceptor';

const Notification = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const popperRef = useRef(null); // Reference for the Popper

    const superAdminUsername = "admin";

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        if (!anchorEl) {
            // Reset unread count when the popper is opened
            setUnreadCount(notifications.filter(notification => !notification.read).length);
        }
    };

    const handleNotificationClick = (index) => {
        const notification = notifications[index];
        if (!notification.read) {
            axiosInstance.put(`/api/notifications/${notification.id}/mark-read`).then(() => {
                setNotifications(prev => {
                    const newNotifications = [...prev];
                    newNotifications[index].read = true;
                    return newNotifications;
                });
                setUnreadCount(prev => Math.max(prev - 1, 0));
            });
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axiosInstance.get('/api/notifications');
                const fetchedNotifications = response.data.detail.map(notification => ({
                    message: notification.message,
                    id: notification.id,
                    read: notification.read,
                    createdDate: notification.createdDate,
                }));
                setNotifications(fetchedNotifications);
                const unreadNotifications = fetchedNotifications.filter(notification => !notification.read);
                setUnreadCount(unreadNotifications.length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        const socket = new SockJS('http://localhost:8080/websocket');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: (frame) => {
                client.subscribe('/all/notifications', (message) => {
                    if (message.body) {
                        const receivedNotification = JSON.parse(message.body);
                        setNotifications(prev => [receivedNotification, ...prev]);
                        setUnreadCount(prev => prev + (receivedNotification.read ? 0 : 1));
                    }
                });


                // Subscribe to private notifications for superadmin
                // client.subscribe(`/user/${superAdminUsername}/notifications`, (message) => {
                //     const receivedNotification = JSON.parse(message.body);
                //     console.log('Received notification:', receivedNotification);
                //     setNotifications(prev => [receivedNotification, ...prev]);
                //     setUnreadCount(prev => prev + (receivedNotification.read ? 0 : 1));
                //     // Handle the notification (e.g., update UI)
                // });



            },


            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
            },
            onStompError: (frame) => {
                console.error('Broker error: ' + frame.headers['message']);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
            console.log('Client deactivated');
        };
    }, []);

    const markAllAsRead = () => {
        axiosInstance.post('/api/notifications/mark-all-read').then(() => {
            setUnreadCount(0);
            setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
        });
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popperRef.current && !popperRef.current.contains(event.target) && anchorEl) {
                setAnchorEl(null); // Close the dropdown
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [anchorEl]);

    return (
        <div>
            <IconButton onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsOutlinedIcon />
                </Badge>
            </IconButton>
            <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="bottom"
                style={{ zIndex: 1300 }}
                ref={popperRef} // Attach ref to the Popper
            >
                <Paper
                    sx={{
                        width: 270,
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        padding: 0,
                        marginRight: 2,
                        backgroundColor: 'white',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    <List>
                        {notifications.map((notification, index) => (
                            <div key={notification.id}>
                                <MenuItem
                                    onClick={() => handleNotificationClick(index)}
                                    sx={{ backgroundColor: notification.read ? 'transparent' : '#f5f5f5' }} // Gray for unread
                                >
                                    <ListItemText
                                        primary={notification.message}
                                        secondary={new Date(notification.createdDate).toLocaleString()}
                                        sx={{
                                            textAlign: 'left',
                                            padding: '10px 5px',
                                            whiteSpace: 'normal',
                                        }}
                                    />
                                </MenuItem>
                                {index < notifications.length - 1 && <Divider />}
                            </div>
                        ))}
                    </List>
                    {unreadCount > 0 && (
                        <MenuItem onClick={markAllAsRead} sx={{ justifyContent: 'center' }}>
                            Mark all as read
                        </MenuItem>
                    )}
                </Paper>
            </Popper>
        </div>
    );
};

export default Notification;
