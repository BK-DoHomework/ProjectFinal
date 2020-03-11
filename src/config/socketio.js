import passportSocketIo from "passport.socketio";



let configSocketIo = (io, cookieParser, sesstionStore) => {
	io.use(passportSocketIo.authorize({
		cookieParser: cookieParser, // the same middleware you registrer in express
		key: process.env.SESSTION_KEY, // the name of the cookie where express/connect stores its session_id
		secret: process.env.SESSTION_SECRET, // the session_secret to parse the cookie
		store: sesstionStore, // we NEED to use a sessionstore. no memorystore please
	}));
}
module.exports = configSocketIo;