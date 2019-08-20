  var table = document.getElementById("data")

  window.onload= ()=>
  {
    var request = new XMLHttpRequest()
    request.open('GET','/tl')
    request.send()
    request.onload = ()=> {
      var tasks = JSON.parse(request.responseText)
      for(var i in tasks)
      {
        addtoDOM(tasks[i])
      }
      update_table()

    }
  }

  function addtoDOM(obj)
  {
    var tr = document.createElement("tr")
    var tagname = document.createElement("td");
    tagname.innerHTML = obj.tagname;
    tr.appendChild(tagname)

    var tagcreator = document.createElement("td");
    tagcreator.innerHTML = obj.tagcreator;
    tr.appendChild(tagcreator)

    var tagdate = document.createElement("td");
    tagdate.innerHTML = obj.tagdate;
    tr.appendChild(tagdate)

    var deletee = document.createElement("td")
    var a = document.createElement("a")
    a.setAttribute("class","btn btn-sm deleteTagbtn")
    a.setAttribute("style","background-color:black;")
    a.setAttribute("href","#")
    a.addEventListener("click",function(event)
    {
      table.removeChild(tr);
      var obj1 = Object()
      obj1._id = obj._id;
      var request = new XMLHttpRequest()
      request.open('POST','/deletetag')
      request.setRequestHeader("Content-Type","application/json")
      request.send(JSON.stringify(obj1));
      request.onload = ()=>
      {
      	
      }
    })

    var span = document.createElement("span")
    span.setAttribute("class","fa fa-trash")
    span.setAttribute("style","color:white;")
    a.appendChild(span)
    deletee.appendChild(a)
    tr.appendChild(deletee)

    table.appendChild(tr)
  }

  function update_table()
  {
    $(document).ready(function() {
      $('#tag-list').DataTable();
    })
  }
