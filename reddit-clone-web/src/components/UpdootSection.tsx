import React, { FC, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
// Generated / Utils
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const UpdootSection: FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loadin" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
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
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
      />
      {post.points}
      <IconButton
        aria-label="DownVote"
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downdoot-loadin"}
        icon={<ChevronDownIcon />}
        h={5}
        w="auto"
        onClick={async () => {
          if (post.voteStatus === -1) return;
          setLoadingState("downdoot-loadin");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
      />
    </Flex>
  );
};

export default UpdootSection;
