"use client";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import ModalButton from "@/components/menu/modalButton";
import {
  cloneElement,
  ReactElement,
  ReactNode,
  useCallback,
  useState,
  useEffect,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Home } from "@mui/icons-material";
import React from "react";

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
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
    color: trigger ? "background" : "transparent",
  });
}

const NavBar = ({ modals }: TopBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modalOpenName = searchParams.get("modalOpen");

  // Add local state for immediate modal handling
  const [localModalOpen, setLocalModalOpen] = useState<string | null>(modalOpenName);

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
    // Set local state immediately for instant modal opening
    setLocalModalOpen(name);
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

  useEffect(() => {
    setLocalModalOpen(modalOpenName);
  }, [modalOpenName]);

  if (weAreInSanityStudio) return <></>;

  return (
    <ElevationScroll>
      <AppBar
        position="fixed"
        color={"transparent"}
        sx={{
          m: 0,
          //so that it shows up above the modals (zIndex 1300 in MUI)
          zIndex: 1301,
        }}
      >
        <Toolbar>
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
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
};
export default NavBar;
