const crypto = require('crypto');
//
// function hotpCounter(counter) {
//   const hexCounter = counter.toString(16);
//   return hexCounter.padStart(16, '0');
// }
//
// function hmacsha1(secret, count) {
//   const secretBuffer = Buffer.from(secret, 'ascii');
//   const hexCounter = hotpCounter(count);
//   const counterBuffer = Buffer.from(hexCounter, 'hex');
//   console.log(secretBuffer);
//   console.log(counterBuffer);
//   const hmac = crypto.createHmac('sha1', secretBuffer);
//   return hmac.update(counterBuffer).digest();
// }
//
// function truncate(hmac) {
//   const Sbits = DT(hmac);
//   const Snum = Sbits % Math.pow(10, 6);
//   return Snum;
// }
//
// /**
//  *
//  * @param hmac Buffer
//  * @returns {number}
//  * @constructor
//  */
// function DT(hmac) {
//   /*
//    DT(String) // String = String[0]...String[19]
//      Let OffsetBits be the low-order 4 bits of String[19]
//      Offset = StToNum(OffsetBits) // 0 <= OffSet <= 15
//      Let P = String[OffSet]...String[OffSet+3]
//      Return the Last 31 bits of P
//    */
//   const offsetBits = hmac[19] & 0xf;
//   const P = hmac.slice(offsetBits, offsetBits + 4).readUInt32BE(0);
//   return P & 0b1111111111111111111111111111111;
// }
//
// const hash = hmacsha1('12345678901234567890', 1);
// console.log(hash);
// console.log(truncate(hash));
function base32Encode(buffer) {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const binary = [...buffer]
    .map((byte) => {
      return byte.toString(2).padStart(8, '0');
    })
    .join('');
  const fiveBitInts = [];
  for (let i = 0; i < binary.length; i += 5) {
    fiveBitInts.push(binary.slice(i, i + 5));
  }
  console.log(fiveBitInts);
  return fiveBitInts
    .map((fiveBitInt) => {
      const decimal = parseInt(fiveBitInt, 2);
      return base32Chars[decimal];
    })
    .join('');
}

function base32Decode(base32) {
  const base32Chars = Object.fromEntries(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split('').map((c, i) => [c, i]),
  );

  const binaries = base32.split('').map((char) => {
    const decimal = base32Chars[char];
    return decimal.toString(2).padStart(5, '0');
  });
  const binary = binaries.join('');
  const bytes = [];
  for (let i = 0; i < binary.length; i += 8) {
    bytes.push(binary.slice(i, i + 8));
  }
  return Buffer.from(bytes.map((byte) => parseInt(byte, 2)));
}
const from = Buffer.from('fooba', 'ascii');
console.log(base32Decode(base32Encode(from)));
console.log(from);
// const b32 = base32Encode(from);
// console.log(b32);
