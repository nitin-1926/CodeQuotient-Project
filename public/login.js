  var username = document.getElementById("username")
  var password = document.getElementById("password")
  var login = document.getElementById("submit")
  login.addEventListener("click",function()
  {
      console.log("hello");
      var obj = new Object();
      obj.username = username.value;
      obj.password = password.value;
      console.log(obj);
      var request = new XMLHttpRequest();
      request.open('POST','/login');
      request.setRequestHeader("Content-Type","application/json");
      request.send(JSON.stringify(obj));
      request.onload = () =>
      {
          if(request.responseText=='0000')
          {
            console.log("hello");
            window.location = '/notactive'
          }
          else if(request.responseText=='0')
          {
            document.getElementById("wrong").style.display = "block"
          }
          else
          {
            console.log('dsdssssssss');
            window.location = '/home'
          }
      }
  })
