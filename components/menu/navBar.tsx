"use client";
import { Close, Home, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState
} from "react";

type NavLink = {
  name: string;
  href: string;
};

type TopBarProps = {
  navLinks: NavLink[];
};

const NavBar = ({ navLinks }: TopBarProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const weAreInSanityStudio = pathname.startsWith("/studio");
  const weAreHome = pathname === "/";
  
  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (weAreInSanityStudio) return null;
  

  // Mobile Navigation Modal
  const mobileMenu = (
    <Modal
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={mobileMenuOpen} timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'primary.main',
            }}
          >
            <Close />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {!weAreHome && (
              <Link href="/" passHref>
                <Button
                  onClick={() => setMobileMenuOpen(false)}
                  size="large"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    minHeight: 60,
                    color: pathname === '/' ? 'secondary.main' : 'primary.main',
                  }}
                >
                  Home
                </Button>
              </Link>
            )}

            {navLinks.map(({ name, href }) => (
              <Link key={name} href={href} passHref>
                <Button
                  onClick={() => setMobileMenuOpen(false)}
                  size="large"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    minHeight: 60,
                    color: pathname === href ? 'secondary.main' : 'primary.main',
                  }}
                >
                  {name}
                </Button>
              </Link>
            ))}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );

  return (
    <>
      {/* Fixed Navbar */}
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          flexShrink: 0,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }}>
          {/* Mobile Layout */}
          {mounted && isMobile ? (
            <>
              {!weAreHome && (
                <Link href="/" passHref>
                  <IconButton
                    size="large"
                    color="inherit"
                    sx={{ mr: 1 }}
                  >
                    <Home color={pathname === '/' ? 'secondary' : 'primary'} />
                  </IconButton>
                </Link>
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
          ) : mounted ? (
            /* Desktop Layout */
            <>
              {!weAreHome && (
                <Link href="/" passHref>
                  <IconButton
                    size="large"
                    color="inherit"
                  >
                    <Home color={pathname === '/' ? 'secondary' : 'primary'} />
                  </IconButton>
                </Link>
              )}
              {navLinks.map(({ name, href }) => (
                <Link key={name} href={href} passHref>
                  <Button
                    size="large"
                    sx={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      minHeight: 60,
                      color: pathname === href ? 'secondary.main' : 'primary.main',
                      my: 2,
                      display: "block",
                    }}
                  >
                    {name}
                  </Button>
                </Link>
              ))}
              <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
            </>
          ) : (
            // Fallback during hydration
            <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Mobile Menu */}
      {mounted && isMobile && mobileMenu}
    </>
  );
};

export default NavBar;