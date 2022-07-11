import Head from "next/head";
import {
  Dropdown,
  Grid,
} from "semantic-ui-react";
import React from "react";
import _ from "lodash";
import Layout from "../../components/layout";
import {useUser} from "@auth0/nextjs-auth0";
import {
  Divider,
  Heading,
  HStack,
  Menu,
  Tab,
  TableContainer,
  Table,
  TabList,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Box,
  MenuButton,
  IconButton,
  MenuList,
  useColorModeValue,
  CheckboxGroup,
  MenuOptionGroup,
  Checkbox,
  Container,
  MenuItem, TabPanel, TabPanels, Select, useToast
} from "@chakra-ui/react";
import {
  useGetClientAccountingDetailsQuery, useGetClientBillingPartsQuery,
  useGetClientByIdQuery,
  useGetClientDetailsQuery, useGetClientProgramInfoQuery, useUpdateClientStatusMutation, useUpdateUserApprovalMutation
} from "../../src/services/client";
import Loading from "../../components/loading";
import Link from "next/link";
import {FiBarChart, FiMenu} from "react-icons/fi";

const tableHeaders = {
  addresses: [ "Type", "Street Address", "City", "State", "Zip" ],
  contacts: [ "Name", "Title", "Phone", "Email" ],
  files: [ ],
  programs: [ "Chosen Selections" ],
  approvals: [ ]
};

const questions = {
  accounting: [
    "Payment Frequency",
    "Autopay",
    "Email for Submitting Invoices",
    "Payment Type",
    "Payment Portal",
    "Portal URL",
    "PO's Required?",
    "PO's Required for Invoices?",
    "Approval's Required?",
    "Have you attached the contract?",
    "Contact Name",
    "Contact Phone",
    "Contact Email",
    "Notes",
  ],
  cabinets: [
    "Preferred Colors",
    "Preferred Style",
    "Overlay",
    "Preferences on Crown",
    "Bid Type Preferences",
    "Upper Cabinet Standard Specs.",
    "Vanity Height Standard Specs.",
    "Is Soft Close Standard?",
    "Any Areas Optioned Out?",
    "Notes"
  ],
  carpet: [
    "Preferred Padding Brand",
    "Who Will be Doing Takeoffs?",
    "Waste Factor Percentage",
    "Notes"
  ],
  countertops: [
    "Preferred Material Thickness",
    "Preferred Edge",
    "Waterfall Sides - Standard or Option?",
    "Faucet Holes?",
    "Stove Range Specifications",
    "Who Will be Doing Takeoffs?",
    "Waste Factor Percentage",
    "Notes"
  ],
  expediting: [
    "Is there a vendor portal?",
    "Vendor Portal URL",
    "Has the Vendor Portal Account been created?",
    "Portal Username",
    "Portal Password",
    "How are jobs released?",
    "PO Correction Handling?",
    "Estimated Number of Homes per Year",
    "Estimated Start Date",
    "Is the client using the In-House Program?",
    "Notes"
  ],
  tile: [
    "Floor Setting Material",
    "Floor Custom Setting Material",
    "Wall Setting Material",
    "Wall Custom Setting Material",
    "Alotted Float",
    "Charge for Extra Float",
    "Waterproofing Method",
    "Waterproofing Method - Shower Floor",
    "Waterproofing Method - Shower Walls",
    "Waterproofing Method - Tub Wall",
    "Who is installing fiberglass?",
    "Will we be installing backerboard?",
    "Punch Out Material",
    "Shower Niche Construction",
    "Shower Niche Framing",
    "Preformed Shower Niche Brand",
    "Are Corner Soap Dishes Standard?",
    "Corner Soap Dish Material",
    "Shower Seat Construction",
    "Metal Edge Options",
    "Grout Joint Sizing",
    "Grout Joint Notes",
    "Preferred Grout Brand",
    "Upgraded Grout and Formula",
    "Grout Product",
    "Subfloor Std. Practice",
    "Subfloor Products",
    "Wall Tile Height Standard",
    "Who Will be Doing Takeoffs?",
    "Waste Factor Percentage",
    "Waste Factor Percentage - Walls",
    "Waste Factor Percentage - Floors",
    "Waste Factor Percentage - Mosaics",
    "Notes"
  ],
  woodVinyl: [
    "Preferred Glue Products",
    "Other Glue Product",
    "Stain or Primed?",
    "Are Transition Strips Standard Practice?",
    "HVAC Requirement?",
    "MC Surfaces Install Wood Trim?",
    "2nd Story Subfloor Construction",
    "Who Will be Doing Takeoffs?",
    "Waste Factor Percentage",
    "Notes"
  ]
};

export default function Client({ id }) {
  const { user } = useUser();
  const { data, error, isLoading } = useGetClientByIdQuery({ id: id });
  const [updateStatus, result] = useUpdateUserApprovalMutation();
  const details = useGetClientDetailsQuery({ id: id });
  const programs = useGetClientProgramInfoQuery({ id: id });
  const pricing = useGetClientBillingPartsQuery({ id: id });
  const [activeTab, setActiveTab] = React.useState("Basic Information");
  const [setToast, setShowToast] = React.useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const tabs = [
    "Basic Information",
    "Accounting Details",
    "Expediting Details",
    "Program Details",
    "Billing Parts",
  ];

  const handleTabChange = index => {
    setActiveTab(tabs[index]);
  }

  const handleStatusChange = (decision) => {
    updateStatus({
      id: id,
      body: {
        user: user.email.split("@")[0],
        decision: decision,
      }
    })
      .unwrap()
      .then(res => {
        toast({
          title: "Client Approval Updated Successfully",
          status: "success",
          isClosable: true,
          variant: "left-accent",
          position: "bottom-right",
        })
      });
  }

  if (isLoading || details.isLoading || programs.isLoading) return <Loading/>;

  return (
    <Layout>
      <Head>
        <title>MCS | {data.basicInfo.name}</title>
      </Head>

      <HStack justifyContent={"space-between"} my={2}>
        <Heading>{data.basicInfo.name}</Heading>

        <Menu>
          <MenuButton
            py={2}
            transition="all 0.3s"
            _focus={{ boxShadow: 'none' }}>
            <IconButton
              variant="outline"
              aria-label="open menu"
              icon={<FiMenu />}
            />
          </MenuButton>
          <MenuList
            bg={bgColor}
            borderColor={borderColor}>
            <MenuItem isDisabled={data.status.current !== "Queued"} onClick={() => handleStatusChange(1)}>Approve</MenuItem>
            <MenuItem isDisabled={data.status.current !== "Queued"} onClick={() => handleStatusChange(0)}>Decline</MenuItem>
            <Divider/>
            <MenuItem>Cancel</MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <Divider/>

      <Tabs isFitted onChange={handleTabChange}>
        <TabList my={10}>
          {tabs.map(tab => <Tab key={tab}>{ tab }</Tab>)}
        </TabList>

        { activeTab === "Basic Information" && <BasicInfo data={data} files={null}/> }
        { activeTab === "Accounting Details" && <Details data={details.data.accounting} questions={questions.accounting}/> }
        { activeTab === "Expediting Details" && <Details data={details.data.expediting} questions={questions.expediting}/> }
        { activeTab === "Program Details" && <ProgramDetails data={programs.data} selections={data.selections}/> }
        { activeTab === "Billing Parts" && <PricingBreakdown data={pricing.data}/> }
      </Tabs>
    </Layout>
  );
}

const BasicInfo = ({ data, files }) => {
  return (
    <>
      <TableContainer borderWidth={"1px"} borderRadius={5} m={5}>
        <HStack justifyContent={"space-between"} p={3}>
          <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>Addresses</Text>
        </HStack>
        <Divider/>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>Address</Th>
              <Th>City</Th>
              <Th>State</Th>
              <Th>Zip</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.addresses.map(item => (
              <Tr key={item.type}>
                <Td>{item.type}</Td>
                <Td>{item.address}</Td>
                <Td>{item.city}</Td>
                <Td>{item.state}</Td>
                <Td>{item.zip}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <TableContainer borderWidth={"1px"} borderRadius={5} m={5}>
        <HStack justifyContent={"space-between"} p={3}>
          <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>Contacts</Text>
        </HStack>
        <Divider/>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Title</Th>
              <Th>Phone</Th>
              <Th>Email</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.contacts.map(item => (
              <Tr key={item.name}>
                <Td>{item.name}</Td>
                <Td>{item.title}</Td>
                <Td>{item.phone}</Td>
                <Td>{item.email}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <HStack alignItems={"flex-start"} spacing={"10px"} m={5}>
        <TableContainer borderWidth={"1px"} borderRadius={5}>
          <HStack justifyContent={"space-between"} p={3}>
            <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>Programs</Text>
          </HStack>
          <Divider/>
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>Selections</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(data.programs).filter(item => data.programs[item]).map(selection => (
                <Tr key={selection}>
                  <Td>{selection}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <TableContainer borderWidth={"1px"} borderRadius={5} m={5}>
          <HStack justifyContent={"space-between"} p={3}>
            <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>Files</Text>
          </HStack>
          <Divider/>
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Type</Th>
                <Th>Size</Th>
              </Tr>
            </Thead>
            <Tbody>
            </Tbody>
          </Table>
        </TableContainer>

        <TableContainer borderWidth={"1px"} borderRadius={5} m={5}>
          <HStack justifyContent={"space-between"} p={3}>
            <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>Approvals</Text>
          </HStack>
          <Divider/>
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>Manager</Th>
                <Th>Response</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(data.approvals).map(manager => (
                <Tr key={manager}>
                  <Td>{manager}</Td>
                  <Td>{data.approvals[manager] === 1 ? "Approved" : data.approvals[manager] === 0 ? "Declined" : "No Response"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </HStack>
    </>
  );
}

const Details = ({ questions, data }) => {
  let values = Object.values(data);

  return (
    <>
      <TableContainer borderWidth={"1px"} borderRadius={5} m={5}>
        <HStack justifyContent={"space-between"} p={3}>
          <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>Information</Text>
        </HStack>
        <Divider/>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th>Question</Th>
              <Th>Response</Th>
            </Tr>
          </Thead>
          <Tbody>
            {questions.map((question, index) => (
              <Tr key={question}>
                <Td>{question}</Td>
                <Td>{values[index] === 1 ? "Yes" : values[index] === 0 ? "No" : values[index]}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

const ProgramDetails = ({ selections, data }) => {
  const [ program, setProgram ] = React.useState(null);

  const handleChange = e => {
    const value = e.target.value;

    if (value === "wood" || value === "vinyl") {
      setProgram("woodVinyl");
    } else {
      setProgram(value.toLowerCase());
    }
  }

  return (
    <>
      <TableContainer borderWidth={"1px"} borderRadius={5} m={5}>
        <HStack justifyContent={"space-between"} p={3}>
          <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>Information</Text>
          <Select onChange={handleChange} placeholder={"Select Program"} width={"10%"}>
            {Object.keys(selections).filter(program => selections[program] === 1).map(program => (
              <option key={program}>{program[0].toUpperCase() + program.slice(1)}</option>
            ))}
          </Select>
        </HStack>
        <Divider/>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th>Question</Th>
              <Th>Response</Th>
            </Tr>
          </Thead>
          <Tbody>
            {program !== null && data.programs[program] !== undefined && Object.values(data.programs[program]).map((value, index) => (
              <Tr key={index}>
                <Td>{ questions[program][index] }</Td>
                <Td>{value === 1 ? "Yes" : value === 0 ? "No" : value}</Td>
              </Tr>
            ))}
            {program === null ? <Tr><Td>No Program Selected</Td><Td/></Tr> : data.programs[program] === undefined && <Tr><Td>No Data Present</Td><Td/></Tr>}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

const PricingBreakdown = ({ data }) => {
  const [dept, setDept] = React.useState(null);
  let programs;

  if (dept === "") {
    programs = [];
  } else if (dept === "Countertops") {
    programs = [...data.parts.countertops];
  } else if (dept === "Flooring") {
    programs = [...data.parts.carpet, ...data.parts.tile, ...data.parts.vinyl, ...data.parts.wood];
  }

  let tables = _.mapValues(_.groupBy(programs, "programTable"), tList => tList.map(table => _.omit(table, "programTable")));
  let numOfTables = Object.keys(tables).length;

  const handleChange = e => {
    setDept(e.target.value);
  }

  return (
    <>
      <Select m={5} onChange={handleChange} placeholder={"Select Program"} w={"25%"}>
        <option>Flooring</option>
        <option>Countertops</option>
      </Select>

      {Object.keys(tables).slice(0, numOfTables/3).map((table, index) => (
        <TableContainer borderWidth={"1px"} borderRadius={5} key={table} m={5}>
          <HStack justifyContent={"space-between"} p={3}>
            <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>{table}</Text>
          </HStack>
          <Divider/>
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th>Unit</Th>
                <Th textAlign={"right"}>Billing Amount</Th>
              </Tr>
            </Thead>

            { tables[table].length === 0 || tables[table] === undefined ?
              <Tbody>
                <Tr>
                  <Td>No Data Present</Td>
                </Tr>
              </Tbody>
              :
              <Tbody>
                { tables[table].map((part, index) => (
                  <Tr key={index}>
                    <Td>{ part.Description }</Td>
                    <Td>{ part.Unit }</Td>
                    <Td textAlign={"right"}>{ parseFloat(part.BillingAmount).toFixed(2) }</Td>
                  </Tr>
                ))}
              </Tbody>
            }
          </Table>
        </TableContainer>
      ))}

      {Object.keys(tables).slice(0, numOfTables*(2/3)).map((table, index) => (
        <TableContainer borderWidth={"1px"} borderRadius={5} key={table} m={5}>
          <HStack justifyContent={"space-between"} p={3}>
            <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>{table}</Text>
          </HStack>
          <Divider/>
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th>Unit</Th>
                <Th textAlign={"right"}>Billing Amount</Th>
              </Tr>
            </Thead>

            { tables[table].length === 0 || tables[table] === undefined ?
              <Tbody>
                <Tr>
                  <Td>No Data Present</Td>
                </Tr>
              </Tbody>
              :
              <Tbody>
                { tables[table].map((part, index) => (
                  <Tr key={index}>
                    <Td>{ part.Description }</Td>
                    <Td>{ part.Unit }</Td>
                    <Td textAlign={"right"}>{ parseFloat(part.BillingAmount).toFixed(2) }</Td>
                  </Tr>
                ))}
              </Tbody>
            }
          </Table>
        </TableContainer>
      ))}

      {Object.keys(tables).slice(numOfTables*(2/3)).map((table, index) => (
        <TableContainer borderWidth={"1px"} borderRadius={5} key={table} m={5}>
          <HStack justifyContent={"space-between"} p={3}>
            <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>{table}</Text>
          </HStack>
          <Divider/>
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>Description</Th>
                <Th>Unit</Th>
                <Th textAlign={"right"}>Billing Amount</Th>
              </Tr>
            </Thead>

            { tables[table].length === 0 || tables[table] === undefined ?
              <Tbody>
                <Tr>
                  <Td>No Data Present</Td>
                </Tr>
              </Tbody>
              :
              <Tbody>
                { tables[table].map((part, index) => (
                  <Tr key={index}>
                    <Td>{ part.Description }</Td>
                    <Td>{ part.Unit }</Td>
                    <Td textAlign={"right"}>{ parseFloat(part.BillingAmount).toFixed(2) }</Td>
                  </Tr>
                ))}
              </Tbody>
            }
          </Table>
        </TableContainer>
      ))}
    </>
  )
}

export async function getStaticPaths() {
  const res = await fetch("https://onboard.mcsurfacesinc.com/admin/clients");
  const data = await res.json( );

  const paths = data.clients.map((item) => ({
    params: { clientId: `${item.clientId}` }
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  return {
    props: { id: params.clientId },
  };
}
