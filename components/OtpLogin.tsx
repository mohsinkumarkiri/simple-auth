// "use client";

// import { auth } from "../firebase";
// import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import React, { FormEvent, useEffect,  useRef, useState, useTransition } from "react";
// import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./ui/input-otp";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { useRouter } from "next/navigation";
// function OtpLogin() {
//   const router = useRouter();

//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState("");
//   const [resendCountdown, setResendCountdown] = useState(0);

//   const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

//   const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

//   const [isPending, startTransition] = useTransition();

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (resendCountdown > 0) {
//       timer = setTimeout(() => {
//         setResendCountdown(resendCountdown - 1);
//       }, 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendCountdown]);

//   useEffect(() => {
//     const recaptchaVerifier = new RecaptchaVerifier(
//       auth,
//       "recaptcha-container",
//       {
//         size: "invisible",
//       }
//     );
//     setRecaptchaVerifier(recaptchaVerifier);

//     return () => {
//       recaptchaVerifier.clear();
//     };
//   }, [auth]);

//   return <div>OtpLogin</div>;
  
// }

// export default OtpLogin;

"use client";

import { auth } from "../firebase";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import React, {
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function OtpLogin() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (recaptchaVerifier.current) return;

    recaptchaVerifier.current = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    recaptchaVerifier.current
      .render()
      .then((widgetId) => {
        console.log("reCAPTCHA loaded:", widgetId);
      })
      .catch(console.error);

    return () => {
      recaptchaVerifier.current?.clear();
      recaptchaVerifier.current = null;
    };
  }, []);


  const sendOtp = async () => {
    try {
      if (!recaptchaVerifier.current) return;

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.current
      );

      setConfirmationResult(confirmation);
      alert("OTP Sent");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {!confirmationResult && (
        <form onSubmit={sendOtp}>
          <input
            className="text-black"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
          <p className="text-xs text-gray-400 mt-2">
            Please enter your number with country code. (i.e +1 for USA)
          </p>
        </form>
      )}

      <Button
        disabled={!phoneNumber || isPending || resendCountdown > 0}
        onClick={() => sendOtp()}
        className="mt-5"
      >
        {resendCountdown > 0
          ? `Resend OTP in ${resendCountdown}s`
          : isPending
          ? "Resend OTP"
          : "Send OTP"}  
      </Button>
      
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default OtpLogin;