import styled from "@emotion/styled";
import { Button, TextField } from "@mui/material";
import {
  signInWithEmailAndPassword,
  getMultiFactorResolver,
  PhoneAuthProvider,
  MultiFactorResolver,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import { useState } from "react";
import { configureCaptcha } from "../configureCapture";
import { auth } from "../firebase";

const Popup = () => {
  const [mail, setMail] = useState("");
  const [vid, setVid] = useState("");
  const [otp, setOTP] = useState("");
  const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);

  const login = async () => {
    const recaptchaVerifier = configureCaptcha();

    try {
      const user = await signInWithEmailAndPassword(auth, mail, "Test0000");
      console.log("user", user);
    } catch (error: any) {
      if (error.code === "auth/multi-factor-auth-required") {
        console.log("err", error.code);
        const multiResolver = getMultiFactorResolver(auth, error);
        const phoneOptions = {
          multiFactorHint: multiResolver!.hints[0],
          session: multiResolver!.session,
        };
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        try {
          const v = await phoneAuthProvider.verifyPhoneNumber(
            phoneOptions,
            recaptchaVerifier
          );
          setVid(v);
        } catch (e) {
          console.log("e", e);
        }

        const res = getMultiFactorResolver(auth, error);
        setResolver(res);
        alert("Code has been sent to your phone");
      }
    }
  };

  const submitOtp = () => {
    if (resolver === null) {
      console.error("resolver not found");
      return;
    }
    const credential = PhoneAuthProvider.credential(vid, otp);
    const multiFactorAssertion =
      PhoneMultiFactorGenerator.assertion(credential);
    resolver
      .resolveSignIn(multiFactorAssertion)
      .then(function (userCredential) {
        // User signed in.
        console.log("user", userCredential);
        setTimeout(() => {
          console.log("cred", userCredential);
        }, 1000);
      });
  };

  return (
    <Root>
      <TextField
        label="Email"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        fullWidth
      />
      <Button onClick={login}>LOGIN</Button>
      <TextField
        label="OTP"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
        fullWidth
      />
      <Button onClick={submitOtp}>OTP</Button>
      <div id="sign-in-button" />
    </Root>
  );
};

export default Popup;

const Root = styled("div")({
  width: "800px",
  height: "600px",
});
