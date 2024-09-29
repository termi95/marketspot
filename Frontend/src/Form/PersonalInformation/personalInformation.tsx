import { Fieldset, Group, rem, TextInput } from "@mantine/core";
import Btn from "../../Components/Btn";
import { UsepersonalInformation } from "./UsepersonalInformation";
import { IconAt, IconUser, IconUserCircle } from "@tabler/icons-react";
import OpenPasswordConfirmationModal from "../../Components/PasswordConfirmationAction";

function PersonalInformation() {
  const { user, userRole, ChangeUserProp, Submit, SubmitOnEnter } =
    UsepersonalInformation();

  return (
    <form
      onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
        await SubmitOnEnter(e);
      }}
    >
      <Fieldset legend="Personal information" style={{ textAlign: "start" }}>
        <TextInput
          label="Your name"
          value={user?.name}
          onChange={(e) => ChangeUserProp(e.target.value, "Name")}
          placeholder="Your name"
          leftSection={<IconUser style={{ width: rem(18), height: rem(18) }} />}
        />
        <TextInput
          label="Surname"
          value={user?.surname}
          onChange={(e) => ChangeUserProp(e.target.value, "Surname")}
          placeholder="Surname"
          mt="md"
          leftSection={<IconUser style={{ width: rem(18), height: rem(18) }} />}
        />
        <TextInput
          label="Role"
          value={userRole}
          placeholder="Role"
          mt="md"
          readOnly
          disabled
          leftSection={
            <IconUserCircle style={{ width: rem(18), height: rem(18) }} />
          }
        />
        <TextInput
          label="Email"
          value={user?.email}
          onChange={(e) => ChangeUserProp(e.target.value, "Email")}
          placeholder="Email"
          mt="md"
          leftSection={<IconAt style={{ width: rem(18), height: rem(18) }} />}
        />

        <Group justify="flex-end" mt="md">
          <Btn
            title="Submit"
            onClick={() => OpenPasswordConfirmationModal(Submit)}
          />
        </Group>
      </Fieldset>
    </form>
  );
}
export default PersonalInformation;
