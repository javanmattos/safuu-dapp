import { BigNumber, ethers, constants } from "ethers";
import { getGasPrice } from "src/helpers/get-gas-price";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { sleep } from "src/helpers";
import { DEADLINE, getAddresses, Networks, Tokens } from "src/constants";
import { metamaskErrorWrap } from "src/helpers/metamask-error-wrap";
import { info, success, warning } from "./messages-slice";
import { messages } from "src/constants/messages";
import { RouterContract, SafuuContract } from "src/abi";
import { clearPendingTxn, fetchPendingTxns } from "./pending-txns-slice";
import { loadAccountDetails } from "./account-slice";

interface IApproveSafuu {
    address : string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    amount: string;
    token: Tokens;
    safuuBalance: string;
} 

export const approveSafuu = createAsyncThunk("approve safuu", async({address, networkID, provider, amount,safuuBalance, token}: IApproveSafuu,{dispatch}) => {
 
    if(!provider){
        dispatch(warning({text:messages.please_connect_wallet}));
        return;
    }
    const signer = provider.getSigner();
    const addresses = getAddresses(networkID);
    const safuuContract = new ethers.Contract(addresses.SAFUU_ADDRESS, SafuuContract, signer);
    let amountToApprove = "0";
    if (token === "safuu") {
        amountToApprove = BigNumber.from(ethers.utils.parseUnits(amount,5)).toString();
    } 

    let approveTx;
    try {
        const gasPrice = await  getGasPrice(provider);        
        approveTx = await safuuContract.approve(addresses.ROUTER_ADDRESS,amountToApprove,{gasPrice});
        dispatch(
            fetchPendingTxns({
                txnHash: approveTx.hash,
                text:"Approving",
                type:"approve"
            }),
        );
        await approveTx.wait();
        dispatch(success({text: messages.tx_successfully_send}));
        await sleep(5);
        await dispatch(loadAccountDetails({networkID, provider, address}));
    } catch(err : any) {
        metamaskErrorWrap(err,dispatch);
    } finally {
        if(approveTx){
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }
    await sleep(2);
});

interface ISwapToken {
    address : string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    amount: string;
    token: Tokens;
    safuuBalance: string;
}

export const swap = createAsyncThunk("swap", async({ address, networkID,provider, amount, safuuBalance, token}: ISwapToken,{dispatch}) => {

    if(!provider){
        dispatch(warning({text:messages.please_connect_wallet}));
        return;
    }
    const signer = provider.getSigner();
    const addresses = getAddresses(networkID);
    const routerContract = new ethers.Contract(addresses.ROUTER_ADDRESS, RouterContract, signer);
    const gasPrice = await  getGasPrice(provider);

    let amountToSwap = "0";
    let swapTx;

    if(token === "safuu") {        

        amountToSwap = BigNumber.from(ethers.utils.parseUnits(amount,5)).toString();
        const path = [addresses.SAFUU_ADDRESS,addresses.WBNB_ADDRESS];
        swapTx = await routerContract.swapExactTokensForETHSupportingFeeOnTransferTokens(amountToSwap,0, path, address, DEADLINE,{gasPrice});

    } else if(token === "bnb") {
        amountToSwap = BigNumber.from(ethers.utils.parseUnits(amount,18)).toString();
        const path = [addresses.WBNB_ADDRESS,addresses.SAFUU_ADDRESS];
        swapTx = await routerContract.swapExactETHForTokensSupportingFeeOnTransferTokens(0,path,address,DEADLINE,{value:amountToSwap, gasPrice});
    } 

    try {
        dispatch(fetchPendingTxns({
            txnHash:swapTx.hash,
            text:"swap",
            type:"swap"
            }),
        );
        await swapTx.wait();
        await sleep(5);
        await dispatch(loadAccountDetails({networkID, provider, address}));    
    } catch (err: any) {
        metamaskErrorWrap(err,dispatch);
    } finally {
        if(swapTx) {
            dispatch(clearPendingTxn(swapTx.hash));
        }
    }
    await sleep(2);   
})