import { IWalletInterface } from "../interfaces/IWalletInterface";
import albedo from "@albedo-link/intent";

export class AlbedoWallet implements IWalletInterface {
  async connect(): Promise<string> {
    try {
      const response = await albedo.publicKey({});
      if (!response || !response.pubkey) {
        throw new Error("Failed to get public key from Albedo.");
      }
      return response.pubkey;
    } catch (error: any) {
      if (error.message && error.message.includes("closed")) {
         throw new Error("User closed the Albedo popup.");
      }
      throw new Error(error.message || "Failed to connect to Albedo.");
    }
  }

  async checkConnection(): Promise<string | null> {
    // Albedo does not have a persistent connection check without user interaction
    // So we just return null, meaning they need to connect explicitly.
    return null;
  }

  async signTransaction(): Promise<string> {
    throw new Error("Albedo transaction signing is not supported in the IDE execute flow yet.");
  }
}
