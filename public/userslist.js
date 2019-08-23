  var table
   function getdata() {
    $.fn.dataTable.ext.errMode = 'none';
    table = $('#users-table').DataTable({        // users-table   table ki id hai naa ki tbody ki
      "processing" : true,
      "serverSide" : true,
      "rowId": "_id",
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
                data = '<center><i class="btn btn-primary btn-sm emailbtn actionbtns fa fa-envelope" data-toggle="modal" data-target="#sendmail" onclick=sendmail("'+row._id+'") style="background:#000; color:#fff;"></i></center>'
                else
                {
                    data = '<center><i class="btn btn-primary btn-sm emailbtn actionbtns fa fa-envelope" data-toggle="modal" data-target="#sendmail" onclick=sendmail("'+row._id+'") style="background:#000; color:#fff;"></i><i onclick=updateUser("'+row._id+'") class="btn btn-primary btn-sm editbtn actionbtns fa fa-edit" data-toggle="modal" data-target="#editModal" ></i>';
                    if(row.state==='active')
                    data = data + '<i class="btn btn-warning btn-sm activebtn actionbtns fa fa-times-circle" onclick=deactivate("'+row._id+'") ></i></center>';
                    else
                    data = data + '<i class="btn btn-success btn-sm activebtn actionbtns fa fa-check-circle" onclick=activate("'+row._id+'") ></i></center>';
                    // if(row.state==='active')
                    // data = data + '<i class="btn btn-warning btn-sm activebtn actionbtns fa fa-times-circle " data-toggle="modal" data-target="#activatemodal" onclick=deactivate("'+row._id+'","'+row.username+'",event) ></i></center>';
                    // else
                    // data = data + '<i class="btn btn-success btn-sm activebtn actionbtns fa fa-check-circle " data-toggle="modal" data-target="#activatemodal" onclick=activate("'+row._id+'","'+row.username+'",event) ></i></center>';
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

   function updateUser(_id)
   {
     $('#eheading').html("Update " +  $('#'+_id).children().eq(0).text());
 		 $('#eusername').val($('#'+_id).children().eq(0).text());
 		 $('#ephone').val($('#'+_id).children().eq(1).text());
 		 $('#ecity').val($('#'+_id).children().eq(2).text());
     $('#estatus').val($('#'+_id).children().eq(3).text());
     $('#erole').val($('#'+_id).children().eq(4).text());
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
          console.log(obj);
          updateuser(obj,function()
          {
            table.ajax.reload(null, false);
               // $('#'+_id).children().eq(0).html(obj.username);
               // $('#'+_id).children().eq(1).html(obj.phone);
               // $('#'+_id).children().eq(2).html(obj.city);
               // $('#'+_id).children().eq(3).html(obj.status);
               // $('#'+_id).children().eq(4).html(obj.role);
              // console.log(event.target);
          })
     })
   }

   function activate(_id)
   {
     $.confirm({
         title: 'Activate User ?',
         content: 'Are you sure you want to Activate ' + $('#'+_id).children().eq(0).text(),
         draggable: true,
         buttons: {
           Yes: {
                btnClass: 'btn-success',
                 action: function ()
                 {
                   var obj = Object();
                   obj._id = _id;
                   obj.state = "active";
                   updateuser(obj,function()
                   {
                     table.ajax.reload(null,false);
                    });
                 }
             },
           No: {
               btnClass: 'btn-danger',
                action: function () {}
            },
         }
       });
    }

   function deactivate(_id)
   {
     $.confirm({
         title: 'Deactivate User ?',
         content: 'Are you sure you want to Deactivate ' + $('#'+_id).children().eq(0).text(),
         draggable: true,
         buttons: {
           Yes: {
                btnClass: 'btn-success',
                 action: function ()
                 {
                   var obj = Object();
                   obj._id = _id;
                   obj.state = "notactive";
                   updateuser(obj,function()
                   {
                     table.ajax.reload(null,false);
                    });
                 }
             },
           No: {
               btnClass: 'btn-danger',
                action: function () {}
            },
         }
       });
   }

   function updateuser(obj,callback)
   {
     var request = new XMLHttpRequest()
     request.open('POST','/updateuser')
     request.setRequestHeader("Content-type","application/json")
     request.send(JSON.stringify(obj))
     request.onload = ()=>
     {
       callback();
     }
   }

   function sendmail(_id)
   {
     $('#musername').prop('readonly',false);
     $('#musername').val($('#'+_id).children().eq(0).text());
     $('#musername').prop('readonly',true);
     // $('#msubject').val('This Mail is From CQ');
     $('#sendmailbutton').click(function()
     {
       var obj = Object();
       obj.text = $('#mailcontent').val()
       obj.subject = $('#msubject').val()
       obj.username = $('#'+_id).children().eq(0).text()
       console.log(obj);
       var request = new XMLHttpRequest();
       request.open('POST','/sendmail')
       request.setRequestHeader("Content-Type","application/json");
       request.send(JSON.stringify(obj));
       request.onload = () =>
       {
           alert("mail sent");
           // $('#mailcontent').val("")
       }
     })
   }

   $(document).ready(function(){
      $.trumbowyg.svgPath="trumbowyg.svg"
      $("#mailcontent").trumbowyg();
   })
