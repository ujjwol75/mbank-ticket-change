import React, { useState } from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Collapse, Typography, Avatar, Grid, Chip } from '@mui/material';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import { useNavigate } from 'react-router-dom';

const projects = [
  {
    name: "Project A",
    description: "This project is focused on improving user experience.",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    status: "OPEN",
    tasks: ["Task 1", "Task 2", "Task 3"],
    estimatedHours: "200",
    estimatedDays: "25",
    priority: "HIGH",
    image: "/static/images/cards/paella.jpg", 
  },
  {
    name: "Project B",
    description: "This project is aimed at system upgrades.",
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    status: "IN_PROGRESS",
    tasks: ["Task A", "Task B"],
    estimatedHours: "300",
    estimatedDays: "40",
    priority: "MEDIUM",
    image: "/static/images/cards/tacos.jpg", 
  },
  {
    name: "Project C",
    description: "This project is aimed at system upgrades.",
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    status: "IN_PROGRESS",
    tasks: ["Task A", "Task B"],
    estimatedHours: "300",
    estimatedDays: "40",
    priority: "MEDIUM",
    image: "/static/images/cards/tacos.jpg", 
  },
  {
    name: "Project D",
    description: "This project is aimed at system upgrades.",
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    status: "IN_PROGRESS",
    tasks: ["Task A", "Task B"],
    estimatedHours: "300",
    estimatedDays: "40",
    priority: "MEDIUM",
    image: "/static/images/cards/tacos.jpg", 
  },
  // Add more projects here
];

function ProjectCards() {

  const navigate = useNavigate(); // Initialize navigate hook from react-router-dom

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleNextPageClick = (link) => {
    navigate(link); // Navigate to the link provided in the project
  };

  return (
    <Grid container spacing={4} justifyContent="center" padding={4}>
      {projects.map((project, index) => (
        <Grid item key={index} xs={12} sm={6} md={3}>
          <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="project">
                  {project.name[0]}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={project.name}
              subheader={`${project.startDate} - ${project.endDate}`}
            />
            <CardContent>
              <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 2 }}>
                {project.description}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Estimated Hours: {project.estimatedHours}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Estimated Days: {project.estimatedDays}
              </Typography>
              <Chip label={project.priority} color="primary" sx={{ margin:1 }} />
              <Chip
                label={project.status}
                color={project.status === 'OPEN' ? 'error' : project.status === 'IN_PROGRESS' ? 'info' : 'success'}
                sx={{ margin:1 }}
              />
            </CardContent>
            <CardActions disableSpacing>
              <IconButton
                expand={expanded ? 'true' : 'false'}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >See Tasks
                <ArrowForwardIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ProjectCards;
