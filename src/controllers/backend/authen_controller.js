const routerName = 'authen';
const renderName = `backend/page/${routerName}/`;

const linkPrefix = `/dhuy782/authen/`

const util = require('util')
var passport = require('passport');


const notify = require(`${__path_configs}notify`)
const paramsHelpers = require(`${__path_helpers}params`)
const {validationResult} = require('express-validator')

const AuthenService = require(`${__path_services}backend/account_service`);


module.exports = {
    saveSignup: async (req , res , next) => {
        const { data, code, user_code } = req.body
        if (code === user_code) {
            const newdata = JSON.parse(data);
            newdata.lastDateLogin = new Date()
            await AuthenService.addItem(newdata)
    
            req.flash('success', notify.SUCCESS_SIGNUP)
            res.redirect(`/dang-nhap`)
        } else {
            req.flash('danger', notify.ERROR_CHECK_CODE)
            res.redirect(`/dang-ky/ma-kich-hoat`)
        }
    },

    checkLogin: async (req , res , next) => {
        let data = {}
        data.username = req.body.username
        data.lastDateLogin = new Date()
        await AuthenService.updateLastLogin(data)

        passport.authenticate('local', { 
            successRedirect: '/',
            failureRedirect: '/dang-nhap',
            failureFlash: true
        })(req , res , next);
    },

    checkLogout : async (req , res , next) => {
        let data = {}
        data.username = req.user.username
        data.lastDateLogin = new Date()
        await AuthenService.updateLastLogin(data)

        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/dang-nhap');
          });
    },

}
