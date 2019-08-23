
  var tagname = document.getElementById('input-tag')
  var submit = document.getElementById('tag-sub-btn')
  submit.onclick = () =>
  {
    console.log(tagname.value);
    var date = new Date()
    console.log(date);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var hrs = today.getHours();
    var mins = today.getMinutes();
    var format="AM";
    if(hrs>12)
    {
      hrs= hrs - 12;
      format= "PM";
    }
    today = + dd + '-' + getMonths(mm) + '-' + yyyy;
    today= today + " ( " + hrs + ':' + mins + ' ' + format + " )";
    console.log(today);
    var obj = Object();
    obj.tagname = tagname.value;
    obj.tagdate = today;
    obj.tagflag = "1";
    obj.tagcreator = document.getElementById('tagcreator').innerHTML;
    console.log(obj);
    var request = new XMLHttpRequest()
    request.open('POST','/addtag')
    request.setRequestHeader("Content-Type","application/json")
    request.send(JSON.stringify(obj))
    request.onload = function()
    {
      alert("added")
      tagname.innerHTML = "";
    }
  }

  function getMonths(monthno)
  {
    var month=["Jan","Feb","Mar","Apr","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return month[monthno-1];
  }

  function opentaglist()
  {
    window.location = '/showtaglist'
  }
