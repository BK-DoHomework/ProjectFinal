# config database environment variable
  export DB_CONNECTION=mongodb
  export DB_HOST=localhost
  export DB_PORT=27017
  export DB_NAME=DoAnTotNghiep
  export DB_USERNAME=""
  export DB_PASSWORD=""

# config app environment variable
export APP_HOST=localhost
export APP_PORT=8017


#config key section
export SESSTION_KEY="hustdev"
export SESSTION_SECRET="mySecret"

# config app email admin
export MAIL_USER=husthunter97@gmail.com
export MAIL_PASSWORD=boybathanh
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587


#config login facebook app

export FB_APP_ID=553403601933333
export FB_APP_SECRET=2ef085f47d99275c65b464353b643ccb
export FB_CALLBACK_URL=https://localhost:8017/auth/facebook/callback

#sau khi fb xac thuc xong no se goi tro lai cai app cua chung ta


#config login GG app

export GG_APP_ID=973789902387-5l6dcv43vtpvsma1ian1lb2e6ob2n29j.apps.googleusercontent.com
export GG_APP_SECRET=iuHPFvDeEYDpGc3Ydje05lf0
export GG_CALLBACK_URL=https://localhost:80/auth/google/callback

#sau khi GG xac thuc xong no se goi tro lai cai app cua chung ta
