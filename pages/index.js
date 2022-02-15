import Head from "next/head";
import {useUser} from "@auth0/nextjs-auth0";
import Layout from "../components/layout";

export default function Home() {
  const { user, isLoading, error } = useUser();

  if (isLoading) return <div>...Loading</div>;
  if (error) return <div>...ERROR</div>;
  if (!user) window.location.href = "/api/auth/login";

  return user && (
    <Layout>
      <Head>
        <title>MCS | Dashboard</title>
      </Head>
    </Layout>
  );
}
