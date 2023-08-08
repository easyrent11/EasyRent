export function xorEncrypt(data, key) {
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(charCode);
  }
  return encrypted;
}

export function xorDecrypt(encryptedData, key) {
  let decrypted = '';
  for (let i = 0; i < encryptedData.length; i++) {
    const charCode = encryptedData.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    decrypted += String.fromCharCode(charCode);
  }
  return decrypted;
}
