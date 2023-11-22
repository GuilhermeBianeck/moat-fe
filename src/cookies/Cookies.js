// TODO: Cookie refreshing as 400 day Chrome limit.
class Cookies {
    COOKIE_MAX_AGE = "2147483647";
    COOKIE_PATH = "/";

    constructor() {
    }

    setCookie = (name, value) => {
        console.log("Setting cookie: " + name + "=" + value);

        if (name == undefined || name == null ||
                value == undefined || value == null) {
            console.log("Error setting cookie!");

            return;
        }

        let cName = encodeURIComponent(name);
        let cValue = encodeURIComponent(value);

        let cookieString =
            `${cName}=${cValue}; max-age=${this.COOKIE_MAX_AGE}; path=${this.COOKIE_PATH};`;

        document.cookie = cookieString;
    }

    /**
     * Returns a cookie with the specified name. 
     * 
     * @param name The name of the cookie.
     * @returns The value of the cookie or 'null' if not found.
     */
    getCookie = (name) => {
        let decodedCookies = decodeURIComponent(document.cookie);

        let cookieArray = decodedCookies.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            cookie = cookie.trim();

            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length + 1, cookie.length);
            }
        }

        return null;
    }

    deleteCookie = (name) => {
        console.log("Deleting cookie: " + name);

        let cName = encodeURIComponent(name);
        let cookieString = `${cName}=0; max-age=0; path=${this.COOKIE_PATH}`;

        document.cookie = cookieString;
    }
}

export default Cookies;