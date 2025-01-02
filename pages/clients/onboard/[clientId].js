import React from "react";
import _ from "lodash";
import Layout from "../../../components/layout";
import {useRouter} from 'next/router';
import TabHeader from "../../../components/tabHeader";
import {
  Divider,
  Heading,
  HStack,
  Menu,
  Tab,
  TabList,
  Tabs,
  MenuButton,
  IconButton,
  MenuList,
  useColorModeValue,
  MenuItem,
  useToast,
  VStack,
  Tag,
  Center,
  Text,
  Select,
} from "@chakra-ui/react";
import {
  useGetClientBillingPartsQuery,
  useGetClientByIdQuery,
  useGetClientDetailsQuery,
  useGetClientProgramInfoQuery,
  useGetFilesQuery,
  useUpdateUserApprovalMutation,
} from "../../../src/services/client";
import Loading from "../../../components/loading";
import {FiMenu} from "react-icons/fi";
import {useSelector} from "react-redux";
import {questions, statusColors, tableHeaders} from "../../../src/lib/constants";
import CustomTable from "../../../components/clients/customTable";
import {useUser} from "@auth0/nextjs-auth0";

export default function Client({id}) {
  const authUser = useUser();
  const user = useSelector(state => state.user);
  const {data, error, isLoading} = useGetClientByIdQuery({id: id});
  const router = useRouter();
  const [folderId, setFolderId] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState("Basic Information");
  const [submittedAt, setSubmittedAt] = React.useState("");
  const [updateStatus, result] = useUpdateUserApprovalMutation();
  const details = useGetClientDetailsQuery({id: id});
  const programs = useGetClientProgramInfoQuery({id: id});
  const pricing = useGetClientBillingPartsQuery({id: id});

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

  React.useEffect(() => {
    if (data) {
      setSubmittedAt(new Date(data.approvals?.lastSubmittedAt).toLocaleDateString("UTC", {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }));

      setFolderId(data.folder.sharepointId);
    }
  }, [data]);

  const handleTabChange = index => {
    setActiveTab(tabs[index]);
  }

  const handleStatusChange = (decision) => {
    updateStatus({
      id: id,
      body: {
        user: authUser.user.email.split("@")[0],
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

  if (router.isFallback) return <Loading/>;

  if (isLoading || details.isLoading || programs.isLoading) return <Loading/>;

  return (
    <Layout>
      <TabHeader title={data.basicInfo.name}/>

      <HStack justifyContent={"space-between"} my={2}>
        <HStack>
          <VStack alignItems={"flex-start"}>
            <Heading>{data.basicInfo.name}</Heading>

            <HStack>
              <Tag
                size={"md"}
                variant={"solid"}
                backgroundColor={"#1C2833"}
              >
                {data.basicInfo.salesRep}
              </Tag>
              <Tag
                size={"md"}
                variant={"solid"}
                backgroundColor={statusColors[data.status.current]}
              >
                {data.status.current}
              </Tag>
              {submittedAt !== "" && data.approvals !== undefined && (
                <Tag
                  size={"md"}
                  variant={"solid"}
                  backgroundColor={"#33C4F7"}
                >
                  Last Submitted At: {submittedAt}
                </Tag>
              )}
            </HStack>
          </VStack>
        </HStack>

        <HStack>
          <Menu>
            <MenuButton
              transition="all 0.3s"
              _focus={{boxShadow: 'none'}}>
              <IconButton
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu/>}
              />
            </MenuButton>
            <MenuList
              bg={bgColor}
              borderColor={borderColor}>
              <MenuItem>Message Sales Rep.</MenuItem>
              <Divider/>
              <MenuItem
                isDisabled={data.status.current !== "Queued" && data.status.current !== "Potential"}
                onClick={() => handleStatusChange(1)}>
                Approve
              </MenuItem>
              <MenuItem
                isDisabled={data.status.current !== "Queued" && data.status.current !== "Potential"}
                onClick={() => handleStatusChange(0)}>
                Decline
              </MenuItem>
              <Divider/>
              <MenuItem>Cancel</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>

      <Divider/>

      <Tabs isFitted onChange={handleTabChange}>
        <TabList my={10}>
          {tabs.map(tab => <Tab key={tab}>{tab}</Tab>)}
        </TabList>

        {activeTab === "Basic Information" && <BasicInfo data={data}/>}
        {activeTab === "Accounting Details" &&
          <Details data={details.data.accounting} questions={questions.accounting}/>}
        {activeTab === "Expediting Details" &&
          <Details data={details.data.expediting} questions={questions.expediting}/>}
        {activeTab === "Program Details" && <ProgramDetails data={programs.data} selections={data.selections}/>}
        {activeTab === "Billing Parts" && <PricingBreakdown data={pricing.data}/>}
      </Tabs>
    </Layout>
  );
}

const BasicInfo = ({data}) => {
  const [folderId, setFolderId] = React.useState(data.folder.sharepointId);
  const files = useGetFilesQuery({folderId: folderId});
  const [formattedFiles, setFormattedFiles] = React.useState([]);
  const [filePath, setFilePath] = React.useState([]);

  React.useEffect(() => {
    if (files.currentData) {
      setFormattedFiles(files.currentData.map(file => ({
        ...file,
        size: `${(file["size"] / (1024 * 1024)).toFixed(2)} MBs`,
        createdtime: new Date(file["createdDateTime"]).toLocaleString(),
        createdby: file["createdBy"].user.displayName,
        viewFile: file.hasOwnProperty("file") ? webURL => viewFile(webURL) : null,
        navigateToFolder: file.hasOwnProperty("folder") ? (destID) => navigateToFolder(destID) : null,
      })));
    }
  }, [files, setFormattedFiles]);

  const navigateToFolder = (destID) => {
    if (filePath.includes(destID)) {
      setFilePath(filePath.filter(x => x !== destID));
      setFolderId(filePath[filePath.length - 2]);
    } else {
      setFilePath(prevFilePath => [...prevFilePath, destID]);
      setFolderId(destID);
    }
  }

  const viewFile = async (event) => {
  }

  console.log(data.approvals);

  return (
    <>
      <CustomTable
        title={"Addresses"}
        headerRow={["Type", "Address", "City", "State", "Zip"]}
        data={data.addresses}
        cellKeys={["type", "address", "city", "state", "zip"]}
        key={"type"}
      />

      <CustomTable
        title={"Contacts"}
        headerRow={["Name", "Title", "Phone", "Email"]}
        data={data.contacts}
        cellKeys={["name", "title", "phone", "email"]}
        key={"name"}
      />

      {/*<CustomTable*/}
      {/*  title={"Files"}*/}
      {/*  headerRow={["Name", "Type", "Size", "Date Uploaded", ""]}*/}
      {/*  data={files !== undefined && files.map((file, index) => ({*/}
      {/*    name: file.Key.split("/")[1],*/}
      {/*    type: file.Key.split(".")[1],*/}
      {/*    size: `${(file.Size / 1000000).toFixed(2)} MBs`,*/}
      {/*    uploaded: new Date(file.lastModified).toLocaleDateString("UTC", {*/}
      {/*      year: "numeric",*/}
      {/*      month: "numeric",*/}
      {/*      day: "numeric",*/}
      {/*      hour: "numeric",*/}
      {/*      minute: "numeric"*/}
      {/*    }),*/}
      {/*    button: (*/}
      {/*      <Button colorScheme={"blue"} size={"sm"} onClick={viewFile} value={JSON.stringify(file)}>*/}
      {/*        Download*/}
      {/*      </Button>*/}
      {/*    )*/}
      {/*  }))}*/}
      {/*  cellKeys={["type", "address", "city", "state", "zip"]}*/}
      {/*  key={"type"}*/}
      {/*/>*/}

      <CustomTable
        title={"Programs"}
        headerRow={["Selections"]}
        data={data.programs !== undefined && Object.keys(data.programs).filter(item => data.programs[item]).map((item, index) => ({
          selection: item
        }))}
        cellKeys={["selection"]}
        key={"selection"}
      />

      {/*<TableContainer borderWidth={"1px"} borderRadius={5} m={5}>*/}
      {/*  <HStack justifyContent={"space-between"} p={3}>*/}
      {/*    <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>Programs</Text>*/}
      {/*  </HStack>*/}
      {/*  <Divider/>*/}
      {/*  <Table variant={"simple"}>*/}
      {/*    <Thead>*/}
      {/*      <Tr>*/}
      {/*        <Th>Selections</Th>*/}
      {/*      </Tr>*/}
      {/*    </Thead>*/}
      {/*    <Tbody>*/}
      {/*      {data.programs !== undefined && data.programs.filter(item => data.programs[item] === 1).map(item => (*/}
      {/*        <Td key={item}>{item}</Td>*/}
      {/*      ))}*/}
      {/*    </Tbody>*/}
      {/*  </Table>*/}
      {/*</TableContainer>*/}

      {data.status.current !== "Potential" && (
        <CustomTable
          title={"Approvals"}
          headerRow={["Manager", "Response"]}
          data={Object.keys(data.approvals).filter(x => x !== "lastSubmittedAt").map((item, index) => ({
            name: item,
            decision: item.decision || "No Decision"
          }))}
          cellKeys={["name", "decision"]}
          key={"name"}
        />
      )}

      {/*<CustomTable*/}
      {/*  title={"Files"}*/}
      {/*  headerRow={["Name", "Size", "Created By", "Created Time"]}*/}
      {/*  data={formattedFiles}*/}
      {/*  cellKeys={["name", "size", "createdby", "createdtime"]}*/}
      {/*  key={"id"}*/}
      {/*  fileTable={true}*/}
      {/*/>*/}
    </>
  );
}

const Details = ({questions, data}) => {
  if (data === undefined) {
    return (
      <Center>
        <Text style={{color: "red"}}>
          This is an error. Please contact system administration for help.
        </Text>
      </Center>
    );
  }

  let values = Object.values(data);
  return (
    <CustomTable
      title={"Information"}
      headerRow={["Question", "Response"]}
      data={questions.map((question, index) => ({
        question: question,
        response: values[index] === 0 ? "No" : values[index] === 1 ? "Yes" : values[index]
      }))}
      cellKeys={["question", "response"]}
      key={"question"}
    />
  );
}

const ProgramDetails = ({selections, data}) => {
  const [program, setProgram] = React.useState(null);

  const handleChange = e => {
    const value = e.target.value;

    if (value === "wood" || value === "vinyl") {
      setProgram("woodVinyl");
    } else {
      setProgram(value.toLowerCase());
    }
  }

  return (
    <CustomTable
      title={"Information"}
      headerRow={["Question", "Response"]}
      data={program !== null && data.programs[program] !== undefined && Object.values(data.programs[program]).map((value, index) => ({
        question: questions[program][index],
        response: value === 1 ? "Yes" : value === 0 ? "No" : value
      }))}
      cellKeys={["name", "title", "phone", "email"]}
      key={"name"}
      dropdownHeader={true}
      dropdownPlaceholder={"Select a Program"}
      dropdownOptions={Object.keys(selections).filter(program => selections[program] === 1).map(program => program[0].toUpperCase() + program.slice(1))}
      dropdownAction={handleChange}
    />
  )
}

const PricingBreakdown = ({data}) => {
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
    <div>
      <Select m={5} onChange={handleChange} placeholder={"Select Program"} w={"25%"}>
        <option>Flooring</option>
        <option>Countertops</option>
      </Select>

      {Object.keys(tables).slice(0, numOfTables / 3).map((table, index) => (
        <CustomTable
          title={table}
          headerRow={["Description", "Unit", "Billing Amount"]}
          data={tables[table].map(part => ({
            description: part.Description,
            unit: part.Unit,
            billingAmount: part.BillingAmount
          }))}
          cellKeys={["Description", "Unit", "BillingAmount"]}
          key={"description"}
        />
      ))}

      {Object.keys(tables).slice(0, numOfTables * (2 / 3)).map((table, index) => (
        <CustomTable
          title={table}
          headerRow={["Description", "Unit", "Billing Amount"]}
          data={tables[table].map(part => ({
            description: part.Description,
            unit: part.Unit,
            billingAmount: part.BillingAmount
          }))}
          cellKeys={["description", "unit", "billingAmount"]}
          key={"description"}
        />
      ))}

      {Object.keys(tables).slice(numOfTables * (2 / 3)).map((table, index) => (
        <CustomTable
          title={table}
          headerRow={["Description", "Unit", "Billing Amount"]}
          data={tables[table].map(part => ({
            description: part.Description,
            unit: part.Unit,
            billingAmount: part.BillingAmount
          }))}
          cellKeys={["description", "unit", "billingAmount"]}
          key={"description"}
        />
      ))}
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch("https://onboard.mcsurfacesinc.com/admin/clients/onboard");
  const data = await res.json();

  const paths = data.clients.map((item) => ({
    params: {clientId: `${item.clientId}`}
  }));

  return {paths, fallback: "blocking"};
}

export async function getStaticProps({params}) {
  return {
    props: {id: params.clientId},
    revalidate: 10,
  };
}
