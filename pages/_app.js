import '../styles/globals.css'
import {UserProvider} from "@auth0/nextjs-auth0";
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import {Provider} from "react-redux";
import {store} from "../src/app/store";
import TabHeader from "../components/tabHeader";
import {fonts} from "../lib/fonts";

const theme = extendTheme({
  fonts: {
    heading: 'var(--font-montserrat)',
    body: 'var(--font-montserrat)',
  }
});

function MyApp({Component, pageProps}) {
  return (
    <>
      <style jsx global>
        {`
            :root {
              --font-montserrat: ${fonts.montserrat.style.fontFamily};
            }
          `}
      </style>
      <Provider store={store}>
        <UserProvider>
          <ChakraProvider theme={theme}>
            <TabHeader/>

            <Component {...pageProps} />
          </ChakraProvider>
        </UserProvider>
      </Provider>
    </>
  );
}

export default MyApp;
