const router = require("express").Router();
const db = require("./sql");
// router.get("/index.html", (req, res) => {//主页的显示，sql是轮播，sql2是商品显示
//     let sql = "select * from Banner where keyName='lun'";
//     db.query(sql, [], (err, data) => {
//         let sql2 = `SELECT product.*,productrule.Id AS rid FROM  product JOIN 
//         productrule ON product.id=productrule.productId
//         WHERE isDefault=1 AND isNew=1`
//         db.query(sql2, [], (err2, data2) => {
//             if (req.session.user) {       //如果你登录了，就显示下面的
//                 res.render("index", {
//                     user: req.session.user, headImage: req.session.info.HeadImage,
//                     lunbo: data, newList: data2
//                 })
//             } else {
//                 res.render("index", { user: req.session.user, lunbo: data, newList: data2 });
//             }
//         })

//     })
// })
router.get("/product.html", (req, res) => {
    res.render("chanping")
})
router.get("/user.html", (req, res) => {
    let sql = "select *from user";
    db.query(sql, [], function (err, data) {
        res.render("user", { userList: data })
    });

})
router.get('/', (req, res) => {//设置跳转页面简写
    res.redirect('/index.html');
})
router.get("/productDetail.html", (req, res) => {//设置显示详情页
    let rid = req.query.id;
    let sql = `SELECT *,r.Id AS rid FROM product AS p JOIN productrule AS r 
    ON p.Id=r.productId WHERE r.Id=?`;
    db.query(sql, [rid], (err, data) => {
        res.render("productDetail", {info:data[0],
            user:req.session.user,
            headImage:req.session.headImage})
    })

})





// ======================promise方法写显示首页=============================


function getBanner() {
    return new Promise((resolve, reject) => {
        let sql = "select * from Banner where keyName='lun'";
        db.query(sql, [], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}
function getNewList() {
    return new Promise((resolve, reject) => {
        let sql2 = `SELECT product.*,productrule.Id AS rid FROM  product JOIN 
        productrule ON product.id=productrule.productId
        WHERE isDefault=1 AND isNew=1`
        db.query(sql2, [], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}
router.get("/index.html", async (req, res) => {//主页的显示
    let bannerList = await getBanner();
    let newList = await getNewList();
    if (req.session.user) {       
        res.render("index", {
            user: req.session.user, headImage: req.session.info.HeadImage,
            lunbo: bannerList, newList: newList
        })
    } else {
        res.render("index", { user: req.session.user, lunbo: bannerList, newList: newList });
    }
})
router.get("/cart.html",(req,res)=>{
    if(req.session.user){
        let userId=req.session.info.id;
        let sql=`SELECT s.id AS sid, p.feng,p.title,r.price,s.num,r.Id AS rid FROM shopcart s JOIN productrule r 
        ON s.RuleId=r.Id JOIN product p 
        ON r.ProductId=p.Id where s.userid=?`;
        db.query(sql,[userId],(err,data)=>{
            res.render("cart",{user:req.session.user,
            headImage:req.session.headImage,
            productList:data})
        })
    }else{
        res.redirect("/index.html")
    }
    
})









module.exports = router;    //暴露