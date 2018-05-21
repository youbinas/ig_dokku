const mongoose = require('mongoose')
const User = mongoose.model('Users')
const jwt = require('jsonwebtoken')
const secret = require('../../config/secret')

exports.checkToken = (req, res, next) => {
  if(req.headers['authorization']){
    const tokenHeader = req.headers['authorization'].split(' ')
    if(tokenHeader.length===2){
      const token = tokenHeader[1]

      if (token) {
        jwt.verify(token, secret.jtw_secret, (err, decoded) => {
          if (err)
            res.status(401).send({
              status: "401",
              message: 'Failed to authenticate'
            })
          else {
            User.findById(decoded.user_id, '-password').exec()
            .then((user) => {
              if(user.id) {
                req.currentUser = user
                next()
              }else {
                res.status(401).send({
                  status: "401",
                  message: 'Failed to authenticate'
                })
              }
            })
            .catch(() =>
              res.status(401).send({
                status: "401",
                message: 'Failed to authenticate'
              })
            )
          }
        })
      }
      else {
          res.status(401).send({
            status: "401",
            message: "No token provided"
          })
      }
    }
    else
      res.status(401).send({
        status: "401",
        message: 'Failed to authenticate'
      })
  }
  else {
    res.status(401).send({
      status: "401",
      message: "No token provided"
    })
  }
}