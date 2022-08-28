import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import {UserProvider} from "@auth0/nextjs-auth0";
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from "react-redux";
import { store } from "../src/app/store";
import icon from "../public/icon.png";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <UserProvider>
        <ChakraProvider>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000"/>
                <meta name="msapplication-TileColor" content="#cad3d5"/>
                <meta name="theme-color" content="#ffffff"/>
            </Head>

          <Component {...pageProps} />
        </ChakraProvider>
      </UserProvider>
    </Provider>
  )
}

export default MyApp;
