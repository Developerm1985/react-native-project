import CryptoJS from "react-native-crypto-js";

export const encryption = (data, keys) => {
  const key = CryptoJS.enc.Utf8.parse(keys);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encryptedData = CryptoJS.AES.encrypt(data, key, { iv: iv });

  const ivHex = iv.toString(CryptoJS.enc.Hex);
  const encryptedDataHex = encryptedData.ciphertext.toString(CryptoJS.enc.Hex);
  const encryptedDataObj = {
    iv: ivHex,
    encryptedData: encryptedDataHex,
  };

  return encryptedDataObj;
};

export const decryption = (encryptData, keys, ivs) => {
  const key = CryptoJS.enc.Utf8.parse(keys);
  const iv = CryptoJS.enc.Hex.parse(ivs);
  const encryptedDataWordArray = CryptoJS.enc.Hex.parse(encryptData);
  const decryptedData = CryptoJS.AES.decrypt(
    { ciphertext: encryptedDataWordArray },
    key,
    { iv: iv }
  );
  const decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};
