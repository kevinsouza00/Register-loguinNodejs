const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) return res.status(401).json({ message: "Acesso negado" });
        const token = authorization.split(" ")[1];
        const tk = jwt.verify(token, process.env.SECRET);
        req.userId = tk.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Acesso negado!" });
    }
}

module.exports = auth;