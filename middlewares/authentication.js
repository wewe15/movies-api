const jwt = require ('jsonwebtoken');
const dotenv = require ('dotenv');


dotenv.config()

const authAdmin = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        if (token){
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode
            if (decode.role === 'admin'){
                next()
            } else {
                res.status(401);
                res.json({erorr: 'Not allowed'});
            }
        } else {
            res.status(401);
            res.json({erorr: 'please try again'});
        }

    } catch (err) {
        res.status(401);
        res.json({erorr: 'please try again'});
    }
}

const authUser = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        if (token){
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode
            if (decode.role === 'user' || decode.role === 'admin'){
                next()
            } else {
                res.status(401);
                res.json({erorr: 'Not allowed'});
            }
        } else {
            res.status(401);
            res.json({erorr: 'please try again'});
        }

    } catch (err) {
        res.status(401);
        res.json({erorr: 'please try again'});
    }
}

module.exports = {
    authAdmin,
    authUser
};
