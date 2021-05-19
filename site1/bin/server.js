const crypto = require('crypto');
let original = 'myPassword';
let test = "somePassword";

let main = async () => {

  function encryptTmp(password) {
    const algorithm = 'des-ede3';

    // use a hex key here
    const key = Buffer.from('9GxTN6pRqOGNJTfDwG4Q6HGD5d2m6keR','base64');

    const cipher = crypto.createCipheriv(algorithm, key, null);
    let encrypted = cipher.update(password, 'utf8', 'base64');
    return cipher.final('base64');
  }

  let originalEncrypted = await encryptTmp(original);
  let testEncrypted = await encryptTmp(test);
  const salt = await crypto.randomBytes(8).toString("hex");

  crypto.scrypt(originalEncrypted, salt, 64, (err, hash) => {
    // Store hash
    console.log("Password: %s hashed", original);
    crypto.scrypt(testEncrypted, salt, 64, (err, testKey) => {
      console.log("Compare password %s to %s", test, original);
      if (hash.toString('hex') == testKey.toString('hex')) {
       // Passwords match
       console.log("Match: true");
      } else {
       // Passwords don't match
       console.log("Match: false");
      }
    });
    crypto.scrypt(originalEncrypted, salt, 64, (err, originalKey) => {
      console.log("Compare password %s to %s", original, original);
      if (hash.toString('hex') == originalKey.toString('hex')) {
       // Passwords match
       console.log("Match: true");
      } else {
       // Passwords don't match
       console.log("Match: false");
      }
    });
  });
}

main();
