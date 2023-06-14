import {Divider, HStack, TableContainer, Table, Tbody, Td, Text, Th, Thead, Tr, Select} from "@chakra-ui/react";
import React from "react";

export default function CustomTable({title, headerRow, data, key, cellKeys, dropdownHeader, dropdownPlaceholder, dropdownOptions, dropdownAction }) {
    return (
        <TableContainer borderWidth={"1px"} borderRadius={5} m={5}>
            <HStack justifyContent={"space-between"} p={3}>
                <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>{title}</Text>
                { dropdownHeader &&
                    <Select onChange={dropdownAction} placeholder={dropdownPlaceholder} width={"15%"}>
                        {dropdownOptions.map(option => (
                            <option key={option}>{option}</option>
                        ))}
                    </Select>
                }
            </HStack>
            <Divider/>
            <Table variant={"simple"}>
                <Thead>
                    <Tr>
                        {headerRow.map(column => (
                            <Th key={column}>{ column }</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data && true && data.map((item, index) => (
                        <Tr key={key}>
                            {Object.keys(item).map(cell => (
                                <Td key={item}>{item[cell]}</Td>
                            ))}
                        </Tr>
                    ))}

                    {!data &&
                        <Tr>
                            <Td>No Data Found</Td>
                        </Tr>
                    }

                    {data === undefined &&
                        <Tr>
                            <Td>No Data Found</Td>
                        </Tr>
                    }

                    {data.length === 0 &&
                        <Tr>
                            <Td>No Data Found</Td>
                        </Tr>
                    }
                </Tbody>
            </Table>
        </TableContainer>
    );
};