import { ethers } from "ethers";
import { LpReserveContract } from "src/abi";
import { Networks } from "../constants/blockchain";

export async function getReserve(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    const pairAddress = "0xf5D9b8947b11DdF5eE33374cC2865E775EBE00Dc";
    const pairContract = new ethers.Contract(pairAddress, LpReserveContract,provider);
    const reserves = await pairContract.getReserves();
    return reserves;
}
