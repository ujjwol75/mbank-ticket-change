import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import RenderForm from '../../Resuable/RenderForm';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../../axios/axiosInterceptor';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw', // Adjusted width for better responsiveness
  maxWidth: 800, // Max width for large screens
  maxHeight: '90vh', // Max height for large screens
  bgcolor: 'background.paper',
  borderRadius: 2,
  border: '1px solid #ddd',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle = {
  flex: 1,
  overflowY: 'auto',
  marginBottom: 6,
  paddingTop: 4,
};

export default function ChannelPartnerModal({ channelPartner = {}, onSave, open, setOpen, formik, fields, tableName, allowances }) {
  const handleClose = () => setOpen(false);
  const [options, setOptions] = useState([]);


  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="channel-partner-modal-title"
      aria-describedby="channel-partner-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="channel-partner-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          {channelPartner.id ? `EDIT/UPDATE ${tableName}` : ` ${tableName}`}
        </Typography>
        <Box sx={contentStyle}>
          {console.log("fields:", formik)}
          <RenderForm fields={fields} formik={formik} options={options} allowances={allowances}/>
        </Box>
        <Button onClick={formik.handleSubmit} color='primary' variant='contained'>
          Save
        </Button>
      </Box>
    </Modal>
  );
}
