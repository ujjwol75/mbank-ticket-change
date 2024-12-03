import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

const PageNotFound = () => {
    const navigate = useNavigate(); 

    const handleGoHome = () => {
        navigate('/'); 
    };

    return (
        <Container 
            component="main" 
            maxWidth="xs" 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >

                <Typography variant="h3" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" paragraph>
                    This page could not be found
                </Typography>
                <Typography variant="body1" paragraph>
                    Sorry, the page you are looking for does not exist.
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleGoHome}
                >
                    Go to Dashboard
                </Button>
        </Container>
    );
};

export default PageNotFound;
