import React from "react";
import { useSelector } from "react-redux";

const ShowPopup = () => {
  useEffect(() => {}, []);
  console.log(verifyemail, "Veryfyyyy email");
  switch (verifyemail && success) {
    case true:
      MessagePopup.show({
        title: "OTP sent!",
        message: `${message}`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
              navigation.replace("OtpVerification", params);
            },
          },
        ],
        closeOnOverlayPress: false,
      });
      break;
    case false:
      MessagePopup.show({
        title: "Warning!",
        message: `Please check your Email-id`,
        actions: [
          {
            text: "Okay",
            action: () => {
              MessagePopup.hide();
            },
          },
        ],
        closeOnOverlayPress: false,
      });
      break;
  }

  return <></>;
};

export default ShowPopup;
