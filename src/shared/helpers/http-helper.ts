export class HttpHelper {
    httpGetAsync = async (theUrl: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        resolve(xmlHttp.responseText);
                    } else {
                        reject(`HTTP error ${xmlHttp.status}`);
                    }
                }
            }
            xmlHttp.open("GET", theUrl, true);
            xmlHttp.send(null);
        })
    }
}