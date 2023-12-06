
module.exports = async (req, res, next) => {

    if(req.isAuthenticated()){
        next()
    }else {
        res.redirect('/dang-nhap')
    }
};