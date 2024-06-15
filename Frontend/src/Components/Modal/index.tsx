import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";

export const openDeleteModal = (action: () => void, title: string, confirmationText: string, children: null | React.ReactNode = null, withButtons: boolean = true) =>
  modals.openConfirmModal({
    title: title,
    size: "md",
    centered: true,
    children: children ? children : <Text size="sm">{confirmationText}</Text>,
    labels: { confirm:"Submit", cancel: "Cancel" },
    confirmProps: { color: "red", variant:"outline", display: !withButtons ? "none" : undefined },
    cancelProps: { color: "black", variant:"outline", display: !withButtons ? "none" : undefined},
    onConfirm: () => {
      action();
    }
  });

  export const closeAllModal = () => modals.closeAll();