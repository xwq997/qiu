/**
 * Created by SYT on 2016-07-31.
 */
var Box = document.getElementById("Box");
var loginBox = document.getElementById("loginBox");
var zhuceBox = document.getElementById("zhuceBox");
function login() {
    Box.style.visibility = "visible";
    loginBox.style.visibility = "visible"
    console.log("456")
}
function switchLogin() {
    Box.style.visibility = "visible";
    zhuceBox.style.visibility = "hidden";
    loginBox.style.visibility = "visible"
}
function switchZhuce() {
    Box.style.visibility = "visible";
    loginBox.style.visibility = "hidden";
    zhuceBox.style.visibility = "visible"
}
function zhuce() {
    Box.style.visibility = "visible";
    zhuceBox.style.visibility = "visible"
}
function close1() {
    console.log("123")
    Box.style.visibility = "hidden";
    loginBox.style.visibility = "hidden";
    zhuceBox.style.visibility = "hidden"
}
//秋秋修改 2020/8/25  登陆注册
$(function () {
    var layer = layui.layer;
    $('#loginBtn').click(function () {
        let user = $("#loginUser").val();
        let pwd = $("#loginPwd").val();
        if (user.trim().length == 0) {
            layer.alert('用户名不能为空')
        } else if (pwd.trim().length == 0) {
            layer.alert('密码不能为空')
        } else {
            //loading加载转圈那个
            var index=myloading();
            $.ajax({
                type: "post",
                url: "/userLogin",
                data: "user=" + user + "&pwd=" + pwd,
                success: function (data) {   //成功的时候调用这个函数
                    layer.close(index);
                    layer.alert(data.message);
                    if(data.code==200){
                        $('.layui-layer-btn0').click(function(){
                            location.reload();  //刷新页面
                        })
                        
                    }
                }
            })
        }
    })
    $("#zhuceBtn").click(function () {      //点击注册的时候
        var obj = { 
            "Email": "邮箱","zhuceUser": "用户名", "zhucePwd": "密码不能为空",
            "resPwd": "确认密码不能为空"
        };
        var flag = true;
        for(var key in obj) {
            if ($("#" + key).val().trim().length == 0) {
                flag = false;
                layer.alert(obj[key] + "不能为空");
                break;
            }
        }
        if (flag) {
            //发起注册操作
            var index=myloading();
            $.ajax({
                type:"post",
                url:"/reg",
                data:$("#frmReg").serialize(),//用jq的序列号把表格内容转为字符串
                success:function(data){
                    layer.close(index);     //关闭转圈圈
                    layer.alert(data);
                    if(data=="注册成功"){
                        switchLogin();
                    }
                }
            })
        }
    })
})

function myloading(){   //封装缓存转圈圈
    return layer.load(2, {
        shade: [0.5, '#000'],
        content: '',
        success: function (layero) {
            layero.find('.layui-layer-content').css({
                'paddingTop': '40px',
                'textAlign': 'center',
                'backgroundPositionX': 'center',
                'color': '#fff',
                'fontSize': '16px',
                'fontWeight': '700',
                'letterSpacing': '2px'
            });
        }
    });
}
