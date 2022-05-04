import Image from "next/image"
import {Button, Input, Menu} from "semantic-ui-react"
import {useUser} from "@auth0/nextjs-auth0";

const NavBar = ( props ) => {
  const { user } = useUser();

  return (
    <Menu fixed={"top"} fluid>
      <Menu.Item>
        <Button primary icon={"th"} onClick={( ) => props.setShowSidebar(!props.showSidebar)}/>
      </Menu.Item>
      <Menu.Item>
        <Input className={"icon"} icon={"search"} placeholder={"Search"} disabled/>
      </Menu.Item>
      <Menu.Menu position={"right"}>
        <Menu.Item>
          <Button primary icon={"bell"} disabled/>
        </Menu.Item>
        <Menu.Item>
          { user && <img src={user.picture} alt={user.name}/> }
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}

export default NavBar;
