import { notifications } from "@mantine/notifications";
export function Notification() {
  function UpdateToSuccess(id: string, message: string) {
    return notifications.update({
      id,
      message,
      title: "Success",
      withCloseButton: true,
      color: "teal",
      autoClose: 1000,
      loading: false,
    });
  }
  function ShowError(title: string = "Error", message: string) {
    notifications.show({
      withCloseButton: true,
      title,
      message,
      color: "red",
      loading: false,
      autoClose: false,
    });
  }
  function Info(title: string = "Info", message: string) {
    notifications.show({
      autoClose: 2000,
      withCloseButton: true,
      title,
      message,
      loading: false,
    });
  }
  function Loading(id: string, title: string = "Loading", message: string) {
    return notifications.show({
      id,
      title,
      message,
      autoClose: false,
      withCloseButton: false,
      loading: true,
    });
  }
  function Close(id: string) {
    notifications.hide(id);
  }

  function Update(
    id: string,
    title: string = "Loading",
    message: string,
    color: "teal" | "red" | undefined,
    autoClose: number | boolean
  ) {
    return notifications.update({
      id,
      autoClose,
      withCloseButton: true,
      title,
      message,
      color: color,
      loading: false,
    });
  }
  function ErrorOrSucces(id: string, message: string, isError: boolean) {
    return notifications.update({
      id,
      message,
      title: isError ? "Error" : "Success",
      withCloseButton: true,
      color: isError ?  "red" : "teal",
      autoClose: isError ? false : 1000,
      loading: false,
    });
  }
  return { UpdateToSuccess, ShowError, Info, Loading, Update, Close, ErrorOrSucces };
}
