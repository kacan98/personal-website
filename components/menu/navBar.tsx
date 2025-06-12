"use client";
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
  ReactNode,
  useCallback,
  useEffect,
  useState
} from "react";
import BackgroundEffect from "../layout/BackgroundEffect";

type TopBarProps = {
  modals: {
    name: string;
    modal: ReactNode;
  }[];
};

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

  function handleModalOpen(name: string) {
    setLocalModalOpen(name);
    setMobileMenuOpen(false);
    router.push(pathname + "?" + createQueryString("modalOpen", name));
  }

  function handleModalClose() {
    setLocalModalOpen(null);
    router.push(pathname + "?" + createQueryString("modalOpen"));
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
      SlideProps={{
        // Override the default Slide transition with a Fade
        style: {
          transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)'
        },
        timeout: 500,
      }}
      PaperProps={{
        sx: {
          height: '100vh',
          background: 'rgba(59,130,246,0.08)', // Even more subtle blue for a barely-there effect
          backdropFilter: 'blur(12px)', // More blur for subtlety
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1310, // Higher than modals (1300) and navbar (1301)
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
  ); return (
    <>
      {/* Background element for navbar - matches main layout background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          minHeight: { xs: 56, md: 93 }, // Match navbar height exactly
          zIndex: 1300, // Below navbar (1301) but above page content
        }}
      />
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
              {modals.map(({ name }) => (
                <Button
                  key={name}
                  onClick={() => handleModalOpen(name)}
                  size="large"
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    minHeight: 60,
                    color: 'primary.main',
                    my: 2,
                    display: "block",
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  {name}
                </Button>
              ))}
              <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
            </>
          )}
        </Toolbar>
      </AppBar>      {/* Mobile Drawer */}
      {isMobile && mobileDrawer}
      {modals.map(({ name, modal }) => (
        <Modal
          key={name}
          open={localModalOpen === name}
          onClose={handleModalClose}
          closeAfterTransition
          container={() => document.body} // Force rendering in body
        >
          <Slide direction="up" in={localModalOpen === name} timeout={800} mountOnEnter>
            <Box
              sx={{
                position: 'relative',
                top: isMobile ? '56px' : '92px',
                left: 0,
                right: 0,
                height: `calc(100vh - ${isMobile ? '56px' : '92px'})`,
                width: '100vw',
                overflow: "auto",
                color: "text.primary",
                backgroundColor: '#0f172a',
              }}
            >
              <BackgroundEffect containInParent={true}></BackgroundEffect>
              {/* Close button for modals - positioned above everything */}
              {localModalOpen && (
                <IconButton
                  onClick={handleModalClose}
                  sx={{
                    //put it on the right side of the modal
                    position: "absolute",
                    right: 0,
                    margin: "16px",
                    padding: "16px",
                    zIndex: 1320, // Higher than mobile menu (1310), navbar (1301), and modals (1300)
                    color: "text.primary",
                  }}
                  size={"large"}
                  aria-label="close"
                >
                  <Close fontSize={"large"} />
                </IconButton>
              )}
              {modal}
            </Box>
          </Slide>
        </Modal >
      ))}
    </>
  );
};
export default NavBar;
