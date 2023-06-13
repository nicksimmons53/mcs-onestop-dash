import React from "react";
import { Select } from "@chakra-ui/react";

export default function ItemsPerPage ({ placeholder, value, onChange, options }) {
    return (
        <Select placeholder={placeholder} value={value} onChange={onChange} minW={75}>
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </Select>
    );
}