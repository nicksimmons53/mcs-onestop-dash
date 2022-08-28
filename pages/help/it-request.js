import React from "react";
import Layout from "../../components/layout";
import {Box} from "@chakra-ui/react";
import Head from "next/head";

export default function ItRequest() {
  return (
      <Layout>
          <Head>
              <title>MCS | IT Request</title>
              <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
              <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
              <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
              <link rel="manifest" href="/site.webmanifest"/>
              <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000"/>
              <meta name="msapplication-TileColor" content="#cad3d5"/>
              <meta name="theme-color" content="#ffffff"/>
          </Head>

          <Box alignItems={"center"} justifyContent={"center"} borderRadius={10} borderWidth={1} padding={5}>
              <iframe
                  className="airtable-embed"
                  src="https://airtable.com/embed/shrV6EJrRaOi3A0P0?backgroundColor=gray"
                  style={{ borderRadius: 10, height: 650, width: "100%" }}
              >
              </iframe>
          </Box>
      </Layout>
  )
}
