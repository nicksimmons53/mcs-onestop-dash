import Head from "next/head";
import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0";
import Layout from "../components/layout";
import {Button, Card} from "semantic-ui-react";

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

      <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header>Clients</Card.Header>
          </Card.Content>
          <Link href={"/clients/dashboard"}>
            <Button basic>
              View
            </Button>
          </Link>
        </Card>
      </Card.Group>
    </Layout>
  );
}
