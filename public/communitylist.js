
   function getdata() {
     console.log("hello");
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#community-table').DataTable({
      "processing" : true,
      "serverSide" : true,
      "ajax": {
        "url":"/cl",
        "type":"POST",
        "data" : function(d) {
          d.communitymembershiprule= $('#membership-select').val();
        }
      },
      "columns": [
      {
        "data" : "communityname",
      },
      {
        "data" : "communitymembershiprule",
         "sorting" : "false"
      },
      {
        "data" : "communitylocation"
      },
      {
        "data" : "communityowner",
      },
      {
        "data" : "communitycreatedate",
      },
      {
        "data" : null,
        "sorting" : "false"
      },
      {
        "data" : null,
        "sorting" : "false"
      },
    ],
    "columnDefs": [{
            "targets": 6,

            "render": function (data, type, row, meta) {
                data ='<img src="'+row.communityimage+'" style="width:80px; height:80px; border:4px solid red;"></img>'
               return data;
            }

        },{
          "targets" : 5,

          "render" : function (data,type,row,meta) {
            data = '<center><a class="btn btn-sm editbtn actionbtns" data-target="#updateCommunity" data-toggle="modal" onclick=editCommunity("'+row.communitycreatedate+'","'+row.communityowner+'","' + encodeURIComponent(row.communityname) + '","' + encodeURIComponent(row.communityconfirm) + '","'+row._id+'") style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-edit"></span></a><a class="btn btn-sm infobtn actionbtns" onlcick=showComminfo("' + encodeURIComponent(row.communityname) + '", "' + row.communityname + '" ,"' + encodeURIComponent(row.communitydescription) + '")  data-toggle="modal" data-target="#CommunityInfo" style="margin-top:35px;background-color: #2D312C;color: #fff"><span class="fa fa-info"></span></a></center>'
            return data;
          }
        }],
    })

    $('#membership-select').on('change', function () {
	    table.ajax.reload(null, false);
  	});

    $('#refresh').on('change', function () {
	    table.ajax.reload(null, false);
  	});

  	}

  $(document).ready(function() {
    console.log("1");
    getdata()
  })

  function editCommunity(obj,commo,commn,comms,_id)
  {
      commn = decodeURIComponent(commn)
      comms = decodeURIComponent(comms)
      $('#CommunityNamePop').html("Update " + commn);
      $('#CommunityAdminPop').html("Created by " + commo + "," + obj);
      $('#CommuityName').val(commn);
      $('#communityStatus').val(comms);
      $('#editsubmit').off('click').on('click', function() {
        var obj = Object();
        obj._id = _id;
        obj.communityname = $('#CommuityName').val();
        obj.communityconfirm = $('#communityStatus').val();
        var request = new XMLHttpRequest()
        request.open('POST','/updateCommunity')
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify(obj));
        request.onload = function ()
        {
          alert('Requested Communtiy Updated');
        }
      });
  }

  function showComminfo(commn,i,commd)
  {
    commn = decodeURIComponent(commn)
    commd = decodeURIComponent(commd)
  }
