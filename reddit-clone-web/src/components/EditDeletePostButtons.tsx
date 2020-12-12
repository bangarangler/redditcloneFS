import React, { FC } from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

const EditDeletePostButtons: FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const { data: meData } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    console.log(meData?.me?.id);
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          icon={<EditIcon />}
          aria-label="Edit Post"
        />
      </NextLink>
      <IconButton
        // colorScheme="red"
        icon={<DeleteIcon />}
        aria-label="Delete Post"
        onClick={() =>
          deletePost({
            variables: { id },
            update: (cache) => {
              // Post:78
              cache.evict({ id: "Post:" + id });
            },
          })
        }
      />
    </Box>
  );
};

export default EditDeletePostButtons;
