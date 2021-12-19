var username = document.getElementById('username');
var tips = document.getElementById('tips');
var errorMsg = document.getElementById('errorMsg');
var registerBtn = document.getElementById('register-btn');
var registerForm = document.getElementById('regist-form');
var appkey = 'DuYiyongzhi_1564986206465';

username.addEventListener('focus',function(){
  tips.style.display = 'block';
  errorMsg.style.display = 'none';
  this.classList.remove('error_active');
},false);

username.addEventListener('blur',function(){
  tips.style.display = 'none';
  var value = computeLength(this.value);
  var msg = '';
  if(value > 14){
    msg = '用户名超出14个英文或7个汉字';
  }else if(value == null){
    msg = '输入字符不合法，请输入数字字母以及汉字';
  }
  if(msg !== ''){
    errorMsg.style.display = 'block';
    errorMsg.innerHTML = msg;
    this.classList.add('error_active');
  }
},false);

//计算输入字符长度
function computeLength(str){
  var num = 0;
  for(var i = 0; i < str.length; i++){
    var curChar = str.charCodeAt(i);
    if((curChar >= 97 && curChar <=122) || (curChar >= 65 && curChar <=90) || (curChar >=48 && curChar <=57)){
      num += 1;
    }else if(curChar >= 19968){
      num += 2;
    }else{
      return null;
    }
  }
  return num;
}

//注册事件
registerBtn.onclick = function(e){
  //取消默认事件
  e.preventDefault();
  //获取表单属性的值,通过input的id
  var elem = registerForm.elements;
  var username = elem.username.value;
  var account = elem.account.value;
  var password = elem.password.value;
  var repassword = elem.repassword.value;
  //ajax发送数据
  ajax({
    url: 'https://api.duyiedu.com/api/student/stuRegister', // 请求路径
    type: 'POST', // 请求方法
    params: {
      appkey: appkey,
      username: username,
      account: account,
      password: password,
      rePassword: repassword,
    },
    success(value) {
      // JSON.parse() => JSON 文本 => 对象（对象（key :value)和数组）
      // JSON.stringify => 对象 => JSON 字符串
      var obj = JSON.parse(value);
      if (obj.status === 'fail') {
        alert('错误信息：'+ obj.msg);
      } else {
        alert(obj.msg);
        location.href = '../login/index.html';
        registerForm.reset();
      }
    },
  });
}