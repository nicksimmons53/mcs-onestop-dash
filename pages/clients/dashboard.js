import React from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import {
  Button, Checkbox, CheckboxGroup,
  Divider,
  HStack,
  IconButton,
  Input, Menu, MenuButton, MenuDivider, MenuList, MenuOptionGroup,
  Select,
  Table,
  TableContainer,
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
  let filters = {
    status: { "Potential": false, "Queued": false, "Declined": false, "Approved": false },
    territory: { "Austin": false, "Dallas": false, "Houston": false, "San Antonio": false },
    salesRep: { "Christina": false, "Natalia": false, "Kori": false, "Shelley": false, "Kimberly": false, "Casey": false }
  };

  React.useEffect(( ) => {
    if (data) {
      setClients(data.clients);
      setNumOfPages(Math.ceil(data.clients.length/clientsPerPage));
    }
  }, [ data ]);

  if (isLoading || data === undefined) return <Loading/>;

  const handleChange = (event) => {
    setStart(0);
    setEnd(event.target.value);
    setClientsPerPage(event.target.value)
    setNumOfPages(Math.ceil(clients.length/event.target.value));
  }

  const handleInput = (event) => {
    if (event.target.value === "") {
      setClients(data.clients);
    }

    setClients(data.clients.filter(client =>
      client.name.toLowerCase().includes(event.target.value.toLowerCase())
    ));
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
      </Head>

      <TableContainer borderWidth={"1px"} borderRadius={5}>
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
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}>
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

            {/*<Menu>*/}
            {/*  <MenuButton*/}
            {/*    py={2}*/}
            {/*    transition="all 0.3s"*/}
            {/*    _focus={{ boxShadow: 'none' }}>*/}
            {/*    <IconButton*/}
            {/*      variant="outline"*/}
            {/*      aria-label="open menu"*/}
            {/*      icon={<FiFilter />}*/}
            {/*    />*/}
            {/*  </MenuButton>*/}
            {/*  <MenuList*/}
            {/*    bg={useColorModeValue('white', 'gray.900')}*/}
            {/*    borderColor={useColorModeValue('gray.200', 'gray.700')}>*/}
            {/*    <MenuOptionGroup title={"Filter by Status"}>*/}
            {/*      <Checkbox p={2} onChange={e => handleFilter(e)} value={["status", "Potential"]}>Potential</Checkbox>*/}
            {/*      <Checkbox p={2} onChange={e => handleFilter(e)} value={["status", "Queued"]}>Queued</Checkbox>*/}
            {/*      <Checkbox p={2} onChange={e => handleFilter(e)} value={["status", "Declined"]}>Declined</Checkbox>*/}
            {/*      <Checkbox p={2} onChange={e => handleFilter(e)} value={["status", "Approved"]}>Approved</Checkbox>*/}
            {/*      <Checkbox p={2} onChange={e => handleFilter(e)} value={["status", "Pushed"]}>Pushed</Checkbox>*/}
            {/*    </MenuOptionGroup>*/}
            {/*    <MenuDivider />*/}
            {/*    <MenuOptionGroup title={"Filter by Territory"}>*/}
            {/*      <Checkbox p={2}>Austin</Checkbox>*/}
            {/*      <Checkbox p={2}>Dallas</Checkbox>*/}
            {/*      <Checkbox p={2}>Houston</Checkbox>*/}
            {/*      <Checkbox p={2}>San Antonio</Checkbox>*/}
            {/*    </MenuOptionGroup>*/}
            {/*    <MenuDivider />*/}
            {/*    <MenuOptionGroup title={"Filter by Sales Rep."}>*/}
            {/*      <Checkbox p={2}>Christina</Checkbox>*/}
            {/*      <Checkbox p={2}>Natalia</Checkbox>*/}
            {/*      <Checkbox p={2}>Kori</Checkbox>*/}
            {/*      <Checkbox p={2}>Shelley</Checkbox>*/}
            {/*      <Checkbox p={2}>Kimberly</Checkbox>*/}
            {/*      <Checkbox p={2}>Casey</Checkbox>*/}
            {/*    </MenuOptionGroup>*/}
            {/*  </MenuList>*/}
            {/*</Menu>*/}
            <ClientsPerPage/>
            <Input placeholder={"Search Clients"} onChange={handleInput}/>
          </HStack>
        </HStack>
        <Divider/>
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
                <Tr>
                  <Td>{item.name}</Td>
                  <Td>{item.territory}</Td>
                  <Td>{item.firstName} {item.lastName}</Td>
                  <Td>{item.status}</Td>
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
