
function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        let err = new Error("You are not authenticated");
        err.status = 401;

        res.setHeader('WWW-Authenticate', 'Basic');
        next(err);
        return ;
    }

    const auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
    const [username, password] = auth;

    if(username === "admin" && password === "password") {
        res.cookie("user", "admin", { signed: true });
        next();
    }
    else {
        let err = new Error("You are not authenticated");
        err.status = 401;

        res.setHeader('WWW-Authenticate', 'Basic');
        next(err);
        return ;
    }
}

module.exports = auth;