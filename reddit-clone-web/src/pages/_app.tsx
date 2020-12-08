import { CSSReset } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <CSSReset />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
