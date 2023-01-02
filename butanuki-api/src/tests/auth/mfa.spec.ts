import { MfaService } from '../../mfa/mfa.service';
import { base32Encode } from '../../utils';

describe('Totp implementation', () => {
  const secret = base32Encode(Buffer.from('12345678901234567890', 'ascii'));
  const mfaService = new MfaService();
  it.each([
    [0, '755224'],
    [1, '287082'],
    [2, '359152'],
    [3, '969429'],
    [4, '338314'],
    [5, '254676'],
    [6, '287922'],
    [7, '162583'],
    [8, '399871'],
    [9, '520489'],
  ])('HOTP %i', (i, expected) => {
    const totp = mfaService.generateMfaHOTP(secret, i);
    expect(totp).toBe(expected);
  });

  /**
   * https://www.rfc-editor.org/rfc/rfc6238#appendix-B
   */
  it.each([
    [59, '287082'],
    [1111111109, '081804'],
    [1111111111, '050471'],
    [1234567890, '005924'],
    [2000000000, '279037'],
    [20000000000, '353130'],
  ])('TOTP %i', (i, expected) => {
    const skews = [-1, 0, 1];
    skews.forEach((skew) => {
      const mock = jest
        .spyOn(Date, 'now')
        .mockImplementation(() => (i + 30 * skew) * 1000);
      const result = mfaService.verifyMfa({
        mfaCode: expected,
        mfaSecret: secret,
      });
      expect(result).toBe(true);
      mock.mockRestore();
    });
  });
});
