import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Box } from '@mui/material';

// Sample data for Kanban board
const initialColumns = [
  { id: 'todo', title: 'To Do', tasks: [{ id: '1', text: 'Task 1' }, { id: '2', text: 'Task 2' }] },
  { id: 'in-progress', title: 'In Progress', tasks: [{ id: '3', text: 'Task 3' }] },
  { id: 'done', title: 'Done', tasks: [{ id: '4', text: 'Task 4' }] },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [taskText, setTaskText] = useState('');

  // Function to handle adding a new task
  const addTask = (columnId) => {
    if (taskText.trim()) {
      const newColumns = columns.map((column) => {
        if (column.id === columnId) {
          column.tasks.push({ id: Date.now().toString(), text: taskText });
        }
        return column;
      });
      setColumns(newColumns);
      setTaskText('');
    }
  };

  // Function to handle dragging and dropping tasks
  const handleDragStart = (event, taskId) => {
    event.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (event, columnId) => {
    const taskId = event.dataTransfer.getData('taskId');
    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        const task = columns.flatMap(col => col.tasks).find(t => t.id === taskId);
        if (task && !column.tasks.find(t => t.id === taskId)) {
          column.tasks.push(task);
        }
      } else {
        column.tasks = column.tasks.filter(task => task.id !== taskId);
      }
      return column;
    });
    setColumns(newColumns);
  };

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center">
        {columns.map((column) => (
          <Grid item xs={4} key={column.id}>
            <Paper elevation={3} sx={{ padding: 2, minHeight: '400px' }}>
              <Typography variant="h5" gutterBottom>{column.title}</Typography>

              <Box
                sx={{
                  height: 'auto',
                  minHeight: '200px',
                  overflowY: 'auto',
                  border: '1px solid lightgray',
                  padding: 1,
                  marginBottom: 2,
                }}
                onDrop={(event) => handleDrop(event, column.id)}
                onDragOver={(event) => event.preventDefault()}
              >
                {column.tasks.map((task) => (
                  <Box
                    key={task.id}
                    sx={{
                      padding: 1,
                      marginBottom: 1,
                      backgroundColor: '#f4f4f4',
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                    draggable
                    onDragStart={(event) => handleDragStart(event, task.id)}
                  >
                    {task.text}
                  </Box>
                ))}
              </Box>

              <TextField
                fullWidth
                label="New Task"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ marginTop: 2 }}
                onClick={() => addTask(column.id)}
              >
                Add Task
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default KanbanBoard;
