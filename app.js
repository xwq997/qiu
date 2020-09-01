//引用模块
const express = require('express');
const favicon = require('serve-favicon');
const logger =require('morgan');
const bodyParser = require('body-parser');
const userRouter=require("./router/userRouter")
const cookieParser=require('cookie-parser');    //引用cookie
const ejs=require('ejs');               //引用ejs
const session=require('express-session');   //引用session
const app=express();
const viewRouter=require("./router/vierrouter");
const productRouter=require("./router/productRouter");

//======配置,日志要在静态前
app.use(logger('dev'));
app.set('views',__dirname+'/view');             //配置ejs视图路径
app.engine("html",ejs.__express);
app.set('view engine','html');                    //设置ejs模板引擎

app.use(bodyParser.json());//post配置要在路由前面
app.use(bodyParser.urlencoded({extended:false}));   //post配置
app.use(cookieParser());
app.use(session({   //配置session
    secret:'12345',     //秘钥，可以随便取
    name:'testapp',     //可以随便取
    cookie:{maxAge:900000},   //失效的时间
    rolling:true,   
    resave:true,
    saveUninitialized:true
}));
app.use(userRouter);
app.use(viewRouter);    //写在静态资源前
app.use(productRouter);

app.use(favicon(__dirname+'/public/favicon.ico'))   //设置图标
app.use(express.static(__dirname+'/public'));       //静态资源



app.listen(1234);
console.log("冲冲冲")