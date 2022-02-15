import Link from "next/link";
import { Icon, Menu, Sidebar } from "semantic-ui-react";

const Drawer = ( props ) => {
  return (
    <Sidebar
      as={Menu}
      fixed={"left"}
      animation={"overlay"}
      vertical
      inverted
      visible={props.showSidebar}
    >
      <Menu.Item>
        OneStop
        <Icon name={"arrow left"} inverted onClick={( ) => props.setShowSidebar(false)}/>
      </Menu.Item>

      <Link href={"/"}>
        <Menu.Item onClick={( ) => props.setShowSidebar(false)}>Home</Menu.Item>
      </Link>

      <Link href={"/clients/dashboard"}>
        <Menu.Item onClick={( ) => props.setShowSidebar(false)}>Clients</Menu.Item>
      </Link>

      <Menu.Item>Settings</Menu.Item>

      <Link href={"/api/auth/logout"}>
        <Menu.Item>Logout</Menu.Item>
      </Link>
    </Sidebar>
  );
}

export default Drawer;