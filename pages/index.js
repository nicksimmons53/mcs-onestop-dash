import Head from "next/head";
import Link from "next/link";
import Error from "next/error";
import {useUser} from "@auth0/nextjs-auth0";
import Layout from "../components/layout";
import Loading from "../components/loading";
import {Box, Button, Divider, Heading, SimpleGrid, Stack} from "@chakra-ui/react";

export default function Home() {
  const { user, isLoading, error } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if (!user) window.location = "/api/auth/login";

  return user && (
    <Layout>
      <Head>
        <title>MCS | Dashboard</title>
      </Head>

      <SimpleGrid columns={[2, 2, 4]} minChildWidth={200} spacing={"20px"}>
        <Box borderRadius={5} p={5} shadow='md' borderWidth='1px'>
          <Heading size={"lg"}>Clients</Heading>
          <Divider/>
          <Link href={"/clients/dashboard"}>
            <Button colorScheme={"blue"} mt={5} width={"100%"}>View</Button>
          </Link>
        </Box>

        {/*<Box borderRadius={5} p={5} shadow='md' borderWidth='1px'>*/}
        {/*  <Heading size={"lg"}>Employees</Heading>*/}
        {/*  <Divider/>*/}
        {/*  <Link href={"/clients/dashboard"}>*/}
        {/*    <Button colorScheme={"blue"} mt={5} width={"100%"}>View</Button>*/}
        {/*  </Link>*/}
        {/*</Box>*/}
      </SimpleGrid>
    </Layout>
  );
}
