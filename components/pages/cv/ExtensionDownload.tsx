import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import {
  Extension as ExtensionIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import BaseModal from './modals/BaseModal';

interface ExtensionDownloadProps {
  open: boolean;
  onClose: () => void;
}

const ExtensionDownload: React.FC<ExtensionDownloadProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [extensionDownloaded, setExtensionDownloaded] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [isLoadingVersion, setIsLoadingVersion] = useState(true);

  // Fetch latest version on component mount
  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        // Simple: just fetch from the current domain's GitHub repo
        // This will work for most deployments automatically
        const hostname = window.location.hostname;
        let repoUrl;

        // Auto-detect common patterns
        if (hostname.includes('vercel.app')) {
          // For Vercel deployments, use environment or throw error
          if (!process.env.NEXT_PUBLIC_GITHUB_REPO) {
            throw new Error('NEXT_PUBLIC_GITHUB_REPO environment variable is required for Vercel deployments');
          }
          repoUrl = process.env.NEXT_PUBLIC_GITHUB_REPO;
        } else if (hostname.endsWith('.github.io')) {
          // GitHub Pages
          const owner = hostname.replace('.github.io', '');
          repoUrl = `${owner}/personal-website`;
        } else {
          // Custom domain or localhost - use environment or throw error
          if (!process.env.NEXT_PUBLIC_GITHUB_REPO) {
            throw new Error('NEXT_PUBLIC_GITHUB_REPO environment variable is required');
          }
          repoUrl = process.env.NEXT_PUBLIC_GITHUB_REPO;
        }

        const apiUrl = `https://api.github.com/repos/${repoUrl}/releases/latest`;
        const response = await fetch(apiUrl);

        if (response.ok) {
          const release = await response.json();
          setLatestVersion(release.tag_name);
        }
      } catch (error) {
        console.log('Could not fetch version info');
      } finally {
        setIsLoadingVersion(false);
      }
    };

    if (open) {
      fetchLatestVersion();
    }
  }, [open]);

  const handleDownload = async () => {
    try {
      // Auto-detect repo from domain
      const hostname = window.location.hostname;
      let repoUrl;

      if (hostname.endsWith('.github.io')) {
        const owner = hostname.replace('.github.io', '');
        repoUrl = `${owner}/personal-website`;
      } else {
        if (!process.env.NEXT_PUBLIC_GITHUB_REPO) {
          throw new Error('NEXT_PUBLIC_GITHUB_REPO environment variable is required');
        }
        repoUrl = process.env.NEXT_PUBLIC_GITHUB_REPO;
      }

      // Try to get the exact asset from the latest release
      const apiUrl = `https://api.github.com/repos/${repoUrl}/releases/latest`;
      const response = await fetch(apiUrl);

      if (response.ok) {
        const release = await response.json();
        const extensionAsset = release.assets?.find((asset: any) =>
          asset.name.includes('cv-tailor-extension') && asset.name.endsWith('.zip')
        );

        if (extensionAsset) {
          window.open(extensionAsset.browser_download_url, '_blank');
          setExtensionDownloaded(true);
          setActiveStep(1);
          return;
        }
      }

      // Fallback to generic URL (shouldn't happen but just in case)
      const fallbackUrl = `https://github.com/${repoUrl}/releases/latest`;
      window.open(fallbackUrl, '_blank');
      setExtensionDownloaded(true);
      setActiveStep(1);

    } catch (error) {
      console.error('Download failed:', error);
      // Still proceed to let user download manually
      setExtensionDownloaded(true);
      setActiveStep(1);
    }
  };


  const installationSteps = [
    {
      label: 'Download Extension',
      description: (
        <Box>
          <Typography variant="body2" gutterBottom>
            Download the CV Tailor Chrome extension to your computer.
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={extensionDownloaded}
            sx={{ mt: 2 }}
          >
            {extensionDownloaded ? 'Downloaded' : 'Download Extension'}
          </Button>
          {extensionDownloaded && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 16, mr: 1 }} />
              Extension downloaded successfully!
            </Alert>
          )}
        </Box>
      )
    },
    {
      label: 'Open Chrome Extensions',
      description: (
        <Box>
          <Typography variant="body2" gutterBottom>
            Click the puzzle piece icon (🧩) in Chrome&apos;s toolbar, then click &quot;⚙️ Manage extensions&quot;
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Alternative: Type <code style={{ background: '#e0e0e0', padding: '2px 4px', borderRadius: '3px', color: '#333' }}>chrome://extensions/</code> in Chrome&apos;s address bar
          </Typography>
        </Box>
      )
    },
    {
      label: 'Enable Developer Mode',
      description: (
        <Box>
          <Typography variant="body2" gutterBottom>
            Toggle the &quot;Developer mode&quot; switch in the top right corner of the extensions page.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            This allows you to install extensions from outside the Chrome Web Store.
          </Alert>
        </Box>
      )
    },
    {
      label: 'Install Extension',
      description: (
        <Box>
          <Typography variant="body2" gutterBottom>
            1. Extract the downloaded ZIP file
          </Typography>
          <Typography variant="body2" gutterBottom>
            2. Click &quot;Load unpacked&quot; button
          </Typography>
          <Typography variant="body2" gutterBottom>
            3. Select the extracted folder
          </Typography>
          <Alert severity="success" sx={{ mt: 2 }}>
            The extension is now installed and ready to use!
          </Alert>
        </Box>
      )
    },
    {
      label: 'Start Using',
      description: (
        <Box>
          <Typography variant="body2" gutterBottom>
            The CV Tailor extension is now ready! To use it:
          </Typography>
          <Typography variant="body2" component="ul" sx={{ mt: 1 }}>
            <li>Navigate to any job posting</li>
            <li>Highlight the job description text</li>
            <li>Click the CV Tailor extension icon</li>
            <li>Your CV will automatically be tailored for that position!</li>
          </Typography>
        </Box>
      )
    }
  ];

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="CV Tailor Chrome Extension"
      subtitle={!isLoadingVersion && latestVersion ? `Latest version: ${latestVersion}` : "Automatically tailor your CV for any job posting"}
      maxWidth="md"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <ExtensionIcon sx={{ fontSize: 24, color: 'primary.main' }} />
        <Typography variant="body1" color="text.secondary">
          Automatically tailor your CV for any job posting with our Chrome extension!
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 3 }}>
        {installationSteps.map((step, _index) => (
          <Step key={step.label}>
            <StepLabel>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 3 }}>
        {installationSteps[activeStep] && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {installationSteps[activeStep].label}
            </Typography>
            {installationSteps[activeStep].description}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                onClick={() => setActiveStep(activeStep - 1)}
                disabled={activeStep === 0}
                sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
              >
                <ArrowBackIcon />
              </Button>

              <Typography variant="body2" color="text.secondary">
                Step {activeStep + 1} of {installationSteps.length}
              </Typography>

              <Button
                variant="contained"
                onClick={() => setActiveStep(activeStep + 1)}
                disabled={activeStep === installationSteps.length - 1}
                sx={{ visibility: activeStep === installationSteps.length - 1 ? 'hidden' : 'visible' }}
              >
                <ArrowForwardIcon />
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {activeStep === installationSteps.length && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            All done!
          </Typography>
          <Typography variant="body2">
            Your CV Tailor extension is ready to use. Happy job hunting!
          </Typography>
        </Alert>
      )}
    </BaseModal>
  );
};

export default ExtensionDownload;