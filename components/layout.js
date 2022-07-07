import React from "react";
import {Box} from "@chakra-ui/react";
import SidebarWithHeader from "./sideDrawer";

export default function Layout({ children }) {
  return (
    <SidebarWithHeader>
      <Box p={5}>
        {/*<FileTrail/>*/}
        <main>{ children }</main>
      </Box>
    </SidebarWithHeader>
  );
}
