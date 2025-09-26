"use client";
import { Close, Home, Menu as MenuIcon } from "@mui/icons-material";
import { BRAND_COLORS } from "@/app/colors";
import { getContainerSx } from "@/app/spacing";
import {
  AppBar,
  Box,
  Fade,
  IconButton,
  Modal,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Button from "@/components/ui/Button";
import LanguageSelector from "@/components/ui/LanguageSelector";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
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
  const t = useTranslations('navigation');
  const locale = useLocale();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const weAreHome = pathname === "/" || pathname === `/${locale}`;
  
  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  

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
            background: `rgba(${BRAND_COLORS.darkRgb}, 0.95)`,
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
              <Link href={`/${locale}`} passHref>
                <Button
                  variant="nav"
                  isActive={weAreHome}
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    fontSize: '1.2rem',
                    minHeight: 48,
                    borderRadius: '24px',
                  }}
                >
                  {t('home')}
                </Button>
              </Link>
            )}

            {navLinks.map(({ name, href }) => (
              <Link key={name} href={href} passHref>
                <Button
                  variant="nav"
                  isActive={pathname === href || pathname.startsWith(href + '/')}
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{
                    fontSize: '1.2rem',
                    minHeight: 48,
                    borderRadius: '24px',
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
          backdropFilter: 'blur(24px)',
          backgroundColor: 'rgba(15, 15, 15, 0.85)',
          borderBottom: 'none',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 48px)',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)',
          }
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: 56, md: 64 },
          ...getContainerSx()
        }}>
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
              <LanguageSelector />
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
            (<>
              {!weAreHome && (
                <Link href={`/${locale}`} passHref>
                  <IconButton
                    size="large"
                    color="inherit"
                  >
                    <Home color={weAreHome ? 'secondary' : 'primary'} />
                  </IconButton>
                </Link>
              )}
              {navLinks.map(({ name, href }) => (
                <Link key={name} href={href} passHref>
                  <Button
                    variant="nav"
                    isActive={pathname === href || pathname.startsWith(href + '/')}
                    sx={{ mx: 1 }}
                  >
                    {name}
                  </Button>
                </Link>
              ))}
              <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
              <LanguageSelector />
            </>)
          ) : (
            // Fallback during hydration
            (<Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>)
          )}
        </Toolbar>
      </AppBar>
      
      {/* Mobile Menu */}
      {mounted && isMobile && mobileMenu}
    </>
  );
};

export default NavBar;