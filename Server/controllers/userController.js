const request = require('request');
const querystring = require('querystring')
const mongoose = require('mongoose')
const User = mongoose.model('Users')
const tools = require('./tools')
const dotenv = require('dotenv').config()
const sha256 = require('sha256')
const secret = require('../config/secret')
const jwt = require('jsonwebtoken')




exports.profile = (req, res) => {
  User.findById(req.currentUser.id).exec()
  .then((user) => {
    res.status(200).send(user)
  })
  .catch((err) =>
    res.status(400).send({
      status: "400",
      message: err.message
    })
  )
}



exports.update_user = (req, res) => {
  User.findOneAndUpdate({_id: req.params.user_id}, req.body, {new: true}).exec()
  .then((user) =>{
      res.status(200).send(user)
  })
  .catch((err) =>
    res.status(400).send({
      status: "400",
      message: err.message
    })
  )
}

exports.get_all_users = (req, res) => {
  User.find({}).exec()
  .then((user) => res.status(200).json(user))
  .catch((err) =>
    res.status(404).send({
        status: "404",
        message: err.message
    })
  )
}


exports.login_Github_Callback = (req,res) => {
  const options = {
    client_id: '83c7cab8ad3cfa2173f1',
    client_secret: '81dd644c5cfe34e728ec597981fe00d9e5c81f5b',
    code: req.body.code,
    scope: 'user'
  }
  request.post({url:'https://github.com/login/oauth/access_token', form: options}, (err, response, body) => {
    if (err){
      console.log(err.message)
      res.status(400).send({
        status: "400",
        message: err.message
      })
    }
    if (!err && response.statusCode === 200){
      const req_data = querystring.parse(body)
      
      const options2 = {
        url: 'https://api.github.com/user',
        headers: {
          'Authorization': 'token ' + req_data.access_token,
          'User-Agent': 'IgDokku',
          'content-type': 'application/json'
        },
        params: {
          access_token: req_data.access_token
        }
      }

      

      request.get(options2, (error, user) => {
        let result = JSON.parse(user.body)
        

        const options3 = {
          url: "https://api.github.com/user/orgs",
          headers: {
            'Authorization': 'token ' + req_data.access_token,
            'User-Agent': 'IgDokku',
            'content-type': 'application/json'
          },
          params: {
            access_token: req_data.access_token
          }
        }
        request.get(options3,(err,orgs) => {
          const res1 = JSON.parse(orgs.body)
          console.log('res : ',res1) 

           const options4 = {
            url: `https://api.github.com/orgs/${res1[0].login}/teams`,
            headers: {
              'Authorization': 'token ' + req_data.access_token,
              'User-Agent': 'IgDokku',
              'content-type': 'application/json'
            },
            params: {
              access_token: req_data.access_token
            }
          }
          request.get(options4,(err,tms) => {
            
            result.teams=JSON.parse(tms.body)
            console.log(result.teams)
            
            if (res1.find(o => o.login == process.env.GITHUB_ORG)) {
              tools.returnUserGitHub(result)
          .then((res2) => {
            
              res.status(res2.created ? 201 : 200).send({token: res2.token})
          })
          .catch((err) =>
            res.status(400).send({
              status: "400",
              message: err.message
            })
          )
          }
          else {
            res.status(400).send({message:`not in organization ${process.env.GITHUB_ORG}`})
            console.log(`not in organization ${process.env.GITHUB_ORG}`)
          }
          }) 



          
          
        })

      })

    }
  })       
}

exports.login = (req, res) => {
  const password_crypt = sha256(req.body.password+secret.seed)
  User.findOne({username: req.body.login, password: password_crypt}).exec()
  .then((user) => {
      if(user){
        const token = jwt.sign({user_id: user._id}, secret.jtw_secret)
        res.status(200).send({token:  token})
      }
      else{
        User.findOne({email: req.body.login, password: password_crypt}).exec()
        .then((user) => {
          if(user){
            const token = jwt.sign({user_id: user._id}, secret.jtw_secret)
            res.status(200).send({token: token})
          }
          else
            res.status(404).send({ 
              status: "404",
              message: "Invalid Credentials"
            })
        })
        .catch((err) =>{
          console.log(err)
          res.status(400).send({ 
            status: "400",
            message: "Invalid Credential"
          })
        }
        )
      }
  })
  .catch(() =>
    res.status(400).send({
      status: "400",
      message: "Invalid Credentials"
    })
  )
}

exports.update_password = (req, res) => {
  User.findById(req.params.user_id).exec()
  .then((user) => {
    if(sha256(req.body.oldPassword+secret.seed) === user.password){
      User.update({_id: user.id},{password: sha256(req.body.newPassword+secret.seed)})
      .then(() => {
        res.status(200).send({ 
          status: "200", 
          message: "Password successfully updated"
        })
      })
      .catch((err) =>
        res.status(400).send({
          status: "400",
          message: err.message
        })
      )
    }
    else
      res.status(403).send({
        status: "403",
        message: "Old password does not match"
      })
  })
}

