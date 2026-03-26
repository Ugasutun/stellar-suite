import { isConnected, requestAccess, getAddress, signTransaction } from "@stellar/freighter-api";

export const checkFreighterInstalled = async (): Promise<boolean> => {
  if (typeof window !== "undefined" && (window as any).freighter) {
    return true;
  }
  try {
    const result = await isConnected();
    // result could be a boolean or an object depending on the API version
    if (typeof result === "boolean") {
      return result;
    }
    return !!(result as any)?.isConnected;
  } catch (error) {
    return false;
  }
};

export const getFreighterPublicKey = async (): Promise<string> => {
  try {
    const result = await getAddress();
    if (result.error) {
      throw new Error(result.error);
    }
    if (!result.address) {
      throw new Error("Could not retrieve public key");
    }
    return result.address;
  } catch (error: any) {
    throw new Error(error.message || "Failed to retrieve public key");
  }
};

export const connectFreighterWallet = async (): Promise<string> => {
  try {
    const access = await requestAccess();
    if (access.error) {
      throw new Error(access.error);
    }
    if (!access.address) {
      throw new Error("User rejected connection or Freighter is not installed.");
    }
    return access.address;
  } catch (error: any) {
    throw new Error(error.message || "User rejected connection");
  }
};

export const signFreighterTransaction = async (
  transactionXdr: string,
  options?: {
    networkPassphrase?: string;
    address?: string;
  }
): Promise<string> => {
  try {
    const result = await signTransaction(transactionXdr, options);
    if (result.error) {
      throw new Error(result.error.message || "Freighter rejected the transaction.");
    }
    if (!result.signedTxXdr) {
      throw new Error("Freighter did not return a signed transaction.");
    }
    return result.signedTxXdr;
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign transaction with Freighter.");
  }
};
