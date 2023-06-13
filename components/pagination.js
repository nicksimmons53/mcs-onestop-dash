import {Button, HStack} from "@chakra-ui/react";
import React from "react";

export default function Pagination ({ numOfPages, activePage }) {
    const [ activePage, setActivePage ] = React.useState(0);
    const [start, setStart] = React.useState(0);
    const [end, setEnd] = React.useState(10);

    const onChange = (index) => {
        setActivePage(index);
        setStart(index * numOfPages);
        setEnd((index + 1) * clientsPerPage);
    }

    return (
        <HStack>
            {new Array(numOfPages).fill("").map((value, index) => (
                <Button
                    onClick={() => onChange(index)} key={index}
                    colorScheme={activePage === index ? "blue" : "gray"}
                >
                    {index + 1}
                </Button>
            ))}
        </HStack>
    );
}