import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
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

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: { limit: 10 },
  });

  if (!fetching && !data) {
    return <div>Sorry couldn't get any posts, it failed</div>;
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>Reddit Clone</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      <div>hello world</div>
      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spaing={8}>
          {data!.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data ? (
        <Flex>
          <Button isLoading={fetching} m="auto" my={8}>
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
