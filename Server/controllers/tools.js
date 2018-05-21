const mongoose = require('mongoose')
const User = mongoose.model('Users')
const jwt = require('jsonwebtoken')
const secret = require('../config/secret')
const sha256 = require('sha256')


exports.returnUserGitHub = (userGit) => {

    return new Promise((resolve,reject) => {
         User.findOne({username: userGit.login}) .exec()
        .then((user) => {
            firstname = ""
            lastname = ""
            avatar = ""
            if(user){

                if(userGit.name)
                {
                    const arr = userGit.name.split(" ")
                    if(arr.length>1)
                    {
                        firstname = arr[0]
                        lastname = arr[1]
                    }

                    else
                        firstname = arr[0]
                }

                User.update({_id: user.id},{avatar: userGit.avatar_url,lastConnection: new Date(), username: userGit.login})
                .then((usr) => {
                    const token = jwt.sign({user_id: user._id}, secret.jtw_secret)
                    resolve({token : token, created : false})})
            }
            else{
                const query = {username: userGit.login}
                if(userGit.email)
                query.email = userGit.email
                query.password = sha256(secret.seed)                
                query.fullname = userGit.name 
                query.creationDate = new Date()
                query.lastConnection = new Date()
                if(userGit.avatar_url) 
                    query.avatar = userGit.avatar_url
                query.teams=userGit.teams
                if(query.fullname)
                {
                    const arr = query.fullname.split(" ")
                    if(arr.length>1)
                    {
                        query.firstname = arr[0]
                        query.lastname = arr[1]
                    }

                    else
                        query.firstname = arr[0]
                }


                const new_user = new User(query)
                new_user.save()
                .then((user) =>{
                    const token = jwt.sign({user_id: user._id}, secret.jtw_secret)
                    resolve({token : token, created : true})
                })
                .catch((err) => {
                    console.log(err);reject(err)
                })
            }
        })
        .catch((err) => reject(err))
    })
}




