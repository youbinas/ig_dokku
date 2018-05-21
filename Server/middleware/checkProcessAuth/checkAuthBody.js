exports.checkLoginBody = (req, res, next) => {
    if(req.body.login){
        if(req.body.password)
            next()
        else
            res.status(400).send({
                status: "400",
                message: "Missing password"
            })
    }
    else
        res.status(400).send({
            status: "400",
            message: "Missing credential(s)"
        })
}

