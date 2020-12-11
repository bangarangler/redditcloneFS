// import { useEffect } from "react";
// import { withUrqlClient } from "next-urql";
// import { createUrqlClient } from "../utils/createUrqlClient";
import { withApollo } from "../utils/withApollo";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import {
  Link,
  Stack,
  Box,
  Text,
  Heading,
  Flex,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Layout from "../components/Layout";
import UpdootSection from "../components/UpdootSection";
import EditDeletePostButtons from "../components/EditDeletePostButtons";

const Index = () => {
  const { data: meData } = useMeQuery();

  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <div>
        <div>Sorry couldn't get any posts, it failed</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spaing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Posted by: {p.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    {meData?.me?.id !== p.creator.id ? null : (
                      <Box ml="auto">
                        <EditDeletePostButtons
                          id={p.id}
                          creatorId={p.creator.id}
                        />
                      </Box>
                    )}
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                // updateQuery: (
                //   previousValue,
                //   { fetchMoreResult }
                // ): PostsQuery => {
                //   if (!fetchMoreResult) {
                //     return previousValue as PostsQuery;
                //   }
                //   return {
                //     __typename: "Query",
                //     posts: {
                //       __typename: "PaginatedPosts",
                //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                //       posts: [
                //         ...(previousValue as PostsQuery).posts.posts,
                //         ...(fetchMoreResult as PostsQuery).posts.posts,
                //       ],
                //     },
                //   };
                // },
              });
            }}
            isLoading={loading}
            m="auto"
            my={8}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

// export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
// export default Index;
export default withApollo({ ssr: true })(Index);
