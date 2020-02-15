var express = require("express"); //nạp thư viện express
var app = express();


const hostname = 'localhost';
const port = 8017;
//viet router helloWorld

app.get('/helloworld',(req ,res) => {
  res.send("<h1>HelloWorld !!!</h1>")
});

// lang nghe ung dung

app.listen(port,hostname, () => {
  console.log(`hello thuong , ban dang o ${hostname} : ${port}/`);

});