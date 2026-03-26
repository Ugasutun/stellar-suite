import { IWalletInterface } from "../interfaces/IWalletInterface";
import { connectFreighterWallet, getFreighterPublicKey, checkFreighterInstalled, signFreighterTransaction } from "../../utils/freighter";

export class FreighterWallet implements IWalletInterface {
  async connect(): Promise<string> {
    // Just try to connect directly. If Freighter is missing or connection fails,
    // connectFreighterWallet() will throw an appropriate error.
    return await connectFreighterWallet();
  }

  async checkConnection(): Promise<string | null> {
    const isInstalled = await checkFreighterInstalled();
    if (isInstalled) {
      try {
        const publicKey = await getFreighterPublicKey();
        return publicKey || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  async signTransaction(
    transactionXdr: string,
    options?: {
      networkPassphrase?: string;
      address?: string;
    }
  ): Promise<string> {
    return signFreighterTransaction(transactionXdr, options);
  }
}
