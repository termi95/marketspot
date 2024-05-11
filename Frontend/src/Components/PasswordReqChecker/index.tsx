import { requirements } from "../../Helpers/Password";
import PasswordRequirement from "../PasswordRequirement";

export function PasswordReqChecker(password: string) {
    return requirements().map((requirement, index) => (
        <PasswordRequirement
          key={index}
          label={requirement.label}
          meets={requirement.re.test(password)}
        />
      ));
}