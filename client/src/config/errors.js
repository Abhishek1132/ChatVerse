import { AxiosError } from "axios";

export const showError = (toast, error) => {
  toast({
    title:
      error instanceof AxiosError && error.code === "ERR_BAD_REQUEST"
        ? error.response.statusText + "!"
        : "Error!",
    description:
      error instanceof AxiosError && error.code === "ERR_BAD_REQUEST"
        ? error.response.data.error
        : error.message,
    duration: 3000,
    status:
      error instanceof AxiosError && error.code === "ERR_BAD_REQUEST"
        ? "warning"
        : "error",
    isClosable: true,
  });
};
