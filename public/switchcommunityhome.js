
    // var parent-div = document.getElementById("community-lists")
  $(document).ready(function() {
    console.log("sdjkkjdkjdjkdkj");
      var p = document.getElementById("objectId")
      p = p.textContent;
      //console.log(p);
      var request1 = new XMLHttpRequest()
      request1.open('GET','/ownedCommunities');
      request1.send();
      request1.onload = function()
      {
        var data = JSON.parse(request1.responseText);
        for(var i in data)
        {
          if(data[i].communityownerid == p)
          addtoDOM1(data[i]);
          else if(data[i].communitymembershiprule == "Direct")
          addtoDOM2(data[i]);
          else if(data[i].communitymembershiprule == "Permission")
          addtoDOM3(data[i]);
        }
      }
  })

  function addtoDOM1(obj)
  {
     // console.log(obj);
    var div = '<div class="col-sm-12 col-xs-12 community-div" style="margin-top:5px;" id="">' +
                  '<div class="col-sm-1 col-xs-3" style="padding:10px;z-index:1"><a href="/community/discussions/'+obj._id+'"><img src="'+obj.communityimage+'" class="cpic"></a></div>' +
                  '<div class="col-sm-10 col-xs-7" style="padding-top:25px;padding-bottom:5px;"><p style="margin:0"><a class="comnametxt" href="/community/discussions/'+obj._id+'">'+obj.communityname+'</a>&nbsp;&nbsp;&nbsp;<a class="comnametxt-user" href="/community/manageCommunity/'+obj._id+'">Request('+obj.communityrequest.length+')</a></p></div>' +
                  '<div class="col-sm-1 col-xs-2" style="padding:0"><a class="community-short-btn" href="/community/manageCommunity/'+obj._id+'" style="float:rignt"><label class="label label-success" style="cursor:pointer !important;"><i class="fa fa-cogs"></i></label></a></div>'
              '</div>'

     $("#owned-list").append(div);
  }

  function addtoDOM2(obj)
  {
     // console.log(obj);
    var div = '<div class="col-sm-12 col-xs-12 community-div" style="margin-top:5px;" id=""><div class="col-sm-1 col-xs-3" style="padding:10px;z-index:1"><a href="#"><img src="'+obj.communityimage+'" class="cpic"></a></div><div class="col-sm-10 col-xs-7" style="padding-top:25px;padding-bottom:5px;"><p style="margin:0"><a class="comnametxt" href="#">'+obj.communityname+'</a>&nbsp;&nbsp;&nbsp;<a class="comnametxt-user" href="#">Members('+obj.communitymember.length+')</a></p></div></div>'

     $("#member-list").append(div);
  }

  function addtoDOM3(obj)
  {
     // console.log(obj);
    var div = '<div class="col-sm-12 col-xs-12 community-div" id="'+obj._id+'" style="margin-top:5px;"><div class="col-sm-1 col-xs-3" style="padding:10px;z-index:1"><a href="#"><img src="'+obj.communityimage+'" class="cpic"></a></div><div class="col-sm-10 col-xs-7" style="padding-top:25px;padding-bottom:5px;"><p style="margin:0"><a style="text-decoration:none;" href="#"><label class="label label-danger">Pending</label>&nbsp;&nbsp;&nbsp;'+obj.communityname+'</a>&nbsp;&nbsp;&nbsp;<a style="text-decoration:none;color:black;cursor:context-menu">Members('+obj.communitymember.length+')</a></p></div><div class="col-sm-1 col-xs-2" style="padding:0"><a class="community-short-btn" data-toggle="modal" data-target="#cancelRequest" onclick=cancelRequest("'+obj._id+'") style="float:right"><label class="label label-danger" style="cursor:pointer !important;"><i class="fa fa-times"></i></label></a></div></div>'

     $("#request-list").append(div);
  }

  function cancelRequest(_id)
  {
    $.confirm({
        title: 'Cancel Request',
        content: 'Do you really want cancel request',
        draggable: true,
        buttons: {
          Yes: {
               btnClass: 'btn-success',
                action: function ()
                {
                  var obj = Object();
                    obj._id = _id;
                    var request = new XMLHttpRequest();
                    request.open('POST','/cancelRequest')
                    request.setRequestHeader("content-Type","application/JSON");
                    request.send(JSON.stringify(obj));
                    request.onload = function()
                    {
                      var p = document.getElementById(_id.toString());
                       p.parentNode.removeChild(p);
                      console.log("aaagya");
                    }
                }
        },
          No: {
              btnClass: 'btn-danger',
               action: function () {}
        },
        }
      });
  }
