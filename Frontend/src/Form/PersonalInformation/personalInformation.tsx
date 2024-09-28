import { Fieldset, Group, TextInput } from "@mantine/core";
import Btn from "../../Components/Btn";
import { UsepersonalInformation } from "./UsepersonalInformation";

function PersonalInformation() {
  const { user, userRole, ChangeUserProp, Submit, SubmitOnEnter } = UsepersonalInformation();

  return (
    <form  onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
      await SubmitOnEnter(e);
    }}>      
      <Fieldset legend="Personal information" style={{ textAlign: "start" }}>
        <TextInput label="Your name" value={user?.name} onChange={e => ChangeUserProp(e.target.value, "Name")} placeholder="Your name" />
        <TextInput label="Surname" value={user?.surname} onChange={e => ChangeUserProp(e.target.value, "Surname")} placeholder="Surname" mt="md" />
        <TextInput
          label="Role"
          value={userRole}
          placeholder="Role"
          mt="md"
          readOnly
          disabled
        />
        <TextInput label="Email" value={user?.email} onChange={e => ChangeUserProp(e.target.value, "Email")}  placeholder="Email" mt="md" />

        <Group justify="flex-end" mt="md">
          <Btn title="Submit" onClick={Submit}/>
        </Group>
      </Fieldset>
    </form>
  );
}
export default PersonalInformation;
