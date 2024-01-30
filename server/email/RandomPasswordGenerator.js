// tempPasswordGenerator.js
const getRandomChar = (charSet) => {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet.charAt(randomIndex);
  };
  
  const tempPasswordGenerator = () => {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numericChars = '0123456789';
    const specialChars = '@$!%*?&';
  
    const allChars =
      lowercaseChars + uppercaseChars + numericChars + specialChars;
  
    let password = '';
  
    // Ensure at least one character from each character set
    password +=
      getRandomChar(lowercaseChars) +
      getRandomChar(uppercaseChars) +
      getRandomChar(numericChars) +
      getRandomChar(specialChars);
  
    // Generate the remaining characters randomly
    for (let i = password.length; i < 8; i++) {
      password += getRandomChar(allChars);
    }
  
    return password;
  };
  
  module.exports = tempPasswordGenerator;
  