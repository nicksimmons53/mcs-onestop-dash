import React from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import {
  border,
  Button, Checkbox, CheckboxGroup,
  Divider,
  HStack,
  IconButton,
  Input, Menu, MenuButton, MenuDivider, MenuList, MenuOptionGroup,
  Select,
  Table,
  TableContainer, Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr, useColorModeValue, useDisclosure, VStack,
} from "@chakra-ui/react";
import { useGetClientsQuery } from "../../src/services/client";
import Loading from "../../components/loading";
import {FiBarChart, FiChevronDown, FiFilter} from "react-icons/fi";
import {TableFooter} from "semantic-ui-react";
import _ from "lodash";

const statusColors = {
  Potential: "#1A5276",
  Queued: "#F4D03F",
  Approved: "#3498DB",
  Declined: "#E74C3C",
  Pushed: "#58D68D",
};

export default function Dashboard( )  {
  const { data, error, isLoading } = useGetClientsQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clients, setClients] = React.useState([]);
  const [clientsPerPage, setClientsPerPage] = React.useState(10);
  const [numOfPages, setNumOfPages] = React.useState(Math.ceil(clients.length/clientsPerPage));
  const [activePage, setActivePage] = React.useState(0);
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(10);
  let sorts = { name: false, firstName: false, territory: false, status: false };
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.300', 'gray.700');
  let filters = {
    status: { "Potential": false, "Queued": false, "Declined": false, "Approved": false },
    territory: { "Austin": false, "Dallas": false, "Houston": false, "San Antonio": false },
    salesRep: { "Christina": false, "Natalia": false, "Kori": false, "Shelley": false, "Kimberly": false, "Casey": false }
  };

  console.log(clients)

  React.useEffect(( ) => {
    if (data) {
      setClients(data.clients);
      setNumOfPages(Math.ceil(data.clients.length/clientsPerPage));
    }
  }, [ data ]);

  if (isLoading || data === undefined) return <Loading/>;

  const handleChange = (event) => {
    setStart(0);
    setEnd(event.target.value);;
    setClientsPerPage(event.target.value)
    setNumOfPages(Math.ceil(clients.length/event.target.value));
  }

  const handleInput = (event) => {
    if (event.target.value === "") {
      setClients(data.clients);
    }

    let tempClients = data.clients.filter(client =>
        client.name.toLowerCase().includes(event.target.value.toLowerCase())
    )
    setClients(tempClients);
    setActivePage(0);
    setStart(0);
    setEnd(clientsPerPage);
    setNumOfPages(Math.ceil(tempClients.length/clientsPerPage));
  }

  const ClientsPerPage = () => (
    <Select placeholder={"Clients per Page"} value={clientsPerPage} onChange={handleChange}>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </Select>
  );

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
      setClients(_.sortBy(clients, Object.keys(sorts).filter(x => sorts[x] === true)));
    } else if (!event.target.checked) {
      sorts[event.target.value] = false;
      setClients(_.sortBy(data.clients, Object.keys(sorts).filter(x => sorts[x] === true)));
    }
  }

  return (
    <Layout>
      <Head>
        <title>MCS | Clients</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000"/>
        <meta name="msapplication-TileColor" content="#cad3d5"/>
        <meta name="theme-color" content="#ffffff"/>
      </Head>

      <TableContainer borderWidth={"1px"} borderRadius={5} borderColor={borderColor}>
        <HStack justifyContent={"space-between"} p={3}>
          <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>Clients</Text>
          <HStack flex={1}>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: 'none' }}>
                <IconButton
                  variant="outline"
                  aria-label="open menu"
                  icon={<FiBarChart />}
                />
              </MenuButton>
              <MenuList
                bg={bgColor}
                borderColor={borderColor}>
                <CheckboxGroup>
                  <MenuOptionGroup title={"Sort"}>
                    <Checkbox p={2} onChange={e => handleSort(e)} value={"name"}>by Client Name</Checkbox>
                  </MenuOptionGroup>
                  <MenuOptionGroup>
                    <Checkbox p={2} onChange={e => handleSort(e)} value={"territory"}>by Territory</Checkbox>
                  </MenuOptionGroup>
                  <MenuOptionGroup>
                    <Checkbox p={2} onChange={e => handleSort(e)} value={"firstName"}>by Sales Rep.</Checkbox>
                  </MenuOptionGroup>
                  <MenuOptionGroup>
                    <Checkbox p={2} onChange={e => handleSort(e)} value={"status"}>by Status</Checkbox>
                  </MenuOptionGroup>
                </CheckboxGroup>
              </MenuList>
            </Menu>
            <ClientsPerPage/>
            <Input placeholder={"Search Clients"} onChange={handleInput}/>
          </HStack>
        </HStack>
        <Divider color={borderColor}/>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Territory</Th>
              <Th>Sales Rep.</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.slice(start, end).map(item => (
              <Link href={`/clients/${item.clientId}`} key={item.clientId}>
                <Tr _hover={{ cursor: "pointer" }}>
                  <Td>{item.name}</Td>
                  <Td>{item.territory}</Td>
                  <Td>{item.firstName} {item.lastName}</Td>
                  <Td>
                    <Tag
                        size={"md"}
                        variant={"solid"}
                        backgroundColor={statusColors[item.status]}
                    >
                      {item.status}
                    </Tag>
                  </Td>
                </Tr>
              </Link>
            ))}
          </Tbody>
          <TableFooter>
            <Tr>
              <Td/>
              <Td/>
              <Td/>
              <Td>Total # of Clients: {clients.length}</Td>
            </Tr>
          </TableFooter>
        </Table>

        <HStack justifyContent={"center"} p={3}>
          <Pagination/>
        </HStack>
      </TableContainer>
    </Layout>
  )
}
