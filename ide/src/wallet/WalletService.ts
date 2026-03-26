import { IWalletInterface } from "./interfaces/IWalletInterface";
import { FreighterWallet } from "./providers/FreighterWallet";
import { AlbedoWallet } from "./providers/AlbedoWallet";

export type WalletProviderType = "freighter" | "albedo";

export class WalletService {
  private static getProvider(walletType: WalletProviderType): IWalletInterface {
    switch (walletType) {
      case "freighter":
        return new FreighterWallet();
      case "albedo":
        return new AlbedoWallet();
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }

  static async connect(walletType: WalletProviderType): Promise<string> {
    const provider = this.getProvider(walletType);
    return await provider.connect();
  }

  static async checkConnection(walletType: WalletProviderType): Promise<string | null> {
    const provider = this.getProvider(walletType);
    if (provider.checkConnection) {
      return await provider.checkConnection();
    }
    return null;
  }

  static async signTransaction(
    walletType: WalletProviderType,
    transactionXdr: string,
    options?: {
      networkPassphrase?: string;
      address?: string;
    }
  ): Promise<string> {
    const provider = this.getProvider(walletType);
    if (!provider.signTransaction) {
      throw new Error(`Wallet provider "${walletType}" does not support transaction signing.`);
    }
    return provider.signTransaction(transactionXdr, options);
  }
}
