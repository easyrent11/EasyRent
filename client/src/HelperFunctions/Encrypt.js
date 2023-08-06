import CryptoJS from "crypto-js";

// Replace this with your actual secret key
const secretKey = "6bf859a5b596815913919a39a67afc58a7f153c722dd77b6e636969d0a205674";

// Function to encrypt data
export const encryptData = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encodeURIComponent(ciphertext); // URL-safe encoding
};

// Function to decrypt data
export const decryptData = (ciphertext) => {
  const decodedCiphertext = decodeURIComponent(ciphertext); // URL-safe decoding
  const bytes = CryptoJS.AES.decrypt(decodedCiphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
