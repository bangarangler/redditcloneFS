import { CSSReset, extendTheme, ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
// import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
// import { PaginatedPosts } from "../generated/graphql";

const newTheme = extendTheme(theme);

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider theme={newTheme}>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
// <ThemeProvider theme={theme}>
