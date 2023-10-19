import React from "react";
import Link from "next/link";
import Layout from "../../../components/layout";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {useGetClientsQuery, useGetOnboardClientsQuery} from "../../../src/services/client";
import Loading from "../../../components/loading";
import {FiBarChart, FiCheck, FiFilter, FiKey, FiTool, FiX} from "react-icons/fi";
import _ from "lodash";
import TabHeader from "../../../components/tabHeader";
import ItemsPerPage from "../../../components/itemsPerPage";
import {ArrowRightIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {useGetSageClientsQuery} from "../../../src/services/sage";
import {xmlToJsonArray} from "../../../lib/xmlParser";
import {TableFooter} from "semantic-ui-react";
import {useGetOnboardUsersQuery} from "../../../src/services/onboardUser";

const statusColors = {
  Potential: "#1A5276",
  Queued: "#F4D03F",
  Approved: "#3498DB",
  Declined: "#E74C3C",
  Pushed: "#58D68D",
};

export default function Dashboard() {
  const sage = useGetSageClientsQuery();
  const onboard = useGetOnboardClientsQuery();
  const onboardUsers = useGetOnboardUsersQuery();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [clients, setClients] = React.useState([]);
  const [backupClients, setBackupClients] = React.useState([]);
  const [clientsPerPage, setClientsPerPage] = React.useState(10);
  const [numOfPages, setNumOfPages] = React.useState(Math.ceil(clients.length / clientsPerPage));
  const [activePage, setActivePage] = React.useState(0);
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(10);
  let sorts = {name: false, firstName: false, territory: false, status: false};
  const [filters, setFilters] = React.useState({status: [], territory: [], salesRep: []});
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.300', 'gray.700');

  React.useEffect(() => {
    if (sage.data && onboard.data && onboardUsers.data) {
      let allClients = mergeClients(sage.data.clients, onboard.data, onboardUsers.data.users);
      setClients([...allClients]);
      setBackupClients([...allClients]);
      setNumOfPages(Math.ceil(allClients.length / clientsPerPage));
    }
  }, [ sage.data, onboard.data, onboardUsers.data, clientsPerPage ]);

  const mergeClients = (sageData, onboardData, usersData) => {
    let sageClients = [...sageData];
    let mergedClients = [];
    let allClients = [];
    let clients = [];

    sageClients.forEach((sageClient, i) => {
      onboardData.clients.forEach(onboardClient => {
        if (sageClient.ObjectID.toString() === onboardClient.sageObjectId) {
          mergedClients.push({...onboardClient, ...sageClient});
          sageClients.splice(i, 1);
        }
      });
    });

    allClients = mergedClients.concat(sageClients);

    allClients.forEach(client => {
      usersData.forEach(user => {
        if (client.SalespersonRef === user.sageEmployeeNumber.toString()) {
          let mergedClient = {...client, ...user};
          clients.push(mergedClient);
          return;
        } else if (client.userId === user.sageEmployeeNumber) {
          let mergedClient = {...client, ...user};
          clients.push(mergedClient);
          return;
        }
      });
    });

    return clients;
  }

  if (sage.isLoading || sage.data === undefined) return <Loading/>;

  const handleChange = (event) => {
    setStart(0);
    setEnd(event.target.value);
    setClientsPerPage(event.target.value)
    setNumOfPages(Math.ceil(clients.length / event.target.value));
  }

  const handleInput = (event) => {
    if (event.target.value === "") {
      setClients([...backupClients]);
    }

    let tempClients = backupClients.filter(client =>
      client.ShortName.toLowerCase().includes(event.target.value.toLowerCase())
    )
    setClients(tempClients);
    setActivePage(0);
    setStart(0);
    setEnd(clientsPerPage);
    setNumOfPages(Math.ceil(tempClients.length / clientsPerPage));
  }

  const Pagination = () => {
    const onChange = (index) => {
      setActivePage(index);
      setStart(index * clientsPerPage);
      setEnd((index + 1) * clientsPerPage);
    }

    return (
      <HStack>
        {new Array(numOfPages).fill("").map((value, index) => (
          <Button
            onClick={() => onChange(index)} key={index}
            colorScheme={activePage === index ? "blue" : "gray"}
          >
            {index + 1}
          </Button>
        ))}
      </HStack>
    );
  }

  const handleSort = (event) => {
    if (event.target.checked) {
      sorts[event.target.value] = true;
      setClients(_.sortBy(backupClients, Object.keys(sorts).filter(x => sorts[x] === true)));
    } else if (!event.target.checked) {
      sorts[event.target.value] = false;
      setClients(_.sortBy(backupClients, Object.keys(sorts).filter(x => sorts[x] === true)));
    }
  }

  return (
    <Layout>
      <TabHeader title={"Sage Clients"}/>

      <TableContainer borderWidth={"1px"} borderRadius={5} borderColor={borderColor}>
        <HStack justifyContent={"space-between"} p={3}>
          <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>Sage Clients</Text>
          <HStack flex={1}>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{boxShadow: 'none'}}>
                <IconButton
                  variant="outline"
                  aria-label="open menu"
                  icon={<FiBarChart/>}
                />
              </MenuButton>
              <MenuList
                bg={bgColor}
                borderColor={borderColor}>
                <CheckboxGroup>
                  <MenuOptionGroup title={"Sort"}>
                    <Checkbox p={2} onChange={e => handleSort(e)} value={"ShortName"}>by Client
                      Name
                    </Checkbox>
                  </MenuOptionGroup>
                  <MenuOptionGroup>
                    <Checkbox p={2} onChange={e => handleSort(e)} value={"territory"}>by
                      Territory
                    </Checkbox>
                  </MenuOptionGroup>
                  <MenuOptionGroup>
                    <Checkbox p={2} onChange={e => handleSort(e)} value={"firstName"}>by Sales
                      Rep.
                    </Checkbox>
                  </MenuOptionGroup>
                </CheckboxGroup>
              </MenuList>
            </Menu>

            <ItemsPerPage placeholder={"Clients per Page"} value={clientsPerPage} options={[10, 20, 50, 100]} onChange={handleChange} />

            <Input placeholder={"Search Clients"} onChange={handleInput} minW={150}/>
          </HStack>
        </HStack>
        <Divider color={borderColor}/>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Territory</Th>
              <Th>Sales Rep.</Th>
              <Th>
                <Box display={"flex"} justifyContent={"center"}>
                  OnBoard
                </Box>
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.slice(start, end).map(item => (
              <Tr _hover={{cursor: "pointer"}} key={item.clientId}>
                <Td>{item.Name}</Td>
                <Td>{item.territory}</Td>
                <Td>
                  { item.firstName && item.lastName ?
                    `${item.firstName} ${item.lastName}`
                    :
                    <Text color={"red"}>Invalid Sales Assoc.</Text>
                  }
                </Td>
                <Td>
                  <Box display={"flex"} justifyContent={"center"}>
                    { item.clientId === undefined ?
                      <FiX size={"1.5em"} color={"red"} />
                      :
                      <FiCheck size={"1.5em"} color={"green"} />
                    }
                  </Box>
                </Td>
                <Td>
                  <Box display={"flex"} justifyContent={"flex-end"}>
                    <Menu>
                      <MenuButton
                        disabled={item.clientId === undefined}
                        as={IconButton}
                        aria-label={"options"}
                        icon={<FiTool size={20} />}
                        variant={"ghost"}
                        mx={1}/>
                      <MenuList>
                        <MenuItem icon={<FiKey size={20}/>}>Unlock Client Data</MenuItem>
                      </MenuList>
                    </Menu>

                    { item.clientId !== undefined ?
                      <Link href={`/clients/sage/${item.clientId}`}>
                        <IconButton aria-label={"Client Actions"} icon={<ArrowRightIcon ml={1}/>} variant={"ghost"}/>
                      </Link>
                      :
                      <Link href={`/clients/sage/external/${item.ObjectID}`}>
                        <IconButton aria-label={"Client Actions"} icon={<ArrowRightIcon ml={1}/>} variant={"ghost"}/>
                      </Link>
                    }
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <TableFooter>
            <Tr>
              <Td/>
              <Td/>
              <Td/>
              <Td/>
              <Td>
                <Box display={"flex"} justifyContent={"flex-end"}>
                  Total # of Clients: {clients.length}
                </Box>
              </Td>
            </Tr>
          </TableFooter>
        </Table>

        <HStack justifyContent={"center"} p={3}>
          <Pagination/>
        </HStack>
      </TableContainer>
    </Layout>
  );
}