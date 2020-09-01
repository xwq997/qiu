const router=require("express").Router();
const db = require("./sql");
router.post("/shopcart",(req,res)=>{
    var rid=req.body.rid;
    if(req.session.user){
        let userId=req.session.info.id;
        //进行判断
        let sql2="select * from ShopCart where UserId=? and RuleId=?";
        db.query(sql2,[userId,rid],(err2,data2)=>{
            if(err2){
                console.log(err2);
            }else{
                if(data2.length>0){
                    let sql="update ShopCart set num=num+1 where UserId=? and RuleId=?";
                    db.query(sql,[userId,rid],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send({code:500,message:"数据库出错，联系管理员"})
                        }else{
                            if(data.affectedRows>0){
                                res.send({code:200,message:"加入成功"})
                            }else{
                                res.send({code:202,message:"加入失败"})
                            }
                        }
                    })
                }else{
                    let sql="INSERT INTO ShopCart(UserId,RuleId) VALUES(?,?)"
                    db.query(sql,[userId,rid],(err,data)=>{
                        if(err){
                            console.log(err);
                            res.send({code:500,message:"数据库出错，联系管理员"})
                        }else{
                            if(data.affectedRows>0){
                                res.send({code:200,message:"加入成功"})
                            }else{
                                res.send({code:202,message:"加入失败"})
                            }
                        }
                    })
                }
            }
            
        })
        
    }else{
        res.send({code:201,message:"请先登录"})
    }
})
router.post("/buildOrder",(req,res)=>{
    let sidStr=req.body.sidstr;
    let total=req.body.total;
    console.log(req.body.ridstr);
    if(req.session.user){
        let userid=req.session.info.id;
        let sql="INSERT INTO `orders` (userid,total) values(?,?)"
        db.query(sql,[userid,parseFloat(total)],(err,data)=>{
            if(err){
                console.log(err);
                res.send({code:500,message:"服务器出错"})
            }else{
                if(data.affectedRows>0){
                    let orderId=data.insertId;
                    let sql2=`INSERT INTO orderdetail(orderId,ruleId,num,price) 
                    SELECT ${orderId},s.RuleId,s.num,r.price 
                   FROM shopcart s JOIN productrule r 
                   ON s.RuleId = r.Id 
                   WHERE s.id IN (${sidStr})`;
                    db.query(sql2,[],(err2,data2)=>{
                        if(err2){
                            res.send({code:500,message:"服务器出错"})
                        }else{
                            let sql3=`delete from shopcart where id in (${sidStr})`
                            db.query(sql3,[],(err3,data3)=>{
                                if(err3){
                                    res.send({code:500,message:"服务器出错"})
                                }else{
                                    res.send({code:200,message:"订单生成成功，跳转到订单详情页"})
                                }
                            })
                        }
                    })
                }else{
                    res.send({code:202,message:"插入失败"})
                }
            }
        })
    }else{
        res.send({code:201,message:"请先登录"})
    }
    
})
module.exports = router;    //暴露