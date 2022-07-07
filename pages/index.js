import Head from "next/head";
import Link from "next/link";
import Error from "next/error";
import {useUser} from "@auth0/nextjs-auth0";
import Layout from "../components/layout";
import Loading from "../components/loading";
import {Box, Button, Divider, Heading, Stack} from "@chakra-ui/react";

export default function Home() {
  const { user, isLoading, error } = useUser();

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if (!user) window.location.href = "/api/auth/login";

  return user && (
    <Layout>
      <Head>
        <title>MCS | Dashboard</title>
      </Head>

      <Stack alignContent={"flex-start"} direction={"row"}>
        <Box borderRadius={5} p={5} shadow='md' borderWidth='1px' width={"20%"}>
          <Heading size={"lg"}>Clients</Heading>
          <Divider/>
          <Link href={"/clients/dashboard"}>
            <Button colorScheme={"blue"} mt={5} width={"100%"}>View</Button>
          </Link>
        </Box>
      </Stack>
    </Layout>
  );
}
