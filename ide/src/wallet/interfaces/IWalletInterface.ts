export interface IWalletInterface {
  connect(): Promise<string>;
  signTransaction?(
    transactionXdr: string,
    options?: {
      networkPassphrase?: string;
      address?: string;
    }
  ): Promise<string>;
  checkConnection?(): Promise<string | null>;
}
