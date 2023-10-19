import React from "react";
import _, {parseInt} from "lodash";
import Layout from "../../../../components/layout";
import { useRouter } from 'next/router';
import TabHeader from "../../../../components/tabHeader";
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
} from "../../../../src/services/client";
import Loading from "../../../../components/loading";
import { FiMenu } from "react-icons/fi";
import s3 from "../../../../lib/s3";
import { useSelector } from "react-redux";
import { questions, statusColors, tableHeaders } from "../../../../src/lib/constants";
import CustomTable from "../../../../components/clients/customTable";
import {useGetSageClientQuery} from "../../../../src/services/sage";

export default function Client({ id }) {
  const user = useSelector(state => state.user);
  const sage = useGetSageClientQuery({ id: id });
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (sage.isLoading) return <Loading />;

  return (
    <Layout>
      <TabHeader title={sage.data.client.Name}/>

      <HStack justifyContent={"space-between"} my={2}>
        <HStack>
          <VStack alignItems={"flex-start"}>
            <Heading>{sage.data.client.Name}</Heading>

            <HStack>
              {/*<Tag*/}
              {/*  size={"md"}*/}
              {/*  variant={"solid"}*/}
              {/*  backgroundColor={"#1C2833"}*/}
              {/*>*/}
              {/*  {data.basicInfo.salesRep}*/}
              {/*</Tag>*/}
              {/*<Tag*/}
              {/*  size={"md"}*/}
              {/*  variant={"solid"}*/}
              {/*  backgroundColor={statusColors[data.status.current]}*/}
              {/*>*/}
              {/*  {data.status.current}*/}
              {/*</Tag>*/}
              {/*{submittedAt !== "" && data.approvals !== undefined && (*/}
              {/*  <Tag*/}
              {/*    size={"md"}*/}
              {/*    variant={"solid"}*/}
              {/*    backgroundColor={"#33C4F7"}*/}
              {/*  >*/}
              {/*    Last Submitted At: {submittedAt}*/}
              {/*  </Tag>*/}
              {/*)}*/}
            </HStack>
          </VStack>
        </HStack>
      </HStack>

      <Divider/>

      <BasicInfo client={sage.data.client} />
    </Layout>
  );
}

const BasicInfo = ({ client }) => {
  return (
    <>
      {/*<CustomTable*/}
      {/*  title={"Addresses"}*/}
      {/*  headerRow={["Type", "Address", "City", "State", "Zip"]}*/}
      {/*  data={data.addresses}*/}
      {/*  cellKeys={["type", "address", "city", "state", "zip"]}*/}
      {/*  key={"type"}*/}
      {/*/>*/}

      <CustomTable
        title={"Contacts"}
        headerRow={["Name", "Phone", "Email"]}
        data={client.contacts}
        cellKeys={["Name", "Phone", "Email"]}
        key={"name"}
      />
    </>
  );
}

export async function getStaticPaths() {
  const res = await fetch("https://onboard.mcsurfacesinc.com/admin/sage/clients?company=MCS%20-%20TESTING");
  const data = await res.json();

  let paths = data.clients.map((item) => ({
    params: {ObjectID: `${item.ObjectID}`}
  }));

  return {paths, fallback: "blocking"};
}

export async function getStaticProps({params}) {
  return {
    props: {id: parseInt(params.ObjectID)},
    revalidate: 10,
  };
}
