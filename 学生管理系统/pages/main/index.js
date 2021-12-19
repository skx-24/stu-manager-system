//页面导航，页面守卫
var uname = "";
function getName() {
  return location.search.slice(1).split("=")[1];
}
uname = getName();
if (!uname) {
  location.href = "../login/index.html";
}

var stuList = [];
var appkey = "Shenkaixuan_1617890128349";
var nowPage = 1;
var size = 5;
var totalPage = 1;

//首页dom
var leftNav = document.getElementById("left-nav");
var rightContent = document.getElementById("right-content");
var tb = document.getElementsByTagName("tbody")[0];
var pageList = document.getElementById('page-list');
var pageLeft = document.getElementsByClassName('page-left')[0];
var pageRight = document.getElementsByClassName('page-right')[0];

//遮罩层dom
var model = document.getElementsByClassName("model")[0];
var editForm = document.getElementsByClassName("edit-form")[0];
var editBtn = document.getElementById("editBtn");

//新增学生dom
var addStu = document.getElementById("addStu");
var stuList = document.getElementById("stuList");
var findStu = document.getElementById("findStu");
var elem = addStu.elements;
var addBtn = document.getElementById("addBtn");
var resetBtn = document.getElementById("resetBtn");

getDataByPage();
//选项卡，利用事件捕获为每一个li添加事件
leftNav.onclick = function (e) {
  var navList = this.children;
  for (var i = 0; i < navList.length; i++) {
    navList[i].classList.remove("active");
  }
  e.target.classList.add("active");
  //把li与div关联
  var goal = e.target.getAttribute("goal");
  var contentList = rightContent.children;
  var content = rightContent.getElementsByClassName(goal)[0];
  if (content) {
    for (var i = 0; i < contentList.length; i++) {
      contentList[i].classList.remove("active-content");
    }
    content.classList.add("active-content");
  }
};
//封装表格隔行变色函数
function changeColor() {
  var oTr = document.getElementsByTagName("tr");
  for (var i = 0; i < oTr.length; i++) {
    if (i % 2 !== 0) {
      oTr[i].style.backgroundColor = "#ccc";
    } else {
      oTr[i].style.backgroundColor = "#eee";
    }
  }
}
//格式化性别
function formatSex(val) {
  return val == 1 ? "女" : "男";
}
//格式化年龄
function formatAge(val) {
  return new Date().getFullYear() - val;
}
//渲染数据
function renderTable(list) {
  tb.innerHTML = '';
  for (var i = 0; i < list.length; i++) {
    var arr = list[i];
    var tr = document.createElement("tr");
    tb.appendChild(tr);
    tr.innerHTML = `
      <td>${arr.name}</td>
      <td>${arr.sNo}</td>
      <td>${formatSex(arr.sex)}</td>
      <td>${formatAge(arr.birth)}</td>
      <td>${arr.phone}</td>
      <td>${arr.address}</td>
      <td>${arr.email}</td>
      <td>
      <button class = "modify" index=${i}>修改</button>
      <button class = "del" index=${i}>删除</button>
      </td>
    `;
  }
  changeColor();
}
//渲染分页
function renderPage(){
  pageList.innerHTML = '';
  for(var i = 1; i <= totalPage; i++){
    var liTag = document.createElement('li');
    pageList.appendChild(liTag);
    liTag.innerHTML = i;
    if(i == nowPage){
      liTag.classList.add('actived');
    }
  }
}
//分页获取数据请求
function getDataByPage(){
  ajax({
    url:'https://api.duyiedu.com/api/student/findByPage',
    type:'GET',
    params:{
      appkey:appkey,
      page:nowPage,
      size:size,
    },
    success(value){
      var res = JSON.parse(value);
      stuList = res.data.findByPage;
      totalPage = Math.ceil(res.data.cont/size);
      renderTable(stuList);
      renderPage();
    }
  })
}
//分页查询功能
pageList.onclick = function(e){
  var target = e.target;
  if(target.tagName === 'LI'){
    //切换当前页数
    nowPage = Number(target.innerHTML);
    getDataByPage();
  }
}
//上一页
pageLeft.onclick = function(){
  if(nowPage > 1){
    nowPage--;
    getDataByPage();
  }
}
//下一页
pageRight.onclick = function(){
  if(nowPage < totalPage){
    nowPage++;
    getDataByPage();
  }
}
//获取学生信息，对应展示在表单里
tb.onclick = function (e) {
  var btn = e.target;
  if (btn.classList.contains("modify")) {
    model.style.display = "block";
    var index = btn.getAttribute("index");
    console.log(index);
    var activeStu = stuList[index];
    console.log(activeStu);
    var elems = editForm.elements;
    for (var prop in activeStu) {
      if (elems[prop]) {
        elems[prop].value = activeStu[prop];
      }
    }
  }else if(btn.classList.contains('del')){
    var flag = window.confirm('确认删除吗？');
    if(flag){
      var index = btn.getAttribute('index');
      var sNo = result[index].sNo;
      ajax({
        url:'https://api.duyiedu.com/api/student/delBySno',
        type:'GET',
        params:{
          appkey:appkey,
          sNo:sNo,
        },
        success(value){
          var obj = JSON.parse(value);
          if(obj.status === 'success'){
            alert(obj.msg);
            location.reload();
          }else{
            alert('错误信息' + obj.msg);
          }
        }
      })
    }
  }
};
//新增学生发送请求
addBtn.onclick = function (e) {
  e.preventDefault();
  var stuName = elem.name.value;
  var stuNum = elem.sNo.value;
  var sex = elem.sex.value;
  var birth = elem.birth.value;
  var tel = elem.phone.value;
  var adress = elem.address.value;
  var stuMail = elem.email.value;
  ajax({
    url: "https://api.duyiedu.com/api/student/addStudent",
    type: "GET",
    params: {
      appkey: appkey,
      name: stuName,
      sNo: stuNum,
      sex: sex,
      birth: birth,
      phone: tel,
      address: adress,
      email: stuMail,
    },
    success(value) {
      var obj = JSON.parse(value);
      console.log(obj);
      if (obj.status === "fail") {
        alert("错误信息：" + obj.msg);
      } else {
        alert(obj.msg);
        addStu.reset();
      }
    },
  });
};
//查找所有学生请求
// ajax({
//   url: "https://api.duyiedu.com/api/student/findAll",
//   type: "get",
//   params: {
//     appkey: appkey,
//   },
//   success(data) {
//     var obj = JSON.parse(data);
//     result = obj.data;
//     if (obj.status == "fail") {
//       console.log("错误信息" + obj.msg);
//     } else {
//       renderTable(result);
//     }
//     changeColor();
//   },
// });
//修改学生信息请求
editBtn.onclick = function () {
  var elems = editForm.elements;
  // console.log(elem);
  var data = {};
  data.appkey = appkey;
  data.name = elems.name.value;
  data.sNo = elems.sNo.value;
  data.sex = elems.sex.value;
  data.birth = elems.birth.value;
  data.phone = elems.phone.value;
  data.address = elems.address.value;
  data.email = elems.email.value;
  ajax({
    url: "https://api.duyiedu.com/api/student/updateStudent",
    type: "GET",
    params: data,
    success(result) {
      var obj = JSON.parse(result);
      console.log(obj.data);
      if (obj.status === "fail") {
        alert("错误信息" + obj.msg);
      } else {
        alert(obj.msg);
        model.style.display = "none";
        editForm.reset();
        location.reload();
      }
    }
  });
};
//关闭遮罩层
model.onclick = function () {
  model.style.display = "none";
};
//阻止遮罩层的事件冒泡
editForm.onclick = function (e) {
  e.stopPropagation();
};

//查找学生请求
var searchInput = document.getElementById('search_input');
var searchBtn = document.getElementById('searchBtn');
searchBtn.onclick = function(){
  var keyword = searchInput.value;
  ajax({
    url:'https://api.duyiedu.com/api/student/searchStudent',
    type:'GET',
    params:{
      appkey:appkey,
      sex:'0',
      search:keyword,
      page:1  ,
      size:3,
    },
    success(val){
      var obj = JSON.parse(val);
      console.log(obj);
      stuList = obj.data.searchList;
      renderTable(stuList);
    }
  })
}



