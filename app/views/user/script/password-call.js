var COUNTDOWN=60; 
var COUMIN=10; 

//验证码读秒
function settime(val) { 
    if (COUNTDOWN == 0) { 
        val.removeAttribute("disabled");
        val.value="发送验证码"; 
        val.className ='btn-second width-120 mrg10L pull-left';
        COUNTDOWN = 60; 
    } else { 
        val.setAttribute("disabled", true); 
        val.className ='validate-phone btn-second width-120 mrg10L pull-left';
        val.value="重新发送(" + COUNTDOWN + ")"; 
        COUNTDOWN--; 
        setTimeout(function() { 
            settime(val);
        },1000) 
    } 
} 
//跳转登录读秒
function outtime(){ 
    if (COUMIN == 0) { 
        window.location.href="login";
        COUMIN = 10; 
    } else { 
        $('.minu').text("自动跳转(" + COUMIN + ")"); 
        COUMIN--; 
        setTimeout(function() { 
            outtime();
        },1000);
    } 
}
//手机号&ID验证
function setPhone(val) {
    var phone = $("input[name=phone]").val();
    var phonel = $("input[name=phone]");
    var error = $('.callPwd-from-tip-error.phone');
    if(phone == '13051443788'){
        error.hide();
        phonel.removeClass('error');
        settime(val);
    }else{
        error.show();
        phonel.addClass('error');
        error.find('span').text('关联手机号不正确');
    }
}

