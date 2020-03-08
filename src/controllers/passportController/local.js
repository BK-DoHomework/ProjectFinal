import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "../../models/userModel";
import { transErrors, transSuccess, transMail } from "../../../lang/vi";

let localStrategy = passportLocal.Strategy;

//khoi tao passportLocal

let initPassportLocal = () => {

    passport.use(new localStrategy({
            usernameField: "email",
            passwodField: "password", //su dung trong from dang nhap de cho passport biet
            passReqToCallback: true // sau khi xa thuc ==> gui req vao callback

        }, async(req, email, password, done) => {
            try {
                let user = await UserModel.findByEmail(email);
                if (!user) {
                    return done(null, false, req.flash("errors", transErrors.login_failed));
                }
                if (!user.local.isActive) {
                    return done(null, false, req.flash("errors", transErrors.account_not_active));
                }

                let checkPassword = await user.comparePassword(password);

                if (!checkPassword) {
                    return done(null, false, req.flash("errors", transErrors.login_failed));

                }

                return done(null, user, req.flash("success", transSuccess.login_success(user.username)));
            } catch (error) {

                console.log(error);

                return done(null, false, req.flash("errors", transErrors.server_erross));
            }

        }))
        //cau hinh sesstion cho phien lam viec :V
        // luu id cua user vao sesstion

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        //lay dc sesstion da luu
        UserModel.findUserByIdToUpdatePassword(id)
            .then(user => {

                return done(null, user); //tham so loi va tham so success
            })

        .catch(error => {
            return done(error, null);

        })

    })

}
module.exports = initPassportLocal;