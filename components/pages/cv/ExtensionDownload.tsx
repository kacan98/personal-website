import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert
} from '@mui/material';
import {
  Extension as ExtensionIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

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
          // For Vercel deployments, use environment or fallback
          repoUrl = process.env.NEXT_PUBLIC_GITHUB_REPO || 'your-username/personal-website';
        } else if (hostname.endsWith('.github.io')) {
          // GitHub Pages
          const owner = hostname.replace('.github.io', '');
          repoUrl = `${owner}/personal-website`;
        } else {
          // Custom domain or localhost - use environment or fallback
          repoUrl = process.env.NEXT_PUBLIC_GITHUB_REPO || 'your-username/personal-website';
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
        repoUrl = process.env.NEXT_PUBLIC_GITHUB_REPO || 'your-username/personal-website';
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
            Open Chrome and navigate to the extensions page:
          </Typography>
          <Box sx={{ mt: 1, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <code>chrome://extensions/</code>
          </Box>
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Or go to Menu → More Tools → Extensions
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
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              The extension is pre-configured to work with {typeof window !== 'undefined' ? window.location.origin : 'this website'}
            </Typography>
          </Alert>
        </Box>
      )
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ExtensionIcon />
          <Box>
            <Typography variant="h6" component="div">
              CV Tailor Chrome Extension
            </Typography>
            {!isLoadingVersion && latestVersion && (
              <Typography variant="caption" color="text.secondary">
                Latest version: {latestVersion}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
          Automatically tailor your CV for any job posting with our Chrome extension!
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
          {installationSteps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === installationSteps.length - 1 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {step.description}
                <Box sx={{ mt: 2 }}>
                  {index < installationSteps.length - 1 && (
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(index + 1)}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Continue
                    </Button>
                  )}
                  {index > 0 && (
                    <Button
                      onClick={() => setActiveStep(index - 1)}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === installationSteps.length && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              🎉 All done!
            </Typography>
            <Typography variant="body2">
              Your CV Tailor extension is ready to use. Happy job hunting!
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExtensionDownload;