import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "../../models/userModel";
import ChatGroupModel from "../../models/chatGroupModel";
import { transErrors, transSuccess, transMail } from "../../../lang/vi";

let FacebookStrategy = passportFacebook.Strategy;

let fbAppId = process.env.FB_APP_ID
let fbAppSecret = process.env.FB_APP_SECRET
let fbCallbackUrl = process.env.FB_CALLBACK_URL

//khoi tao passportFacebook

let initPassportFacebook = () => {

	passport.use(new FacebookStrategy({

		clientID: fbAppId,
		clientSecret: fbAppSecret,
		callbackURL: fbCallbackUrl,
		profileFields: ["email", "gender", "displayName"], // cac truong ban muon lay tren fb ve may
		passReqToCallback: true // sau khi xa thuc ==> gui req vao callback

	}, async (req, accessToken, refeshToken, profile, done) => {
		try {
			let user = await UserModel.findByFacebookUid(profile.id);

			if (user) {
				return done(null, user, req.flash("success", transSuccess.login_success(user.username)));
			};


			console.log(profile);
			//user su dung 1 tai khoan fb chua lan nao dang nhap vao ung dung cua chung ta

			let newUserItem = {
				username: profile.displayName,
				gender: profile.gender,
				local: {
					isActive: true
				},
				facebook: {
					uid: profile.id,
					token: accessToken,
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

	passport.deserializeUser(async (id, done) => {
		//lay dc sesstion da luu
		try {
			let user = await UserModel.findUserByIdToUpdatePassword(id);
			let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);

			user = user.toObject();
			user.chatGroupIds = getChatGroupIds;
			return done(null, user); //tham so loi va tham so success
		} catch (error) {
			return done(error, null);
		}

	})

}
module.exports = initPassportFacebook;