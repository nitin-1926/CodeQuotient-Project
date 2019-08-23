
  var table;
   function getdata() {
    $.fn.dataTable.ext.errMode = 'none';
    table = $('#tags-list').DataTable({
      "processing" : true,
      "serverSide" : true,
      "rowId" : "_id",
      "ajax": {
        "url":"/tl",
        "type":"POST",
      },
      "columns": [
      {
        "data" : "tagname"
      },
      {
        "data" : "tagcreator",
      },
      {
        "data" : "tagdate"
      },
      {
        "data" : null,
        "sorting" : "false",
      }
    ],
    "columnDefs": [{
            "targets": 3,

            "render": function (data, type, row, meta) {
              // console.log(data._id);
                data = '<center><a onclick=deleteTag("'+data._id+'") class="btn btn-sm deleteTagbtn" style="background-color:black" ><span class="fa fa-trash" style="color:white;"></span></a></center>'
                return data;
            }
        }],
    })

    $('#refresh').on('click', function () {
        table.ajax.reload(null, false);
    });

}

  $(document).ready(function() {
    console.log("1");
    getdata()
  })

   function deleteTag(id)
   {
     console.log(event.target);
     console.log(id);
      $.confirm({
         title: 'Delete Tag!',
         content: 'Are you sure you want to delete',
         draggable: true,
         buttons: {
             Yes: {
                 btnClass: 'btn-success',
                 action: function () {
                   var obj = {
                     _id : id,
                   }
                   let request = new XMLHttpRequest();
                   request.open('POST','/deleteTag');
                   request.setRequestHeader("Content-Type","application/json")
                   request.send(JSON.stringify(obj));
                   request.onload = function()
                   {
                     alert("tag deleted");
                     $('#'+id).remove();
                   }
                 }
             },
             No: {
               btnClass: 'btn-danger',
               action : function() {},
           },
         }
     });
   }
