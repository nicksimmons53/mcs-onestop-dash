import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import Layout from "../components/layout";
import {UserProvider} from "@auth0/nextjs-auth0";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
