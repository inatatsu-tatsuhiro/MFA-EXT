import { auth } from "./firebase";
import { RecaptchaVerifier } from "firebase/auth";

export const configureCaptcha = () => {
  const recaptchaVerifier = new RecaptchaVerifier(
    "sign-in-button",
    {
      size: "invisible",
      callback: (response: any) => {
        console.log("Recaptcha verified", response);
      },
    },
    auth
  );
  return recaptchaVerifier;
};
