import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers"
import { ethers } from "ethers"
import { SafuuContract } from "src/abi";
import { getAddresses, Networks } from "src/constants"

export const getApprovedAmount = async (address: string, networkID: Networks, provider: JsonRpcProvider| StaticJsonRpcProvider) => {
    const addresses = getAddresses(networkID);
    const safuuContract = new ethers.Contract(addresses.SAFUU_ADDRESS,SafuuContract,provider);
    let allowance = 0;
    allowance = safuuContract.allowance(address,addresses.ROUTER_ADDRESS);
    return allowance;
}