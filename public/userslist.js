   function getdata() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#users-table').DataTable({
      "processing" : true,
      "serverSide" : true,
      "ajax": {
        "url":"/ul",
        "type":"POST",
        "data" : function(d) {
          d.status= $('#status-select').val();
          d.role= $('#role-select').val();
        }
      },
      "columns": [
      {
        "data" : "username"
      },
      {
        "data" : "phone",
        "sorting" : "false"
      },
      {
        "data" : "city"
      },
      {
        "data" : "status",
        "sorting" : "false",
      },
      {
        "data" : "role",
        "sorting" : "false",
      },
      {
        "data" : null,
        "sorting" : "false"
      },
    ],
    "columnDefs": [{
            "targets": -1,

            "render": function (data, type, row, meta) {
                var r = row.role;
                if(r=='superadmin')
                data = '<center><i class="btn btn-primary btn-sm emailbtn actionbtns fa fa-envelope " data-toggle="modal" data-target="#sendmail" onclick=sendmail("'+row.username+'") " style="background:#000; color:#fff;"></i></center>'
                else
                {
                    data = '<center><i class="btn btn-primary btn-sm emailbtn actionbtns fa fa-envelope " data-toggle="modal" data-target="#sendmail" onclick=sendmail("'+row.username+'") " style="background:#000; color:#fff;"></i><i onclick=updateUser("'+row._id+'","'+row.username+'","'+row.phone+'","'+row.city+'","'+row.status+'","'+row.role+'") class="btn btn-primary btn-sm editbtn actionbtns fa fa-edit" data-toggle="modal" data-target="#editModal" ></i>';
                    if(row.state==='active')
                    data = data + '<i class="btn btn-warning btn-sm activebtn actionbtns fa fa-times-circle " data-toggle="modal" data-target="#activatemodal" onclick=deactivate("'+row._id+'","'+row.username+'",event) ></i></center>';
                    else
                    data = data + '<i class="btn btn-success btn-sm activebtn actionbtns fa fa-check-circle " data-toggle="modal" data-target="#activatemodal" onclick=activate("'+row._id+'","'+row.username+'",event) ></i></center>';
                    }
                return data;
            }
        }],
    })

    $('#role-select').on('change', function () {
	    table.ajax.reload(null, false);
  	});

  	$('#status-select').on('change', function () {
  	    table.ajax.reload(null, false);
  	});

  	$('#refresh').on('click', function () {
  	    table.ajax.reload(null, false);
  	});

}

  $(document).ready(function() {

    console.log("1");
    getdata()

  })

   function updateUser(_id,username,phone,city,status,role)
   {
     $('#eheading').html("Update " + username);
 		 $('#eusername').val(username);
 		 $('#ephone').val(phone);
 		 $('#ecity').val(city);
     $('#estatus').val(status);
     $('#erole').val(role);
     $('#editsubmit').click(function()
     {
         var obj = {
            _id :  _id,
           username : $("#eusername").val(),
           phone : $("#ephone").val(),
           city : $("#ecity").val(),
           status : $("#estatus").val(),
           role : $("#erole").val()
         }
         $.ajax({
           url : '/updateuser',
           type : 'post',
           dataType : 'json',
           contentType : 'application/json',
           success : function (err,data) {
             if(err)
             throw err;
             else {
               console.log(data.msg);
             }
           },
           data : JSON.stringify(obj)
         })
     })
   }

   function activate(_id,username,event)
   {
      $('#activatemodal-title').html("Activate User?")
      $('#activatemodal-body').html("Are you sure you want to activate " + username)
      var ele = event.target;
      var obj = Object();
      obj._id = _id;
      obj.state = "active";
      $('#yes-active').click(function()
      {
         var request = new XMLHttpRequest()
         request.open('POST','/updateuser')
         request.setRequestHeader("Content-type","application/json")
         request.send(JSON.stringify(obj))
         request.onload = ()=>
         {
           ele.classList.remove('fa-check-circle')
           ele.classList.add('fa-times-circle')
           ele.classList.remove('btn-success')
           ele.classList.add('btn-warning')
           $("this").attr("onclick",deactivate+"('+_id+',"+"'+username+'"+"'+event+')");
         }
      })
   }

   function deactivate(_id,username,event)
   {
     $('#activatemodal-title').html("Deactivate User?")
     $('#activatemodal-body').html("Are you sure you want to deactivate " + username)
     var ele = event.target;
     var obj = Object();
     obj._id = _id;
     obj.state = "notactive";
     $('#yes-active').click(function()
     {
        var request = new XMLHttpRequest()
        request.open('POST','/updateuser')
        request.setRequestHeader("Content-type","application/json")
        request.send(JSON.stringify(obj))
        request.onload = ()=>
        {
          ele.classList.remove('fa-times-circle')
          ele.classList.add('fa-check-circle')
          ele.classList.remove('btn-warning')
          ele.classList.add('btn-success')
          $("this").attr("onclick",activate+"('+_id+',"+"'+username+'"+"'+event+')");
        }
     })
   }

   function sendmail(username)
   {
     $('#musername').prop('readonly',false);
     $('#musername').val(username);
     $('#musername').prop('readonly',true);
     $('#sendmailbutton').click(function()
     {
       var obj = Object();
       obj.text = $('#mailcontent').val()
       obj.subject = $('#msubject').val()
       obj.username = username
       console.log(obj);
       var request = new XMLHttpRequest();
       request.open('POST','/sendmail')
       request.setRequestHeader("Content-Type","application/json");
       request.send(JSON.stringify(obj));
       request.onload = () =>
       {
           alert("mail sent");
       }
     })
   }

   $(document).ready(function(){
      $.trumbowyg.svgPath="trumbowyg.svg"
      $("#mailcontent").trumbowyg();
   })
