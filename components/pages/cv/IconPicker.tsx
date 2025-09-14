import { SUPPORTED_ICONS, supportedIconNames } from "@/components/icon";
import { DIFF_COLORS } from "@/app/colors";
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Popover,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { useState, useMemo } from "react";

export const IconPicker = ({
  currentIconName,
  onIconSelect,
  disabled = false,
  originalIconName,
  showDiff = false
}: {
  currentIconName: string;
  onIconSelect: (iconName: string) => void;
  disabled?: boolean;
  originalIconName?: string;
  showDiff?: boolean;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery(""); // Reset search when closing
    setShowAll(false); // Reset to limited view
  };

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName);
    handleClose();
  };

  const currentIcon = SUPPORTED_ICONS[currentIconName];
  const hasChanged = showDiff && originalIconName && originalIconName !== currentIconName;

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    let icons = supportedIconNames;

    if (searchQuery.trim()) {
      icons = icons.filter(({ name, key }) =>
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // If no search query, show only first 40 icons unless "Show All" is clicked
    if (!searchQuery.trim() && !showAll) {
      icons = icons.slice(0, 40);
    }

    return icons;
  }, [searchQuery, showAll]);

  const totalIconCount = supportedIconNames.length;

  return (
    <>
      <Tooltip title={disabled ? "" : "Change icon"}>
        <IconButton
          onClick={handleClick}
          disabled={disabled}
          size="small"
          sx={{
            minWidth: 'auto',
            p: 0.5,
            backgroundColor: hasChanged ? DIFF_COLORS.added.background : 'transparent',
            color: hasChanged ? DIFF_COLORS.added.text : 'inherit',
            border: hasChanged ? `1px solid ${DIFF_COLORS.added.border}` : 'none',
            borderRadius: 1,
            '&:hover': disabled ? {} : {
              backgroundColor: 'primary.main',
              color: 'white',
            }
          }}
        >
          {currentIcon?.component() || SUPPORTED_ICONS['externalLink']?.component()}
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ p: 2, maxWidth: 400, maxHeight: 500 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Select an icon ({filteredIcons.length} of {totalIconCount}):
          </Typography>

          {/* Search Input */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Icons Grid */}
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <Grid container spacing={1}>
              {filteredIcons.map(({ key, name }) => (
                <Grid key={key}>
                  <Tooltip title={name}>
                    <IconButton
                      onClick={() => handleIconSelect(key)}
                      size="small"
                      sx={{
                        border: 1,
                        borderColor: currentIconName === key ? 'primary.main' : 'divider',
                        backgroundColor: currentIconName === key ? 'primary.main' : 'transparent',
                        color: currentIconName === key ? 'white' : 'text.primary',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          color: 'primary.main',
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      {SUPPORTED_ICONS[key]?.component()}
                    </IconButton>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Show All Button */}
          {!searchQuery.trim() && !showAll && filteredIcons.length < totalIconCount && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  color: 'primary.main',
                  textDecoration: 'underline',
                  '&:hover': { color: 'primary.dark' }
                }}
                onClick={() => setShowAll(true)}
              >
                Show all {totalIconCount} icons
              </Typography>
            </Box>
          )}
        </Paper>
      </Popover>
    </>
  );
};