import "../styles/globals.css";
import type { AppProps } from "next/app";
import { config } from "../config";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
        {config.umamiScriptUrl && config.umamiSiteId ? (
          <script
            async
            defer
            data-website-id={config.umamiSiteId}
            src={config.umamiScriptUrl}
          ></script>
        ) : null}
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default App;
