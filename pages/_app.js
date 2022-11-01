import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import { UserProvider } from "@auth0/nextjs-auth0";
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from "react-redux";
import { store } from "../src/app/store";
import TabHeader from "../components/tabHeader";

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <UserProvider>
                <ChakraProvider>
                    <TabHeader />

                    <Component {...pageProps} />
                </ChakraProvider>
            </UserProvider>
        </Provider>
    );
}

export default MyApp;
