import React from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import {Heading, Input, Select} from "@chakra-ui/react";

export default function AddUser( )  {
    return (
        <Layout>
            <Head>
                <title>MCS | Add User</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000"/>
                <meta name="msapplication-TileColor" content="#cad3d5"/>
                <meta name="theme-color" content="#ffffff"/>
            </Head>

            <Heading as={"h3"}>Add Employee</Heading>
            <Input placeholder={"First Name"} />
            <Input placeholder={"Middle Initial"} />
            <Input placeholder={"Last Name"} />
            <Input placeholder={"Phone Number"} />
            <Select placeholder={"Branch"}>
                <option value={"Austin"}>Austin</option>
                <option value={"Dallas"}>Dallas</option>
                <option value={"Houston"}>Houston</option>
                <option value={"San Antonio"}>San Antonio</option>
            </Select>
            <Select placeholder={"Department"}>
                <option value={"Expediting"}>Expediting</option>
                <option value={"Field"}>Field</option>
                <option value={"Sales"}>Sales</option>
                <option value={"Warranty"}>Warranty</option>
            </Select>
        </Layout>
    )
}