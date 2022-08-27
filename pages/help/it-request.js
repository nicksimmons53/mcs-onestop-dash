import React from "react";
import Layout from "../../components/layout";
import {Box} from "@chakra-ui/react";

export default function ItRequest() {
  return (
      <Layout>
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
