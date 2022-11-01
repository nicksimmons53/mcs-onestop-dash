import React from "react";
import _ from "lodash";
import Layout from "../../components/layout";
import { useRouter } from 'next/router';
import TabHeader from "../../components/tabHeader";
import {
    Button,
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
    Tag, Center, Text, Select,
} from "@chakra-ui/react";
import {
    useGetClientBillingPartsQuery,
    useGetClientByIdQuery,
    useGetClientDetailsQuery,
    useGetClientProgramInfoQuery,
    useUpdateUserApprovalMutation,
} from "../../src/services/client";
import Loading from "../../components/loading";
import { FiMenu } from "react-icons/fi";
import s3 from "../../lib/s3";
import { useSelector } from "react-redux";
import { questions, statusColors, tableHeaders } from "./lib/constants";
import Table from "./components/customTable";
import CustomTable from "./components/customTable";

export default function Client({id}) {
    const user = useSelector(state => state.user);
    const {data, error, isLoading} = useGetClientByIdQuery({id: id});
    const [files, setFiles] = React.useState([]);
    const router = useRouter();
    const [updateStatus, result] = useUpdateUserApprovalMutation();
    const details = useGetClientDetailsQuery({id: id});
    const programs = useGetClientProgramInfoQuery({id: id});
    const pricing = useGetClientBillingPartsQuery({id: id});
    const [activeTab, setActiveTab] = React.useState("Basic Information");
    const [submittedAt, setSubmittedAt] = React.useState("");

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
        const getFiles = async () => {
            setFiles(await s3.getFiles(
                {
                    sageUserId: data.basicInfo.sageUserId,
                    sageEmployeeNumber: data.basicInfo.sageEmployeeNumber
                },
                data.basicInfo.name
            ));
        }

        if (data) {
            getFiles();
            setSubmittedAt(new Date(data.approvals?.lastSubmittedAt).toLocaleDateString("UTC", {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            }));
        }
    }, [data]);

    const handleTabChange = index => {
        setActiveTab(tabs[index]);
    }

    const handleStatusChange = (decision) => {
        updateStatus({
            id: id,
            body: {
                user: user.info.email.split("@")[0],
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
                            <MenuItem isDisabled={data.status.current !== "Queued"}
                                      onClick={() => handleStatusChange(1)}>Approve</MenuItem>
                            <MenuItem isDisabled={data.status.current !== "Queued"}
                                      onClick={() => handleStatusChange(0)}>Decline</MenuItem>
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

                {activeTab === "Basic Information" && <BasicInfo data={data} files={files}/>}
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

const BasicInfo = ({data, files}) => {
    const viewFile = async (event) => {
        let file = JSON.parse(event.target.value);
        let fileUrl = await s3.viewObject(file);
        fetch(fileUrl).then(function (t) {
            return t.blob().then((b) => {
                    let a = document.createElement("a");
                    a.href = URL.createObjectURL(b);
                    a.setAttribute("download", file.Name);
                    a.click();
                }
            );
        });
    }

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

            <CustomTable
                title={"Files"}
                headerRow={["Name", "Type", "Size", "Date Uploaded"]}
                data={files !== undefined && files.map((file, index) => ({
                    name: file.Key.split("/")[1],
                    type: file.Key.split(".")[1],
                    size: `${(file.Size / 1000000).toFixed(2)} MBs`,
                    uploaded: new Date(file.lastModified).toLocaleDateString("UTC", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    }),
                    button: (
                        <Button colorScheme={"blue"} size={"sm"} onClick={viewFile} value={JSON.stringify(file)}>
                            Download
                        </Button>
                    )
                }))}
                cellKeys={["type", "address", "city", "state", "zip"]}
                key={"type"}
            />

            <CustomTable
                title={"Programs"}
                headerRow={["Selections"]}
                data={data.programs !== undefined && Object.keys(data.programs).filter(item => data.programs[item])}
                cellKeys={["selection"]}
                key={"selection"}
            />

            <CustomTable
                title={"Approvals"}
                headerRow={["Manager", "Response"]}
                data={data.approvals !== undefined && Object.keys(data.approvals).filter(field => field !== "lastSubmittedAt").map(manager => ({
                    manager: manager,
                    response: data.approvals[manager] === 1 ? "Approved" : data.approvals[manager] === 0 ? "Declined" : "No Response"
                }))}
                cellKeys={["manager", "response"]}
                key={"manager"}
            />
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
            data={questions.map((question, index) => ({ question: question, response: values[index] === 0 ? "No" : values[index] === 1 ? "Yes" : values[index] }))}
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
            data={ program !== null && data.programs[program] !== undefined && Object.values(data.programs[program]).map((value, index) => ({ question: questions[program][index], response: value === 1 ? "Yes" : value === 0 ? "No" : value }))}
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
                    data={tables[table].map(part => ({ description: part.Description, unit: part.Unit, billingAmount: part.BillingAmount.toFixed(2) }))}
                    cellKeys={["Description", "Unit", "BillingAmount"]}
                    key={"description"}
                />
            ))}

            {Object.keys(tables).slice(0, numOfTables * (2 / 3)).map((table, index) => (
                <CustomTable
                    title={table}
                    headerRow={["Description", "Unit", "Billing Amount"]}
                    data={tables[table].map(part => ({ description: part.Description, unit: part.Unit, billingAmount: part.BillingAmount.toFixed(2) }))}
                    cellKeys={["description", "unit", "billingAmount"]}
                    key={"description"}
                />
            ))}

            {Object.keys(tables).slice(numOfTables * (2 / 3)).map((table, index) => (
                <CustomTable
                    title={table}
                    headerRow={["Description", "Unit", "Billing Amount"]}
                    data={tables[table].map(part => ({ description: part.Description, unit: part.Unit, billingAmount: part.BillingAmount.toFixed(2) }))}
                    cellKeys={["description", "unit", "billingAmount"]}
                    key={"description"}
                />
            ))}
        </div>
    );
}

export async function getStaticPaths() {
    const res = await fetch("https://onboard.mcsurfacesinc.com/admin/clients");
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
