declare module 'paytmchecksum' {
  export default class PaytmChecksum {
    static generateSignature(params: any, key: string): Promise<string>;
    static verifySignature(params: any, key: string, checksum: string): Promise<boolean>;
  }
}
