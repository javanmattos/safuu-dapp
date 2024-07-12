import { SvgIcon, Link } from "@material-ui/core";
import { FaTwitter, FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { BsMedium } from "react-icons/bs";
export default function Social() {
    return (
        <div className="social-row">
            <Link href="https://github.com/SafuuProtocol/Safuu" target="_blank">
                <FaTwitter />
            </Link>

            <Link href="https://twitter.com/safuuprotocol" target="_blank">
                <FaDiscord />
            </Link>

            <Link href="https://safuu.medium.com/" target="_blank">
                <FaTelegramPlane />
            </Link>

            <Link href="https://cutt.ly/bO3G0Sn" target="_blank">
                <BsMedium />
            </Link>
        </div>
    );
}
