import React from "react";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import { Grid, Pagination, Search, Table } from "semantic-ui-react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";

// @refresh reset
export default function Dashboard( )  {
  const router = useRouter();
  const [ clients, setClients ] = React.useState(null);
  const [ loading, setLoading ] = React.useState(false);
  const [ results, setResults ] = React.useState([]);
  const [ shownClients, setShownClients ] = React.useState(null);

  React.useEffect(( ) => {
    setLoading(true);
    fetch("https://onboard.mcsurfacesinc.com/admin/clients")
      .then((res) => res.json( ))
      .then((data) => {
        setClients(data.clients);
        setShownClients(data.clients.slice(0, 10));
        setLoading(false);
      })
  }, [ ]);

  const handlePageChange = (e, { activePage }) => {
    setShownClients(clients.slice(activePage * 10 - 10, activePage * 10));
  }

  const handleSearchChange = React.useCallback((e, data) => {
    const re = new RegExp(_.escapeRegExp(data.value), 'i')
    const isMatch = (result) => re.test(result.name)

    let matches = _.filter(clients, isMatch);
    let results = [];
    matches.forEach((match) => {
      results.push({ title: match.name, id: match.clientId });
    });

    setResults(results.slice(0, 10));
  }, [ clients ]);

  return (
    <Layout>
      <Head>
        <title>MCS | Clients</title>
      </Head>

      <Grid.Row columns={1} stretched>
        <Grid.Column computer={10} largeScreen={8} mobile={16} tablet={10} widescreen={8}>
          <Table selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={'1'}>
                  Client Module
                </Table.HeaderCell>
                <Table.HeaderCell colSpan={'3'}>
                  <Search
                    aligned={"right"}
                    placeholder={"Search Clients"}
                    onResultSelect={(e, data) => router.push(`/clients/${data.result.id}`)}
                    onSearchChange={handleSearchChange}
                    results={results}
                  />
                </Table.HeaderCell>
              </Table.Row>

              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Territory</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Sales Rep.</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            { clients !== null && clients !== undefined &&
              <>
                <Table.Body>
                  { shownClients !== null && shownClients.map((client, index) => (
                    <Link href={`/clients/${client.clientId}`} key={index}>
                      <Table.Row
                        warning={client.status === "Queued"}
                        error={client.status === "Declined"}
                        positive={client.status === "Approved"}
                      >
                        <Table.Cell singleLine>{ client.name }</Table.Cell>
                        <Table.Cell singleLine>{ client.territory }</Table.Cell>
                        <Table.Cell>{ client.status }</Table.Cell>
                        <Table.Cell singleLine>{ client.firstName } { client.lastName }</Table.Cell>
                      </Table.Row>
                    </Link>
                  ))}
                </Table.Body>

                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan={'4'}>
                      <Pagination
                        defaultActivePage={1}
                        onPageChange={handlePageChange}
                        totalPages={Math.ceil(clients.length/10)}
                      />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </>
            }
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Layout>
  )
}