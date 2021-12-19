var loginBtn = document.getElementById('login-btn');
var loginForm = document.getElementById('login-form');
var appkey = 'DuYiyongzhi_1564986206465';

loginBtn.onclick = function(){
  //获取输入框的值
  var elem = loginForm.elements;
  var account = elem.account.value;
  var password = elem.password.value;

  //发送请求
  if(account && password){
    ajax({
      url:'https://api.duyiedu.com/api/student/stuLogin',
      type:'POST',
      params:{
        appkey:appkey,
        account:account,
        password:password,
      },
      success(value){
        var obj = JSON.parse(value);
        if(obj.states === 'fail'){
          alert('错误信息' + obj.msg);
        }else{
          alert(obj.msg);
          location.href = '../main/index.html?name='+ account;
        }
      }
    });
  }
}
