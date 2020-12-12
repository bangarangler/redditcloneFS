import React, { FC, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import gql from "graphql-tag";
import { Flex, IconButton } from "@chakra-ui/react";
// Generated / Utils
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";
import { ApolloCache } from "@apollo/client";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: "Post:" + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value },
    });
  }
};

const UpdootSection: FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useVoteMutation();
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        aria-label="Upvote"
        isLoading={loadingState === "updoot-loading"}
        icon={<ChevronUpIcon />}
        h={5}
        w="auto"
        onClick={async () => {
          if (post.voteStatus === 1) return;
          setLoadingState("updoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
      />
      {post.points}
      <IconButton
        aria-label="DownVote"
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downdoot-loading"}
        icon={<ChevronDownIcon />}
        h={5}
        w="auto"
        onClick={async () => {
          if (post.voteStatus === -1) return;
          setLoadingState("downdoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
      />
    </Flex>
  );
};

export default UpdootSection;
