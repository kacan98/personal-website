"use client";
import ModalButton from "@/components/menu/modalButton";
import BackgroundEffect from "@/components/background/BackgroundEffect";
import { Close, Home, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Modal,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  cloneElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

type TopBarProps = {
  modals: {
    name: string;
    modal: ReactNode;
  }[];
};

interface ElevationScrollProps {
  children: ReactElement;
}

function ElevationScroll(props: ElevationScrollProps) {
  const { children } = props;

  return cloneElement(children, {
    elevation: 0,
    sx: {
      ...children.props.sx,
      backgroundColor: 'rgba(15, 23, 42, 0.3)', // Always use the transparent background
      backdropFilter: 'blur(5px)',
      transition: 'all 0.3s ease',
      boxShadow: 'none !important', // Force remove any shadow artifacts
      borderBottom: 'none', // Remove any border
      '&::before': { // Remove any pseudo-element shadows
        display: 'none'
      },
      '&::after': { // Remove any pseudo-element shadows
        display: 'none'
      }
    },
  });
}

const NavBar = ({ modals }: TopBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modalOpenName = searchParams.get("modalOpen");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Add local state for immediate modal handling
  const [localModalOpen, setLocalModalOpen] = useState<string | null>(modalOpenName);
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const weAreInSanityStudio = pathname.startsWith("/studio");
  const weAreHome = pathname === "/";

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );
  // Effect to sync URL state with local state
  useEffect(() => {
    // Update local state when URL changes
    if (modalOpenName !== localModalOpen) {
      setLocalModalOpen(modalOpenName);
    }
  }, [modalOpenName]);
  // Remove the problematic body scroll effect - let modals handle their own scrolling
  function handleModalOpen(name: string) {
    // Set local state immediately for instant modal opening
    setLocalModalOpen(name);
    // Close mobile menu if open
    setMobileMenuOpen(false);
    // Update URL in the background
    setTimeout(() => {
      router.push(pathname + "?" + createQueryString("modalOpen", name));
    }, 0);
  }

  function handleModalClose() {
    // Close modal immediately with local state
    setLocalModalOpen(null);
    // Update URL in the background
    setTimeout(() => {
      router.push(pathname + "?" + createQueryString("modalOpen"));
    }, 0);
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const handleMobileNavigation = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  if (weAreInSanityStudio) return <></>;  // Mobile Navigation Drawer
  const mobileDrawer = (
    <Drawer
      anchor="top"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          height: '100vh',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(30,30,30,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1310, // Higher than modals (1300) and navbar (1301)
        }
      }}
      SlideProps={{
        style: {
          background: 'transparent',
        }
      }}
      sx={{
        zIndex: 1310, // Also set on the Drawer itself to ensure proper stacking
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={() => setMobileMenuOpen(false)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
            color: 'primary.main',
          }}
        >
          <Close />
        </IconButton>

        {/* Navigation items */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            padding: 4,
          }}
        >
          {!weAreHome && (
            <Button
              onClick={() => handleMobileNavigation('/')}
              size="large"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 600,
                minHeight: 60,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Home
            </Button>
          )}

          {modals.map(({ name }) => (
            <Button
              key={name}
              onClick={() => handleModalOpen(name)}
              size="large"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 600,
                minHeight: 60,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              {name}
            </Button>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
  return (
    <>      {/* Close button for modals - positioned above everything */}
      {localModalOpen && (
        <IconButton
          onClick={handleModalClose}
          sx={{
            position: "fixed",
            right: 50,
            top: 30,
            padding: 5,
            zIndex: 1320, // Higher than mobile menu (1310), navbar (1301), and modals (1300)
            color: "text.primary",
          }}
          edge="end"
          size={"large"}
          aria-label="close"
        >
          <Close fontSize={"large"} />
        </IconButton>
      )}

      <ElevationScroll>
        <AppBar
          position="sticky"
          color="transparent"
          sx={{
            m: 0,
            //so that it shows up above the modals (zIndex 1300 in MUI)
            zIndex: 1301,
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }}>
            {/* Mobile Layout */}
            {isMobile ? (
              <>
                {!weAreHome && (
                  <IconButton
                    size="large"
                    onClick={() => router.push("/")}
                    color="inherit"
                    sx={{ mr: 1 }}
                  >
                    <Home color="primary" />
                  </IconButton>
                )}

                <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>

                <IconButton
                  size="large"
                  onClick={toggleMobileMenu}
                  color="inherit"
                >
                  <MenuIcon color="primary" />
                </IconButton>
              </>
            ) : (
              /* Desktop Layout */
              <>
                {!weAreHome && (
                  <IconButton
                    size="large"
                    onClick={() => router.push("/")}
                    color="inherit"
                  >
                    <Home color="primary" />
                  </IconButton>
                )}
                {modals.map(({ name, modal }) => (
                  <ModalButton
                    onOpen={() => handleModalOpen(name)}
                    onClose={() => handleModalClose()}
                    open={localModalOpen === name}
                    key={name}
                    buttonName={name}
                  >
                    {modal}
                  </ModalButton>
                ))}
                <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
              </>
            )}
          </Toolbar>
        </AppBar>
      </ElevationScroll>

      {/* Mobile Drawer */}
      {isMobile && mobileDrawer}      {/* Modals - with proper animation */}
      {modals.map(({ name, modal }) => (
        <Modal
          key={name}
          open={localModalOpen === name}
          onClose={handleModalClose}
          closeAfterTransition
        >
          <Slide direction="up" in={localModalOpen === name} timeout={500}>
            <div>
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  bgcolor: "#0f172a", // Match the main layout background - same as desktop modal
                  color: "text.primary",
                }}
              >
                <BackgroundEffect />
                {modal}
              </Box>
            </div>
          </Slide>
        </Modal>
      ))}
    </>
  );
};
export default NavBar;
