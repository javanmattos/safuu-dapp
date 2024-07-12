import SafuuImg from "../assets/icons-safuu/favicon.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name == "safuu") {
        return toUrl(SafuuImg);
    }
    throw Error(`Token url doesn't support: ${name}`);
}
