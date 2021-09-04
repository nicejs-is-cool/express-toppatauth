const axios = require('axios');
function createHTTPDate(a) {
	return (new Date(Date.now() + a)).toUTCString()
}

module.exports = function(appname, surl, autoLogoutOnInvalidSession = true) {
    const urlr = new URL(surl);
    const url = `${urlr.protocol}//${urlr.hostname}:${urlr.port || 80}`;
    const taUrl = "https://toppatauth.tbsharedaccount.repl.co"
    /** 
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @param {Function} next
     */
    return async function ToppatAuth(req, res, next) {
        res.authorize = function(redirect) {
            res.redirect(`${taUrl}/oauth/authorize?appName=${appname}&redirect=${url}${redirect}`);
        }
        res.storeSession = function() {
            res.set('Set-Cookie',`session=${req.query.session}`);
        }
        res.logout = function() {
            res.set('Set-Cookie',`session=logout; Expire=${createHTTPDate(-1000)}`);
        }
        if (req.query.session || req.cookies?.session) {
            let sess = req.query.session || req.cookies?.session;
            let data = (await axios.get(`${taUrl}/session/${sess}`)).data;
            if (data) {
                req.session = {session: sess, ...data};
            } else {
                if (req.cookies?.session && autoLogoutOnInvalidSession) {
                    res.logout();
                }
            }
        }
        
        next();
    }
}
module.exports.loggedInCheck = function(req, res, next) {
    if (!req.session) return res.send('You are not logged in!');
    next();
}