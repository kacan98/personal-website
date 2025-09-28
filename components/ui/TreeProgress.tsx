"use client";
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { StepStatus, ProgressSteps } from '@/types/adjustment';

interface ProgressStep {
  id: string;
  label: string;
  status: StepStatus;
  isChild?: boolean;
}

interface TreeProgressProps {
  steps: ProgressSteps;
}

const TreeProgress: React.FC<TreeProgressProps> = ({ steps }) => {
  const progressSteps: ProgressStep[] = [
    { id: 'analyzing', label: 'Analyzing Position Requirements', status: steps.analyzing },
    { id: 'ranking', label: 'Ranking Project Stories', status: steps.ranking, isChild: true },
    { id: 'personalizingCV', label: 'Personalizing CV', status: steps.personalizingCV, isChild: true },
    { id: 'generatingLetter', label: 'Generating Motivational Letter', status: steps.generatingLetter, isChild: true },
  ];

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ fontSize: 20, color: '#10b981' }} />;
      case 'active':
        return (
          <CircularProgress
            size={20}
            sx={{
              color: '#3b82f6'
            }}
          />
        );
      case 'pending':
      default:
        return (
          <Box sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            backgroundColor: 'transparent'
          }} />
        );
    }
  };


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      minWidth: 300,
      maxWidth: 400,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      padding: 3,
      borderRadius: 3,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    }}>
      {progressSteps.map((step, index) => (
        <Box key={step.id} sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          py: 1,
          pl: step.isChild ? 3 : 0
        }}>
          {/* Step indicator */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 24,
            height: 24
          }}>
            {getStepIcon(step.status)}
          </Box>

          {/* Step label */}
          <Typography
            variant="body2"
            sx={{
              color: step.status === 'pending' ? 'rgba(255, 255, 255, 0.6)' :
                     step.status === 'active' ? '#3b82f6' : '#10b981',
              fontWeight: step.status === 'active' ? 600 : 500,
              fontSize: step.isChild ? '0.875rem' : '1rem'
            }}
          >
            {step.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TreeProgress;