"use client";
import { AppBar, Toolbar, Typography } from "@mui/material";
import ModalButton from "@/components/menu/modalButton";
import { ReactNode, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type TopBarProps = {
  pages: {
    name: string;
    page: ReactNode;
  }[];
};

const TopBar = ({ pages }: TopBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modalOpenName = searchParams.get("modalOpen");

  const weAreInSanityStudio = pathname.startsWith("/studio");

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

  function handleModalOpen(name: string) {
    router.push(pathname + "?" + createQueryString("modalOpen", name));
  }

  function handleModalClose() {
    router.push(pathname + "?" + createQueryString("modalOpen"));
  }

  return weAreInSanityStudio ? (
    <></>
  ) : (
    <AppBar
      position="fixed"
      color={"transparent"}
      sx={{
        boxShadow: "none",
        //so that it shows up above the modals (zIndex 1300 in MUI)
        zIndex: 1301,
      }}
    >
      <Toolbar>
        {pages.map(({ name, page }) => (
          <ModalButton
            onOpen={() => handleModalOpen(name)}
            onClose={() => handleModalClose()}
            open={modalOpenName === name}
            key={name}
            buttonName={name}
          >
            {page}
          </ModalButton>
        ))}
        <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
