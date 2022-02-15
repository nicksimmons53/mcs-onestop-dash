import React from "react";
import Navbar from "./navbar";
import Drawer from "./drawer";
import FileTrail from "./file-trail";

export default function Layout({ children }) {
  const [ showSidebar, setShowSidebar ] = React.useState(false);

  return (
    <>
      <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
      <Drawer showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>
      <FileTrail/>

      <main>{ children }</main>
    </>
  );
}