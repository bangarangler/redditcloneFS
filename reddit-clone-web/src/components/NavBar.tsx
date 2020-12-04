import React, { FC } from "react";
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
// Generated / Utils
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface navBarProps {}
console.log("hello there");

const NavBar: FC<navBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  // const [{ data, fetching }] = useMeQuery();
  // don't feel like need to make this request server side
  // no longer needed we are checking the cookie if you want ssr in this case
  // don't mind fetching it
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={4}>
            Create Post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant="link"
          isLoading={logoutFetching}
          onClick={() => {
            logout();
          }}>
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex maxW={800} flex={1} m="auto" align="center">
        <NextLink href="/">
          <Link>
            <Heading>Reddit Clone</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
