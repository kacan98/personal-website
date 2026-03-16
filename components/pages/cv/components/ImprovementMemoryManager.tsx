"use client";
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Collapse,
  Alert,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Memory as MemoryIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import Button from '@/components/ui/Button';
import { ImprovementMemory } from '@/app/db/schema';

interface ImprovementMemoryManagerProps {
  setSnackbarMessage: (message: string) => void;
}

export const ImprovementMemoryManager = ({ setSnackbarMessage }: ImprovementMemoryManagerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [memories, setMemories] = useState<ImprovementMemory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingDescription, setEditingDescription] = useState('');

  // Fetch memories
  const fetchMemories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/improvement-memories/list');
      if (response.ok) {
        const data = await response.json();
        setMemories(data.memories || []);
      } else {
        console.error('Failed to fetch improvement memories');
      }
    } catch (error) {
      console.error('Error fetching improvement memories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when expanded
  useEffect(() => {
    if (expanded) {
      fetchMemories();
    }
  }, [expanded, fetchMemories]);

  // Start editing
  const handleEdit = (memory: ImprovementMemory) => {
    setEditingId(memory.id);
    setEditingDescription(memory.userDescription);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingDescription('');
  };

  // Save edited memory
  const handleSaveEdit = async (id: number) => {
    try {
      const response = await fetch('/api/improvement-memories/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          newDescription: editingDescription,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Memory updated successfully!');
        await fetchMemories();
        handleCancelEdit();
      } else {
        setSnackbarMessage('Failed to update memory');
      }
    } catch (error) {
      console.error('Error updating memory:', error);
      setSnackbarMessage('Error updating memory');
    }
  };

  // Delete memory
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    try {
      const response = await fetch('/api/improvement-memories/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setSnackbarMessage('Memory deleted successfully!');
        await fetchMemories();
      } else {
        setSnackbarMessage('Failed to delete memory');
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
      setSnackbarMessage('Error deleting memory');
    }
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box sx={{ mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MemoryIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Saved Improvement Memories
          </Typography>
          <Chip
            label={memories.length}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {expanded && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                fetchMemories();
              }}
              disabled={loading}
              sx={{ color: 'primary.main' }}
            >
              <RefreshIcon />
            </IconButton>
          )}
          <IconButton
            size="small"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2, pt: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage your saved improvement descriptions that will be auto-filled in future job applications.
          </Typography>

          {loading && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Loading memories...
            </Alert>
          )}

          {!loading && memories.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No saved memories yet. Memories will be automatically saved when you refine your CV with improvement descriptions.
            </Alert>
          )}

          {!loading && memories.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {memories.map((memory) => (
                <Box
                  key={memory.id}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {memory.improvementKey}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          label={`Used ${memory.usageCount} time${memory.usageCount !== 1 ? 's' : ''}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`Last used: ${formatDate(memory.lastUsed)}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    {editingId !== memory.id && (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(memory)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(memory.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  {editingId === memory.id ? (
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={handleCancelEdit}
                          startIcon={<CloseIcon />}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleSaveEdit(memory.id)}
                          startIcon={<SaveIcon />}
                        >
                          Save
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {memory.userDescription}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};
