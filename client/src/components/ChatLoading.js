import { Skeleton, Stack } from "@chakra-ui/react";
const h = "45px";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height={h}></Skeleton>
      <Skeleton height={h}></Skeleton>
      <Skeleton height={h}></Skeleton>
      <Skeleton height={h}></Skeleton>
      <Skeleton height={h}></Skeleton>
      <Skeleton height={h}></Skeleton>
      <Skeleton height={h}></Skeleton>
      <Skeleton height={h}></Skeleton>
      <Skeleton height={h}></Skeleton>
      <Skeleton height={h}></Skeleton>
      <Skeleton height={h}></Skeleton>
    </Stack>
  );
};

export default ChatLoading;
