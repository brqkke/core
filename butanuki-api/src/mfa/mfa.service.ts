import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import { base32Decode } from '../utils';
import qs from 'querystring';

export interface MfaServiceInterface {
  verifyMfa({
    mfaCode,
    mfaSecret,
  }: {
    mfaCode: string;
    mfaSecret: string;
  }): boolean;
  generateMfaHOTP(mfaSecret: string, counter: number): string;
}

@Injectable()
export class MfaService implements MfaServiceInterface {
  verifyMfa({
    mfaCode,
    mfaSecret,
  }: {
    mfaCode: string;
    mfaSecret: string;
  }): boolean {
    const count = Math.floor(Date.now() / 1000 / 30);
    const possibleCodes = [-1, 0, 1].map((offset) =>
      this.generateMfaHOTP(mfaSecret, offset + count),
    );
    return possibleCodes.includes(mfaCode);
  }

  generateMfaHOTP(mfaSecret: string, counter: number): string {
    const hmac = this.hmacsha1(mfaSecret, counter);
    return this.truncate(hmac).toString().padStart(6, '0');
  }

  generateMfaSecret(): Buffer {
    return crypto.randomBytes(10);
  }

  generateMfaQrCode({
    issuer,
    secret,
    account,
  }: {
    secret: string;
    issuer: string;
    account: string;
  }): string {
    const urlBuilder = new URL(
      'otpauth://totp/' + qs.escape(issuer) + ':' + qs.escape(account),
    );
    urlBuilder.searchParams.append('secret', secret);
    urlBuilder.searchParams.append('issuer', issuer);
    return urlBuilder.toString();
  }

  private hotpCounter(counter: number): string {
    const hexCounter = counter.toString(16);
    return hexCounter.padStart(16, '0');
  }

  private hmacsha1(secretHex: string, count: number): Buffer {
    const secretDecoded = base32Decode(secretHex);
    const hexCounter = this.hotpCounter(count);
    const counterBuffer = Buffer.from(hexCounter, 'hex');
    const hmac = crypto.createHmac('sha1', secretDecoded);
    return hmac.update(counterBuffer).digest();
  }

  private truncate(hmac: Buffer): number {
    const Sbits = this.DT(hmac);
    return Sbits % Math.pow(10, 6);
  }

  /**
   *
   * @param hmac Buffer
   * @returns {number}
   * @constructor
   */
  private DT(hmac: Buffer): number {
    /*
     DT(String) // String = String[0]...String[19]
       Let OffsetBits be the low-order 4 bits of String[19]
       Offset = StToNum(OffsetBits) // 0 <= OffSet <= 15
       Let P = String[OffSet]...String[OffSet+3]
       Return the Last 31 bits of P
     */
    const offsetBits = hmac[19] & 0xf;
    const P = hmac.slice(offsetBits, offsetBits + 4).readUInt32BE(0);
    return P & 0b1111111111111111111111111111111;
  }
}
