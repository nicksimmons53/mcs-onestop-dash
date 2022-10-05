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
        <title>MCS | Home</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000"/>
        <meta name="msapplication-TileColor" content="#cad3d5"/>
        <meta name="theme-color" content="#ffffff"/>
      </Head>

      <SimpleGrid minChildWidth={200} spacing={"10px"}>
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
        {/*  <Link href={"/employees/add-user"}>*/}
        {/*    <Button colorScheme={"blue"} mt={5} width={"100%"}>View</Button>*/}
        {/*  </Link>*/}
        {/*</Box>*/}
      </SimpleGrid>
    </Layout>
  );
}
