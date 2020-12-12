import React from "react";
import App from "next/app";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";

let globalApolloClient = null;

/**
 * Installs the Apollo Client on NextPageContext
 * or NextAppContext. Useful if you want to use apolloClient
 * inside getStaticProps, getStaticPaths or getServerSideProps
 * @param {NextPageContext | NextAppContext} ctx
 */

export const initOnContext = (ac, ctx) => {
  const inAppContext = Boolean(ctx.ctx);

  if (process.env.NODE_ENV === "development") {
    if (inAppContext) {
      console.warn(
        "Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in `pages/_app`.\n" +
          "Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n"
      );
    }
  }

  const apolloClient =
    ctx.apolloClient ||
    initApolloClient(ac, ctx.apolloState || {}, inAppContext ? ctx.ctx : ctx);

  apolloClient.toJSON = () => null;

  ctx.apolloClient = apolloClient;
  if (inAppContext) {
    ctx.ctx.apolloClient = apolloClient;
  }

  return ctx;
};

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {NormalizedCacheObject} initialState
 * @param  {NextPageContext} ctx
 */

const initApolloClient = (apolloClient, initialState, ctx) => {
  if (typeof window === "undefined") {
    return createApolloClient(apolloClient(ctx), initialState, ctx);
  }

  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(
      apolloClient(ctx),
      initialState,
      ctx
    );
  }
  return globalApolloClient;
};

/**
 * Creates a withApollo HOC
 * that provides the apolloContext
 * to a next.js Page or AppTree.
 * @param  {Object} withApolloOptions
 * @param  {Boolean} [withApolloOptions.ssr=false]
 * @returns {(PageComponent: ReactNode) => ReactNode}
 */

export const createWithApollo = (ac) => {
  return ({ ssr = false } = {}) => (PageComponent) => {
    const withApollo = ({ apolloClient, apolloState, ...pageProps }) => {
      let client;
      if (apolloClient) {
        client = apolloClient;
      } else {
        client = initApolloClient(ac, apolloState, undefined);
      }

      return (
        <ApolloProvider client={client}>
          <PageComponent {...pageProps} />
        </ApolloProvider>
      );
    };

    if (process.env.NODE_ENV !== "production") {
      const displayName =
        PageComponent.displayName || PageComponent.name || "Component";
      withApollo.displayName = `withApollo(${displayName})`;
    }

    if (ssr || PageComponent.getInitialProps) {
      withApollo.getInitialProps = async (ctx) => {
        const inAppContext = Boolean(ctx.ctx);
        const { apolloClient } = initOnContext(ac, ctx);
        let pageProps = {};
        if (PageComponent.getInitialProps) {
          pageProps = await PageComponent.getInitialProps(ctx);
        } else if (inAppContext) {
          pageProps = await App.getInitialProps(ctx);
        }

        if (typeof window === "undefined") {
          const { AppTree } = ctx;
          if (ctx.res && ctx.res.finished) {
            return pageProps;
          }

          if (ssr && AppTree) {
            try {
              const { getDataFromTree } = await import(
                "@apollo/client/react/ssr"
              );
              let props;
              if (inAppContext) {
                props = { ...pageProps, apolloClient };
              } else {
                props = { pageProps: { ...pageProps, apolloClient } };
              }
              await getDataFromTree(<AppTree {...props} />);
            } catch (error) {
              console.error("Error while running `getDataFromTree`", error);
            }
            Head.rewind();
          }
        }
        return {
          ...pageProps,
          apolloState: apolloClient.cache.extract(),
          apolloClient: ctx.apolloClient,
        };
      };
    }
    return withApollo;
  };
};

function createApolloClient(apolloClient, initialState, ctx) {
  apolloClient.ssrMode = Boolean(ctx);
  apolloClient.cache.restore(initialState);
  return apolloClient;
}
