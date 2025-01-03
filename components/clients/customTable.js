import {Divider, HStack, TableContainer, Table, Tbody, Td, Text, Th, Thead, Tr, Select} from "@chakra-ui/react";
import React from "react";
import {redirect} from "next/navigation";

export default function CustomTable({
  title,
  headerRow,
  data,
  key,
  cellKeys,
  dropdownHeader,
  dropdownPlaceholder,
  dropdownOptions,
  dropdownAction,
  fileTable=false,
  ActionBar=null
}) {
  return (
    <TableContainer borderWidth={"1px"} borderRadius={5} m={5}>
      <HStack justifyContent={"space-between"} p={3}>
        <Text flex={2} fontSize={"lg"} fontWeight={"bold"}>{title}</Text>
        {dropdownHeader &&
          <Select onChange={dropdownAction} placeholder={dropdownPlaceholder} width={"15%"}>
            {dropdownOptions.map(option => (
              <option key={option}>{option}</option>
            ))}
          </Select>
        }
      </HStack>

      <Divider/>

      {ActionBar &&
        <React.Fragment>
          <ActionBar/>
          <Divider/>
        </React.Fragment>
      }

      <Table variant={"simple"}>
          <Tr>
            {headerRow.map(column => (
              <Th key={column}>{column}</Th>
            ))}
          </Tr>
        {/*</Thead>*/}

        <Tbody>
          {data && true && data.map((item, index) => {
            if (item.hasOwnProperty("folder") && fileTable) {
              return (
                <Tr key={key} onClick={() => item.navigateToFolder(item.id)} _hover={{cursor: "pointer", opacity: 0.5}}>
                  {cellKeys.map(cell => (
                    <Td key={item}>{item[cell]}</Td>
                  ))}
                </Tr>
              )
            } else if (item.hasOwnProperty("file") && fileTable) {
              return (
                <Tr key={key} onClick={() => window.open(item.webUrl, "_blank")} _hover={{cursor: "pointer", opacity: 0.5}}>
                  {cellKeys.map(cell => (
                    <Td key={item}>{item[cell]}</Td>
                  ))}
                </Tr>
              )
            }

            return (
              <Tr key={key}>
                {cellKeys.map(cell => (
                  <Td key={item}>{item[cell]}</Td>
                ))}
              </Tr>
            )
          })}

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