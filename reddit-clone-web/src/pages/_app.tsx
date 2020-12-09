import { CSSReset, extendTheme, ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const newTheme = extendTheme(theme);

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: "include",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={newTheme}>
        <CSSReset />
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
// <ThemeProvider theme={theme}>
