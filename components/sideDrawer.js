import React from "react";
import Link from "next/link";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  FiHome,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUsers, FiShield,
} from "react-icons/fi";
import {ArrowRightIcon, MoonIcon, SunIcon} from "@chakra-ui/icons";
import {useUser} from "@auth0/nextjs-auth0";
import Loading from "./loading";
import icon from "../public/icon.png";
import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import {setNav} from "../src/reducers/navReducer";

const linkItems = [
  {
    name: "Home",
    icon: FiHome,
    path: "/",
    menu: false,
    active: false
  },
  {
    name: "Clients",
    icon: FiUsers,
    path: null,
    menu: true,
    active: false,
    subItems: [
      {name: "OnBoard Clients", path: "/clients/onboard/dashboard"},
      // { name: "Sage Clients", path: "/clients/sage/dashboard" }
    ]
  },
  // {
  //   name: "Admin",
  //   icon: FiShield,
  //   menu: false,
  //   active: false,
  // }
];

export default function SidebarWithHeader({children}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.900");
  const dispatch = useDispatch();

  const setPath = (path) => {
    dispatch(setNav(path));
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <SidebarContent
        onClose={() => onClose}
        display={{base: "none", md: "block"}}
        setPath={setPath}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose}/>
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen}/>
      <Box ml={{base: 0, md: 60}} p="4">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({setPath, onClose, ...rest}) => {
  const bgColor = useColorModeValue("gray.900", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const path = useSelector(state => state.nav.path);

  console.log(path)

  return (
    <Box
      transition="3s ease"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{base: "full", md: 60}}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={icon} width={40} height={40} style={{borderRadius: 5}} alt={"MC Surfaces Inc. Logo"}/>
        <Text fontSize="2xl" fontWeight="bold" color={"white"} alt={"MC Surfaces, Inc. Logo"}>
          OneStop
        </Text>
        <CloseButton color={"white"} display={{base: "flex", md: "none"}} onClick={onClose}/>
      </Flex>

      <Divider/>

      <Accordion allowMultiple>
        {linkItems.map((link, i) => (
            <React.Fragment key={link.name}>
              <AccordionItem
                align="center"
                color={"white"}
                borderColor={"gray.900"}
                my={"2"}
                borderRadius={"md"}
                role="group"
                cursor="pointer"
                flex={1}
                _hover={{
                  bg: "cyan.400",
                  color: "white",
                }}>

                {!link.menu &&
                  <Link href={`${link.path}`} onClick={() => setPath(link.path)}>
                    <Flex
                      alignItems={"center"}
                      bg={path === link.path && "cyan.400"}
                      borderRadius={"md"}
                      flex={1}
                      pl={2}
                      pr={2}
                      py={2}
                      _hover={{bg: "cyan.400", color: "white"}}>
                      <Box p={2}>
                        <link.icon/>
                      </Box>
                      {link.name}
                    </Flex>
                  </Link>
                }

                {link.menu &&
                  <React.Fragment>
                    <AccordionButton
                      _expanded={{bg: "cyan.400", borderBottomRadius: "none"}}
                      bg={path === link.path && "cyan.400"}
                      borderRadius={"md"}
                      flex={1}
                      justifyContent={"space-between"}
                      pl={2}
                      pr={1}>
                      <Flex alignItems={"center"}>
                        <Box p={2}>
                          <link.icon/>
                        </Box>
                        {link.name}
                      </Flex>
                      {link.menu && <AccordionIcon/>}
                    </AccordionButton>

                    <AccordionPanel
                      bg={"cyan.400"}
                      borderBottomRadius={"md"}
                      px={0}
                      pb={0}>
                      {link.subItems && link.subItems.map(subItem => (
                        <Link key={subItem.name} href={`${subItem.path}`} onClick={() => setPath(subItem.path)}>
                          <Flex
                            alignItems={"center"}
                            bg={path === subItem.path ? "cyan.500" : "cyan.400"}
                            borderRadius={"md"}
                            flex={1}
                            justifyContent={"space-between"}
                            pl={6}
                            pr={2}
                            py={3}
                            _hover={{bg: "cyan.500", color: "white"}}>
                            <Text>{subItem.name}</Text>
                            <ArrowRightIcon boxSize={3}/>
                          </Flex>
                        </Link>
                      ))}
                    </AccordionPanel>
                  </React.Fragment>
                }
              </AccordionItem>
            </React.Fragment>
          )
        )}
      </Accordion>
    </Box>
  );
};

const MobileNav = ({onOpen, ...rest}) => {
  const {colorMode, toggleColorMode} = useColorMode();
  const {user} = useUser();
  const bgColor = useColorModeValue("white4", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");

  if (!user) {
    return <Loading/>
  }

  return (
    <Flex
      ml={{base: 0, md: 60}}
      px={{base: 4, md: 4}}
      height="20"
      alignItems="center"
      bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent={{base: "space-between", md: "flex-end"}}
      {...rest}>
      <HStack>
        <IconButton
          display={{base: "flex", md: "none"}}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu/>}
        />

        <Text
          display={{base: "flex", md: "none"}}
          fontSize="2xl"
          fontWeight="bold">
          OneStop
        </Text>
      </HStack>

      <HStack spacing={{base: "0", md: "3"}}>
        <IconButton
          onClick={toggleColorMode}
          size="lg"
          variant="outline"
          aria-label="change color mode"
          icon={colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
        />

        <IconButton
          size="lg"
          variant="outline"
          aria-label="open menu"
          icon={<FiBell/>}
        />

        <Flex alignItems={"center"} ml={2}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{boxShadow: "none"}}>
              <HStack>
                <Avatar
                  size={"sm"}
                  src={user.picture}
                />
                <VStack
                  display={{base: "none", md: "flex"}}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{user.name}</Text>
                  {/*<Text fontSize="xs" color="gray.600">*/}
                  {/*  Admin*/}
                  {/*</Text>*/}
                </VStack>
                <Box display={{base: "none", md: "flex"}}>
                  <FiChevronDown/>
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuDivider/>
              <a href={"/api/auth/logout"}>
                <MenuItem>Sign Out</MenuItem>
              </a>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
