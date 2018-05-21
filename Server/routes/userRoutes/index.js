module.exports = (router) => {
    

    const users = require('../../controllers/userController')
    const middlewareToken = require('../../middleware/checkProcessAuth/checkTokenUser')
    const middlewareProfile = require('../../middleware/checkParamRequest/checkProfileParam')
    const middlewareAuth = require('../../middleware/checkProcessAuth/checkAuthBody')

    
    router.route('/profile/:user_id').get([middlewareToken.checkToken, middlewareProfile.idMatchCurrentUser],users.profile)
    
    router.route('/users/:user_id').put([middlewareToken.checkToken, middlewareProfile.idMatchCurrentUser],users.update_user)

    router.route('/oauth_github').post(users.login_Github_Callback)

    router.route('/users/:user_id/change-password').put([middlewareToken.checkToken, middlewareProfile.idMatchCurrentUser],users.update_password)


    router.route('/login').post([middlewareAuth.checkLoginBody],users.login)
    router.route('/users').get(users.get_all_users)

}