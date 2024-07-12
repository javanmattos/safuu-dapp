import { useSelector } from "react-redux";
import { Grid, useMediaQuery, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";
import { useCountdown } from "../../helpers";

function Dashboard() {
    const is1280 = useMediaQuery("(max-width: 1280px)");
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const rebaseTime = useCountdown();
    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <Zoom in={true}>
                    <div>
                        <div className="dashboard-content-wrapper">
                            <div className="dashbord-card-group">
                                <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }} className={is1280 ? "dashboard-card" : ""}>
                                    <div className="card-title-regular">Market Value of Treasury Asset</div>
                                    <div className="card-value">
                                        {isAppLoading ? (
                                            <Skeleton width="250px" />
                                            ) : (
                                            new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                maximumFractionDigits: 0,
                                                minimumFractionDigits: 0,
                                            }).format(app.treasuryValue)
                                        )}
                                    </div>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Total Supply</div>
                                    <div className="card-value">
                                        { 
                                            isAppLoading ? <Skeleton width="250px" /> :
                                            new Intl.NumberFormat().format(Number(`${trim(app.totalSupply, 2)}`))                                                    
                                        }
                                    </div>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Circulating Supply</div>
                                    <div className="card-value">
                                        { 
                                            isAppLoading ? <Skeleton width="250px" /> :
                                            new Intl.NumberFormat().format(Number(`${trim(app.circSupply, 2)}`))                                                    
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={is1280 ? "dashbord-card-group" : "dashboard-card"}>
                                <div className={is1280 ? "dashboard-card" : ""}>
                                    <div className={`card-title-${is1280 ? "regular" : "price"}`}>SAFUU PRICE</div>
                                    <p className="card-value" style={{fontSize:"25px"}}>{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 2)}`}</p>
                                </div>
                                {!is1280 && (
                                    <div className="timer-div">
                                        <span>
                                            {
                                                `00:${rebaseTime[2]}:${rebaseTime[3]}`
                                            }
                                        </span>
                                    </div>
                                )}
                                <div className={is1280 ? "dashboard-card" : ""}>
                                    <div className="card-title-regular">Rebasing...</div>
                                    {/* <div className="card-value">$205664,25</div> */}
                                </div>
                            </div>
                            <div className="dashbord-card-group">
                                <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }} className={is1280 ? "dashboard-card" : ""}>
                                    <div className="card-title-regular">SAFUU Insurance Fund Value</div>
                                    <div className="card-value">
                                        {isAppLoading ? <Skeleton width="250px" /> : (
                                            new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                maximumFractionDigits: 0,
                                                minimumFractionDigits: 0,
                                            }).format(app.sifValue)
                                        )}
                                    </div>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-title-regular">MarketCap</div>
                                    <div className="card-value">
                                        {isAppLoading ? (
                                            <Skeleton width="160px" />
                                            ) : (
                                                new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                    maximumFractionDigits: 0,
                                                    minimumFractionDigits: 0,
                                            }).format(app.marketCap)
                                        )} 
                                    </div>
                                </div>
                                <div className="dashboard-card">
                                    <div className="card-title-regular">Pool Value</div>
                                    <div className="card-value">
                                        {isAppLoading ? (
                                            <Skeleton width="250px" />
                                            ) : (
                                            new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                                maximumFractionDigits: 0,
                                                minimumFractionDigits: 0,
                                            }).format(app.bnbLiquidityValue)
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-content-wrapper" style={{ marginTop: "50px" }}>
                            <div className="dashboard-card card2">
                                <div className="card-title-regular"># Value of FirePit</div>
                                <div className="card-value">
                                    {     
                                        new Intl.NumberFormat().format(Number(`${trim(app.firepitBalance, 2)}`)) + " SAFUU"
                                    } 
                                </div>
                            </div>
                            <div className="dashboard-card card2">
                                <div className="card-title-regular">$ Value of FirePit</div>
                                <div className="card-value">
                                    {isAppLoading ? <Skeleton width="250px" /> : (
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                        }).format(app.firepitBalance * app.marketPrice)
                                    )}   
                                </div>
                            </div>
                            <div className="dashboard-card card2">
                                <div className="card-title-regular">% FirePit : Supply</div>
                                <div className="card-value">{trim(app.firepitBalance / app.totalSupply * 100,2)}%</div>
                            </div>
                        </div>
                    </div>
                </Zoom>
            </div>
        </div>
    );
}

export default Dashboard;
