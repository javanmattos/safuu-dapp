import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import {  SafuuContract, LpReserveContract, Erc20Contract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getMarketPrice, getTokenPrice } from "../../helpers";
import { RootState } from "../store";
import { getLastRebasedTime } from "../../helpers"

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {

        const bnbPrice = getTokenPrice("BNB");
        const addresses = getAddresses(networkID);
        
        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
        const lastRebasedTime = await getLastRebasedTime(networkID, provider);
        const safuuContract = new ethers.Contract(addresses.SAFUU_ADDRESS, SafuuContract, provider);
        const busdContract = new ethers.Contract( addresses.BUSD_ADDRESS, Erc20Contract, provider);
        const pairContract = new ethers.Contract( addresses.PAIR_ADDRESS, LpReserveContract, provider);
        
        const marketPrice = (await getMarketPrice(networkID, provider)) * bnbPrice;
        
        const totalSupply = (await safuuContract.totalSupply()) / Math.pow(10, 5);
        const circSupply = totalSupply - (await safuuContract.balanceOf(addresses.FIREPIT_ADDRESS)) / Math.pow(10,5);
        const marketCap = circSupply * marketPrice;

        const fiveDayRate = Math.pow(1 + 0.0002355 , 5 * 4 * 24 ) - 1;
        const oneDayRate = Math.pow(1 + 0.0002355 ,  4 * 24 ) - 1;
        const dailyRate = Math.pow(1 + 0.0002355, 24 * 4) - 1;
        const reserves = await pairContract.getReserves();
        const poolBNBAmount = reserves[0] / Math.pow(10,18)
        const bnbLiquidityValue = poolBNBAmount * bnbPrice * 2;
        const treasurySafuuValue = (await safuuContract.balanceOf(addresses.TREASURY_ADDRESS) / Math.pow(10,5)) * marketPrice ;
        const treasuryBNBAmount = await provider.getBalance(addresses.TREASURY_ADDRESS);
        const treasuryBNBValue = Number(ethers.utils.formatEther(treasuryBNBAmount)) * bnbPrice;
        const treasuryBUSDValue = Number(await busdContract.balanceOf( addresses.TREASURY_ADDRESS )) / Math.pow(10,18);
        const treasuryValue = treasuryBNBValue + treasurySafuuValue + treasuryBUSDValue;
        const backedLiquidity = "100%";
        const firepitBalance = (await safuuContract.balanceOf(addresses.FIREPIT_ADDRESS))/ Math.pow(10,5);
        const sifBNBAmount = await provider.getBalance(addresses.SIF_ADDRESS) ;
        const sifBUSDAmount = (await busdContract.balanceOf( addresses.SIF_ADDRESS )) / Math.pow(10,18);
        const sifValue = Number(ethers.utils.formatEther(sifBNBAmount)) * bnbPrice + Number(sifBUSDAmount);
        const currentApy = Math.pow(1 + 0.0002355, 365 * 4 * 24) - 1 ;

        return {          
            totalSupply,
            marketCap,
            currentBlock,
            dailyRate,
            circSupply,
            fiveDayRate,
            marketPrice,
            currentBlockTime,
            oneDayRate,
            lastRebasedTime,
            backedLiquidity,
            bnbLiquidityValue,
            sifValue,
            firepitBalance,
            treasuryValue,
            currentApy,
        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    loading: boolean;
    networkID: number;
    totalSupply: number;
    marketCap: number;
    currentBlock: number;
    circSupply: number;
    oneDayRate: number;
    fiveDayRate: number;
    dailyRate:number
    currentBlockTime: number;
    lastRebasedTime: number;
    treasuryValue: number;
    sifValue: number;
    firepitBalance:number;
    bnbLiquidityValue: number;
    backedLiquidity: string;
    marketPrice: number;
    currentApy: number

}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
