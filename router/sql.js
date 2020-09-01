const mysql=require("mysql");
function Dbhelper(sql,param,callback){
    const conn=mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        post:3306,
        database:"shop"
    });
    conn.connect();
    conn.query(sql,param,callback);
    conn.end();
}
module.exports={
    query:Dbhelper
}