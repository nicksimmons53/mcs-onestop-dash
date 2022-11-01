import React from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import { Divider, Heading, Input, Select } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import TabHeader from "../../components/tabHeader";

export default function AddUser( )  {
    return (
        <Layout>
            <TabHeader title={"Add User"} />

            <Heading as={"h3"}>Add Employee</Heading>

            <Divider />

            <Input placeholder={"First Name"} my={2} />
            <Input placeholder={"Middle Initial"} my={2} />
            <Input placeholder={"Last Name"} my={2} />
            <Input placeholder={"Phone Number"} my={2} />
            <Select placeholder={"Branch"} mt={2}>
                <option value={"Austin"}>Austin</option>
                <option value={"Dallas"}>Dallas</option>
                <option value={"Houston"}>Houston</option>
                <option value={"San Antonio"}>San Antonio</option>
            </Select>
            <Select placeholder={"Department"} my={4}>
                <option value={"Expediting"}>Expediting</option>
                <option value={"Field"}>Field</option>
                <option value={"Sales"}>Sales</option>
                <option value={"Warranty"}>Warranty</option>
            </Select>
            <Select placeholder={"Sub-Department"} my={4}>
                <option value={"Expediting"}>Expediting</option>
                <option value={"Field"}>Field</option>
                <option value={"Sales"}>Sales</option>
                <option value={"Warranty"}>Warranty</option>
            </Select>
            <Select placeholder={"Administrator?"} my={4}>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
            </Select>
            <Input placeholder={"Sage Employee Number"} mb={2} />
        </Layout>
    )
}