import "../styles/globals.css";
import type { AppProps } from "next/app";
import { config } from "../config";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script
          async
          defer
          data-website-id={config.umamiSiteId}
          src="https://umami-hg.fly.dev/umami.js"
        ></script>
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default App;
