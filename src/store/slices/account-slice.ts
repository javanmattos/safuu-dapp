import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { SafuuContract, Erc20Contract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { RootState } from "../store";
import Web3 from "web3"

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        safuu: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    
    const addresses = getAddresses(networkID);
    const safuuContract = new ethers.Contract(addresses.SAFUU_ADDRESS, SafuuContract, provider);
    const safuuBalance = await safuuContract.balanceOf(address);
    return {
        balances: {
            safuu: ethers.utils.formatUnits(safuuBalance, 5),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        safuu: string;
        allowance: string;
        bnb : string;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    
    
    let safuuBalance, allowance = 0; 
    const addresses = getAddresses(networkID);
    const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org'));
    const bnbBalance = await web3.eth.getBalance(address);
    if (addresses.SAFUU_ADDRESS) {
        const safuuContract = new ethers.Contract(addresses.SAFUU_ADDRESS, SafuuContract, provider);
        safuuBalance = await safuuContract.balanceOf(address);
        allowance = await safuuContract.allowance(address,addresses.ROUTER_ADDRESS);

    }
    return {
        balances: {
            safuu: ethers.utils.formatUnits(safuuBalance, 5),
            allowance: ethers.utils.formatUnits(allowance,5),
            bnb : ethers.utils.formatUnits(bnbBalance,18)
        }
    };
});



export interface IUserTokenDetails {
    balance: number;
    isBnb?: boolean;
}



export interface IAccountSlice {
    balances: {
        safuu: string;
        allowance:string;
        bnb : string;
    };
    loading: boolean;
    tokens: { [key: string]: IUserTokenDetails };
}

const initialState: IAccountSlice = {
    loading: true,
    balances: { safuu: "0", allowance:"0", bnb:"0" },
    tokens: {},
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
