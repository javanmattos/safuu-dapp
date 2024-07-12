import { Container, useMediaQuery, Grid } from "@material-ui/core";
import { Box, Paper, Typography, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./account.scss";
import { useSelector } from "react-redux";
import { IReduxState } from "../../store/slices/state.interface";
import { IAccountSlice } from "src/store/slices/account-slice";
import { IAppSlice } from "src/store/slices/app-slice";
import { trim } from "../../helpers";
import { useCountdown } from "../../helpers";

const Account = () => {
    const isSmallScreen = useMediaQuery("(max-width: 650px)");
    const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const account = useSelector<IReduxState, IAccountSlice>(state => state.account);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const rebaseTime = useCountdown();
    return (
        <div id="account-view" className={`account-view ${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
            <Container>
                <Zoom in>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={4}>
                            <Paper className="account-card">
                                <Box className="data-column">
                                    <Typography>Your Balance</Typography>
                                    <Typography variant="h4" style={{ fontFamily: "Montserrat Medium", color: "#07de0f", fontWeight: "bolder" }}>
                                        ${trim(Number(account.balances.safuu) * app.marketPrice, 2)}
                                    </Typography>
                                    <Typography>{account.balances.safuu} SAFUU</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={4}>
                            <Paper className="account-card">
                                <Box className="data-column">
                                    <Typography>APY</Typography>
                                    <Typography variant="h4" style={{ fontFamily: "Montserrat Medium", color: "#07de0f", fontWeight: "bolder" }}>
                                        {new Intl.NumberFormat().format(Number(`${trim(app.currentApy * 100, 2)}`))}%
                                    </Typography>
                                    <Typography>Daily ROI {trim(app.dailyRate * 100, 2)}%</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={4}>
                            <Paper className="account-card">
                                <Box className="data-column">
                                    <Typography>Next Rebase:</Typography>
                                    <Typography variant="h4" style={{ fontFamily: "Montserrat Medium", color: "#07de0f", fontWeight: "bolder" }}>
                                        {`00:${rebaseTime[2]}:${rebaseTime[3]}`}
                                    </Typography>
                                    <Typography>Rebasing...</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Zoom>
                <Zoom in>
                    <Paper className="account-card">
                        <Box className="data-row">
                            <Typography>Current SAFUU Price</Typography>
                            <Typography variant="h5" style={{ fontFamily: "Montserrat Medium", fontWeight: "bolder" }}>
                                {isAppLoading ? <Skeleton width="80px" /> : <>${trim(app.marketPrice, 2)}</>}
                            </Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>Next Reward Amount</Typography>
                            <Typography variant="h5" style={{ fontFamily: "Montserrat Medium", fontWeight: "bolder" }}>
                                {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(account.balances.safuu) * 0.0002355, 3)} SAFUU</>}
                            </Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>Next Reward Amount USD</Typography>
                            <Typography variant="h5" style={{ fontFamily: "Montserrat Medium", fontWeight: "bolder" }}>
                                {isAppLoading ? <Skeleton width="80px" /> : <>${trim(Number(account.balances.safuu) * 0.0002355 * app.marketPrice, 5)} </>}
                            </Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>Next Reward Yield</Typography>
                            <Typography variant="h5" style={{ fontFamily: "Montserrat Medium", fontWeight: "bolder" }}>
                                {isAppLoading ? <Skeleton width="80px" /> : <>{0.02355}%</>}
                            </Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>ROI(1-Day Rate) USD</Typography>
                            <Typography variant="h5" style={{ fontFamily: "Montserrat Medium", fontWeight: "bolder" }}>
                                {isAppLoading ? <Skeleton width="80px" /> : <>${trim(app.oneDayRate * Number(account.balances.safuu) * app.marketPrice, 4)}</>}
                            </Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>ROI(5-Day Rate)</Typography>
                            <Typography variant="h5" style={{ fontFamily: "Montserrat Medium", fontWeight: "bolder" }}>
                                {isAppLoading ? <Skeleton width="80px" /> : <>{trim(app.fiveDayRate * 100, 2)}%</>}
                            </Typography>
                        </Box>
                        <Box className="data-row">
                            <Typography>ROI(5-Day Rate) USD</Typography>
                            <Typography variant="h5" style={{ fontFamily: "Montserrat Medium", fontWeight: "bolder" }}>
                                {isAppLoading ? <Skeleton width="80px" /> : <>${trim(app.fiveDayRate * Number(account.balances.safuu) * app.marketPrice, 4)}</>}
                            </Typography>
                        </Box>
                    </Paper>
                </Zoom>
            </Container>
        </div>
    );
};

export default Account;
