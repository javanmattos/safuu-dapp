import { useEffect, useState } from "react";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { loadTokenPrices } from "../helpers";
import Loading from "../components/Loader";
import { MoralisProvider } from "react-moralis"; 

function Root() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTokenPrices().then(() => setLoading(false));
    }, []);

     if (loading) return <Loading />;

    const app = () => (
        <MoralisProvider serverUrl="https://98huydorzoxq.usemoralis.com:2053/server" appId="OFaA41T3PhiBVPHCpOghxlpHljYVeNgdaTjWF85N">
            <HashRouter>
                <App />
            </HashRouter>
        </MoralisProvider>
    );

    return app();
}

export default Root;
