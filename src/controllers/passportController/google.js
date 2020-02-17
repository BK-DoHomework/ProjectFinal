import passport from "passport";
import passportGoogle from "passport-google-oauth";
import UserModel from "../../models/userModel";
import { transErrors, transSuccess, transMail } from "../../../lang/vi";

let GoogleStrategy = passportGoogle.OAuth2Strategy;

let ggAppId = process.env.GG_APP_ID
let ggAppSecret = process.env.GG_APP_SECRET
let ggCallbackUrl = process.env.GG_CALLBACK_URL

//khoi tao passportgGoogle

let initPassportGoogle = () => {

  passport.use(new GoogleStrategy({

    clientID: ggAppId,
    clientSecret: ggAppSecret,
    callbackURL: ggCallbackUrl,
    passReqToCallback: true // sau khi xa thuc ==> gui req vao callback

  }, async (req, access_token, refresh_token, profile, done) => {
    try {
      let user = await UserModel.findByGoogleUid(profile.id);

      if (user) {
        return done(null, user, req.flash("success", transSuccess.login_success(user.username)));
      };


      console.log(profile);
      //user su dung 1 tai khoan fb chua lan nao dang nhap vao ung dung cua chung ta

      let newUserItem = {
        username: profile. displayName,
        gender: profile.gender,
        local: {
          isActive: true
        },
        google: {
          uid: profile.id,
          token: access_token,
          email: profile.emails[0].value

        }

      };
      let newUser = await UserModel.createNew(newUserItem);
      return done(null, newUser, req.flash("success", transSuccess.login_success(newUser.username)));



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
    UserModel.findUserById(id)
      .then(user => {

        return done(null, user); //tham so loi va tham so success
      })

      .catch(error => {
        return done(error, null);

      })

  })

}
module.exports = initPassportGoogle;