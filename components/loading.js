import React from "react"
import { Dimmer, Loader } from "semantic-ui-react";

export default function Loading() {
    return (
        <div>
            <Dimmer active>
                <Loader>Loading</Loader>
            </Dimmer>
        </div>
    );
}
