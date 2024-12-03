import { Box, Button, IconButton, Paper, TextField, Typography } from "@mui/material";
import { tokens } from "../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import { axiosInstance } from "../../axios/axiosInterceptor";
import { useState, useEffect } from "react";
import FullScreenDialog from "../../components/viewPage/ViewPage";
import { useTheme } from "@emotion/react";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';
import toast from "react-hot-toast";

const Dashboard = () => {

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const handleClockIn = () => {
    const currentTime = new Date();
    setClockInTime(currentTime); // Save clock-in time
    setIsClockedIn(true);
    toast.success(`You are clocked in at ${formatTime(currentTime)}`);
  };

  const handleClockOut = async () => {
    const currentTime = new Date();
    setIsClockedIn(false);

    // Prepare payload with local time adjusted to ISO format
    const payload = {
      clockInTime: clockInTime ? new Date(clockInTime.getTime() - (clockInTime.getTimezoneOffset() * 60000)).toISOString() : null,
      clockOutTime: new Date(currentTime.getTime() - (currentTime.getTimezoneOffset() * 60000)).toISOString(),
    };

    // Send data to API
    try {
      const response = await axiosInstance.post('http://localhost:8080/api/clockInAndOut', payload);

      if (response.status === 200) {
        toast.success(`You are clocked out at ${currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' })}`);
        // setClockInTime(null);
      } else {
        throw new Error('Failed to clock out');
      }
    } catch (error) {
      console.error('Error while clocking out:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const formatTime = (date) => {
    return date
      ? date.toLocaleString('en-US', {
        timeZone: 'Asia/Kathmandu', // Set your desired timezone
        year: 'numeric',
        month: 'long', // e.g., "September"
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, // Use 12-hour format
      })
      : 'N/A';
  };
  // =======


  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch sticky note content on component mount
  const fetchNote = async () => {
    try {
      const response = await axiosInstance.get('/api/stickyNote');
      const fetchedNote = response.data.detail[0]?.content;
      setNote(fetchedNote ? fetchedNote : 'Click to edit your note...');
    } catch (error) {
      console.error('Error fetching sticky note:', error);
      setNote('Click to edit your note...');
    }
  };


  // Save sticky note content
  const saveNote = async () => {
    if (!note.trim()) return; // Prevent saving empty notes
    try {
      await axiosInstance.post('/api/stickyNote', { content: note });
    } catch (error) {
      console.error('Error saving sticky note:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setNote(event.target.value);
  };

  const handleDelete = () => {
    setNote(''); // Clear the note
  };

  const handleBlur = () => {
    if (isEditing) {
      saveNote();
      setIsEditing(false);
    }
  };

  // Fetch the note when the component mounts
  useEffect(() => {
    fetchNote();
  }, []);




  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [leadCount, setLeadCount] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [channelPartners, setChannelPartners] = useState(0);
  const [latestComments, setLatestComments] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [nameLookup, setNameLookup] = useState({});

  const [latestCommentsForLeads, setLatestCommentsForLeads] = useState([]);
  const [latestCommentsForCustomers, setLatestCommentsForCustomers] = useState([]);
  const [leadCommentsResponse, setLeadCommentsResponse] = useState([])
  const [customerCommentsResponse, setCustomerCommentsResponse] = useState([])


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        axiosInstance.get('/api/lead'),
        axiosInstance.get('/api/customer'),
        axiosInstance.get('/api/channelpartner'),
        axiosInstance.get('/api/comment/comments-by-lead'),
        axiosInstance.get('/api/comment/comments-by-customer'),
      ]);
    
      const leadsResponse = responses[0];
      const customerResponse = responses[1];
      const channelPartnerResponse = responses[2];
      const leadCommentsResponse = responses[3];
      const customerCommentsResponse = responses[4];
      
      setLeads(leadsResponse.data.detail.content);
      setLeadCount(leadsResponse.data.detail.page.totalElements);
      setCustomers(customerResponse.data.detail.page.totalElements);
      setChannelPartners(channelPartnerResponse.data.detail.page.totalElements);
      setLatestCommentsForLeads(leadCommentsResponse.data.detail);
      setLatestCommentsForCustomers(customerCommentsResponse.data.detail);
    
      // Get leadIds and customerIds from the comments
      const leadIds = leadCommentsResponse.data.detail.map((comment) => comment.leadId);
      const customerIds = customerCommentsResponse.data.detail.map((comment) => comment.customerId);
  
      // Combine all unique IDs
      const uniqueIds = [...new Set([...leadIds, ...customerIds])];
  
      // Fetch names for all unique IDs in batch
      const namesResponse = await Promise.all(
        uniqueIds.map((id) => {
          // Determine if the ID is for a lead or customer
          if (leadIds.includes(id)) {
            return axiosInstance.get(`/api/lead/${id}`).then((res) => ({ id, name: res.data.detail?.name || 'Unknown Lead' }));
          } else {
            return axiosInstance.get(`/api/customer/${id}`).then((res) => ({ id, name: res.data.detail?.name || 'Unknown Customer' }));
          }
        })
      );
  
      // Map the fetched names into a lookup object
      const nameMap = namesResponse.reduce((acc, { id, name }) => {
        acc[id] = name;
        return acc;
      }, {});
  
      // Set the lookup table in state
      setNameLookup(nameMap);
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  // const fetchData = async () => {
  //   try {
  //     const responses = await Promise.all([
  //       axiosInstance.get('/api/lead'),
  //       axiosInstance.get('/api/customer'),
  //       axiosInstance.get('/api/channelpartner'),
  //       axiosInstance.get('/api/comment/comments-by-lead'),
  //       axiosInstance.get('/api/comment/comments-by-customer'),
  //     ]);
  
  //     const leadsResponse = responses[0];
  //     const customerResponse = responses[1];
  //     const channelPartnerResponse = responses[2];
  //     const leadCommentsResponse = responses[3];
  //     console.log("Leads Comment", leadCommentsResponse);
  //     const customerCommentsResponse = responses[4];
  //     console.log("Customer comment", customerCommentsResponse);
  
  //     // Store lead and customer names in lookup table for easy access
  //     const leadNames = leadsResponse.data.detail.content.reduce((acc, lead) => {
  //       acc[lead.id] = lead.name; // Store lead name by id
  //       return acc;
  //     }, {});
  
  //     const customerNames = customerResponse.data.detail.content.reduce((acc, customer) => {
  //       acc[customer.id] = customer.name; // Store customer name by id
  //       return acc;
  //     }, {});
  
  //     console.log("LeadNames: ", leadNames)

  //     // Combine lead and customer names into one object for easy lookup
  //     setNameLookup({ ...leadNames, ...customerNames });
  
  //     // Set the state for other data
  //     setLeads(leadsResponse.data.detail.content);
  //     setLeadCount(leadsResponse.data.detail.page.totalElements);
  //     setCustomers(customerResponse.data.detail.page.totalElements);
  //     setChannelPartners(channelPartnerResponse.data.detail.page.totalElements);
  
  //     // Set comments for leads and customers
  //     setLatestCommentsForLeads(leadCommentsResponse.data.detail);
  //     setLatestCommentsForCustomers(customerCommentsResponse.data.detail);
  
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  


  const handleViewOpen = async (id, isCustomer = false) => {
    try {
      const endpoint = isCustomer ? `/api/customer/${id}` : `/api/lead/${id}`;
      const response = await axiosInstance.get(endpoint);
      if (response.data && response.data.detail) {
        setViewData(response.data.detail);
        setViewDialogOpen(true);
      } else {
        console.error("Invalid response structure", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => setOpen(false);
  const handleViewClose = () => setViewDialogOpen(false);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box m="20px">

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box display="flex" alignItems="center">
          {isClockedIn ? (
            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClockOut}
                startIcon={<DoneIcon />}
              >
                Clock Out
              </Button>
              <Box textAlign="right" ml={2}>
                <Typography variant="body2">
                  You are Clocked In at: {clockInTime ? formatTime(clockInTime) : 'N/A'}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClockIn}
                startIcon={<AccessTimeIcon />}
              >
                Clock In
              </Button>
              <Box textAlign="right" ml={2}>
                <Typography variant="body2">
                  You are Clocked Out at: {clockInTime ? formatTime(clockInTime) : 'N/A'}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>


      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
        {/* ROW 1 */}
        <Box gridRow="span 1" gridColumn="span 4" backgroundColor="#f6f6f6" display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={<span style={{ color: "#1D2A6C" }}>{leadCount}</span>}
            subtitle={<span style={{ color: "#1D2A6C" }}>Total Leads</span>}
            progress="0.75"
            increase={<span style={{ color: "#1D2A6C" }}>+14%</span>}
            icon={<EmailIcon sx={{ color: "#1D2A6C", fontSize: "26px" }} />}
          />
        </Box>
        <Box gridRow="span 1" gridColumn="span 4" backgroundColor="#f6f6f6" display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={<span style={{ color: "#1D2A6C" }}>{customers}</span>}
            subtitle={<span style={{ color: "#1D2A6C" }}>Total Customers</span>}
            progress="0.50"
            increase={<span style={{ color: "#1D2A6C" }}>+21%</span>}
            icon={<PointOfSaleIcon sx={{ color: "#1D2A6C", fontSize: "26px" }} />}
          />
        </Box>
        <Box gridRow="span 1" gridColumn="span 4" backgroundColor="#f6f6f6" display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={<span style={{ color: "#1D2A6C" }}>{channelPartners}</span>}
            subtitle={<span style={{ color: "#1D2A6C" }}>Total Channel Partners</span>}
            progress="0.30"
            increase={<span style={{ color: "#1D2A6C" }}>+5%</span>}
            icon={<PersonAddIcon sx={{ color: "#1D2A6C", fontSize: "26px" }} />}
          />
        </Box>


        {/*================== ROw 2========================*/}

        <Box gridColumn="span 6" gridRow="span 3" overflow={"auto"}>

          <Box gridColumn="span 12" backgroundColor="#f6f6f6" overflow="auto">
            <Box gridColumn="span 12" backgroundColor="#f6f6f6" overflow="auto">
              <Box gridColumn="span 4" gridRow="span 2" backgroundColor="#f6f6f6">
                <Box alignItems="center" borderBottom={`4px solid #1D2A6C`} p="15px">
                  <Typography color="#1D2A6C" variant="h5" fontWeight="600">Recent Comments On Leads</Typography>
                </Box>
                {latestCommentsForLeads.map((transaction, i) => {
                  const name = nameLookup[transaction.leadId] || 'Unknown Lead';
                  // const name = nameLookup[transaction.leadId] || 'Unknown Lead';
                 console.log('Lead ID:', transaction.leadId, 'Name:', name); 
                  return (
                    <Box
                      key={`${transaction.id}-${i}`}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      borderBottom={`4px solid ${colors.primary[500]}`}
                      p="15px"
                      sx={{
                        transition: 'background-color 0.3s, transform 0.3s',
                        '&:hover': {
                          backgroundColor: colors.primary[900],
                          transform: 'scale(1.02)',
                        }
                      }}
                    >
                      <Box>
                        <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                          {name} 
                        </Typography>
                        <Typography
                          sx={{
                            color: '#1D2A6C',
                            cursor: 'pointer',
                            whiteSpace: 'normal', // Allows wrapping of text
                          }}
                          title={transaction.comment} // Tooltip for full comment on hover
                        >
                          {transaction.comment.split(' ').slice(0, 60).join(' ')} {/* Display first 60 words */}
                        </Typography>
                      </Box>



                      <Box sx={{ color: '#1D2A6C' }}>
                        {`Commented By: ${transaction.user?.name || 'Unknown User'}`}
                      </Box>
                      <Box color='#1D2A6C'>
                        {new Date(transaction.createdDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Box>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => handleViewOpen(transaction.leadId || transaction.customerId, !!transaction.customerId)}
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

        </Box>



        <Box gridColumn="span 6" gridRow="span 3" backgroundColor="#f6f6f6" overflow="auto">
          <Box gridColumn="span 12" gridRow="span 3" backgroundColor="#f6f6f6" overflow="auto">
            <Box gridColumn="span 4" gridRow="span 2" backgroundColor="#f6f6f6">
              <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid #1D2A6C`} p="15px">
                <Typography color="#1D2A6C" variant="h5" fontWeight="600">Recent Comments On Customers</Typography>
              </Box>
              {latestCommentsForCustomers.map((transaction, i) => {
                const name = nameLookup[transaction.customerId] || 'Unknown Customer';
                
                return (
                  <Box
                    key={`${transaction.id}-${i}`}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`4px solid ${colors.primary[500]}`}
                    p="15px"
                    sx={{
                      transition: 'background-color 0.3s, transform 0.3s',
                      '&:hover': {
                        backgroundColor: colors.primary[900],
                        transform: 'scale(1.02)',
                      }
                    }}
                  >
                    <Box>
                      <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                        {name}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#1D2A6C',
                          cursor: 'pointer',
                          whiteSpace: 'normal', // Allows wrapping of text
                        }}
                        title={transaction.comment} // Tooltip for full comment on hover
                      >
                        {transaction.comment.split(' ').slice(0, 60).join(' ')} {/* Display first 60 words */}
                      </Typography>
                    </Box>



                    <Box sx={{ color: '#1D2A6C' }}>
                      {`Commented By: ${transaction.user?.name || 'Unknown User'}`}
                    </Box>
                    <Box color='#1D2A6C'>
                      {new Date(transaction.createdDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Box>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => handleViewOpen(transaction.leadId || transaction.customerId, !!transaction.customerId)}
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>


        {/*=========================== ROw 3 ===========================*/}
        <Box gridColumn="span 4" gridRow="span 2" height="100%">
          <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', padding: 2, backgroundColor: '#7EBF1F' }}>
            {isEditing ? (
              <TextField variant="standard" value={note} onChange={handleChange} fullWidth onBlur={handleBlur} autoFocus InputProps={{ disableUnderline: true }} sx={{ '& .MuiInputBase-input': { color: '#1D2A6C', cursor: 'text', fontSize: '1.2rem' } }} />
            ) : (
              <Typography variant="body1" onClick={handleEditToggle} sx={{ color: '#1D2A6C', fontSize: '1.2rem' }}>
                {note ? note : null}
              </Typography>
            )}
          </Paper>
        </Box>
        {/* <Box display="flex" gridColumn="span 4" gridRow="span 3" height="100%"
        >
          <Paper
            elevation={3}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              padding: 2,
              backgroundColor: '#7EBF1F',
            }}
          >
            {isEditing ? (
              <TextField
                variant="standard"
                value={note}
                onChange={handleChange}
                fullWidth
                onBlur={handleBlur}
                autoFocus
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#1D2A6C',
                    cursor: 'text',
                    fontSize: '1.2rem',
                  },
                }}
              />
            ) : (
              <Typography
                variant="body1"
                onClick={handleEditToggle}
                sx={{ color: '#1D2A6C', fontSize: '1.2rem' }}
              >
                {note ? note : null}
              </Typography>
            )}
          </Paper>
        </Box> */}
        {/* <Box gridColumn="span 4" gridRow="span 2" backgroundColor="#f6f6f6">
          <Typography variant="h5" fontWeight="600" color="#1D2A6C" sx={{ padding: "30px 30px 0 30px" }}>Sales Quantity</Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor="#f6f6f6" padding="30px">
          <Typography variant="h5" fontWeight="600" sx={{ marginBottom: "15px" }} color="#1D2A6C">Geography Based Traffic</Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}

      </Box>

      <FullScreenDialog open={viewDialogOpen} onClose={handleViewClose} data={viewData} commentData={viewData?.lead ? "Lead" : "Customer"} />
    </Box>
  );
};

export default Dashboard;