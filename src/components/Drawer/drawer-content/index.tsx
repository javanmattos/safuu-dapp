import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAddress } from "../../../hooks";
import { trim, shorten } from "../../../helpers";
import { Link } from "@material-ui/core";
import classnames from "classnames";
import DashboardIcon from "../../../assets/icons-safuu/dashboard-icon.png";
import AccountIcon from "../../../assets/icons-safuu/account-icon.png";
import CalculatorIcon from "../../../assets/icons-safuu/calculator-icon.png";
import SwapIcon from "../../../assets/icons-safuu/swap-icon.png";
import DocsIcon from "../../../assets/icons-safuu/docs-icon.png";
import AnalysisIcon from "../../../assets/icons-safuu/analysis-icon.png";
import LogoImg from "../../../assets/icons-safuu/safuu-logo.png";
import "./drawer-content.scss";

function NavContent() {
    const [isActive] = useState(false);
    const address = useAddress();

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
            return true;
        }
        if (currentPath.indexOf("calculator") >= 0 && page === "calculator") {
            return true;
        }
        if (currentPath.indexOf("account") >= 0 && page === "account") {
            return true;
        }
        if (currentPath.indexOf("swap") >= 0 && page === "swap") {
            return true;
        }
        if (currentPath.indexOf("analytics") >= 0 && page === "analytics") {
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div>
                <div className="sidebar-logo">
                    <img src={LogoImg} alt="" />
                    {address && (
                        <div className="wallet-link">
                            <Link href={`https://bscscan.com/address/${address}`} target="_blank">
                                <p>{shorten(address)}</p>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="dapp-menu-links">
                    <div className="dapp-nav">
                        <Link
                            component={NavLink}
                            to="/dashboard"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "dashboard");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img src={DashboardIcon} alt="DashboardIcon" />
                                <p>Dashboard</p>
                            </div>
                        </Link>
                        <Link
                            component={NavLink}
                            to="/account"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "account");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img src={AccountIcon} alt="DashboardIcon" />
                                <p>Account</p>
                            </div>
                        </Link>
                        <Link
                            component={NavLink}
                            to="/swap"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "swap");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img src={SwapIcon} alt="DashboardIcon" />
                                <p>Swap</p>
                            </div>
                        </Link>
                        <Link
                            component={NavLink}
                            to="/calculator"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "calculator");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img src={CalculatorIcon} alt="DashboardIcon" />
                                <p>Calculator</p>
                            </div>
                        </Link>
                        <Link
                            component={NavLink}
                            to="/analytics"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "analytics");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img src={AnalysisIcon} alt="DashboardIcon" />
                                <p>Analytics</p>
                            </div>
                        </Link>

                        <Link
                            href="https://safuuprotocol.gitbook.io/safuuprotocol/"
                            target="_blank"
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img src={DocsIcon} alt="DashboardIcon" />
                                <p>Docs</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavContent;
