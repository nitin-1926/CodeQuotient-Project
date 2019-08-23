  var data;

  function hello()
  {
    console.log("hello");
  }

  function showUsers()
  {
    $('.manageCommunity-btn-active').removeClass('manageCommunity-btn-active');
    $('#UsersShowBtn').addClass('manageCommunity-btn-active')
   $('#userlist').show();
   $('#invitationlist').hide();
   $('#requestlist').hide();
   $('#managerlist').hide();
  }

  function showManager()
  {
    $('.manageCommunity-btn-active').removeClass('manageCommunity-btn-active');
    $('#AdminsShowBtn').addClass('manageCommunity-btn-active')
    $('#userlist').hide();
    $('#invitationlist').hide();
    $('#requestlist').hide();
    $('#managerlist').show();
  }

  function showRequest()
  {
    $('.manageCommunity-btn-active').removeClass('manageCommunity-btn-active');
    $('#requestedUserShowBtn').addClass('manageCommunity-btn-active')
    $('#userlist').hide();
    $('#invitationlist').hide();
    $('#requestlist').show();
    $('#managerlist').hide();
  }

  function showInvitation()
  {
    $('.manageCommunity-btn-active').removeClass('manageCommunity-btn-active');
    $('#invitedUserShowBtn').addClass('manageCommunity-btn-active')
    $('#userlist').hide();
    $('#invitationlist').show();
    $('#requestlist').hide();
    $('#managerlist').hide();
  }

  window.onload= function()
  {
    $('#invitationlist').hide();
    $('#requestlist').hide();
    $('#managerlist').hide();
    var id = $('#id').html();
    var obj = Object();
    obj._id = id;
    var request = new XMLHttpRequest()
    request.open('POST','/getMembers')
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      data = JSON.parse(request.responseText);
      console.log(data);
      for(i=0;i<data.communitymember.length;i++)
      {
        addtoDOM1(data.communitymember[i],id);
      }
      for(i=0;i<data.communityrequest.length;i++)
      {
        addtoDOM2(data.communityrequest[i]);
      }
      for(i=0;i<data.invitations.length;i++)
      {
        addtoDOM3(data.invitations[i]);
      }
      addtoDOM4(data.communityownerid);
      for(i=0;i<data.communitymanager.length;i++)
      {
        addtoDOM5(data.communitymanager[i],id);
      }
    }
  }

  function addtoDOM1(obj,id)
  {
    var div = '<div class="col-sm-12 col-xs-12 allcoms community-user-div" id="'+obj._id+'" style="margin-top:5px;">'
                +'<div class="col-sm-2 col-xs-3" style="padding:5px;">'
                  +'<a href="/viewprofile/'+obj._id+'">'
                    +'<img src="'+obj.photoname+'" class="community-member-pic">'
                  +'</a>'
                +'</div>'
                +'<div class="col-sm-8 col-xs-6 scrollable">'
                  +'<a class="comusername" href="/viewprofile/'+obj._id+'">'+obj.name+'</a>'
                +'</div>'
                +'<div class="col-sm-2 col-xs-3">'
                  +'<a class="community-user-short-btn" onclick=promoteUser("'+obj._id+'","'+id+'") style="float:left">'
                    +'<i class="fa fa-chevron-up"></i>'
                  +'</a>'
                  +'<a class="community-user-short-btn" style="float:right" onclick=removeUser("'+obj._id+'","'+id+'")>'
                    +'<i class="fa fa-times"></i>'
                  +'</a>'
                +'</div>'
              +'</div>'
    $("#userlist").append(div);
  }

  function addtoDOM2(obj)
  {
    // console.log(obj);
    var div = '<div class="col-sm-12 col-xs-12 allcoms community-user-div" id="'+obj._id+'" style="margin-top:5px;">'
                +'<div class="col-sm-2 col-xs-3" style="padding:5px;">'
                  +'<a href="/viewprofile/'+obj._id+'">'
                    +'<img src="'+obj.photoname+'" class="community-member-pic">'
                  +'</a>'
                +'</div>'
                +'<div class="col-sm-8 col-xs-6 scrollable">'
                    +'<a class="comusername" href="/viewprofile/'+obj._id+'">'+obj.name+'</a>'
                +'</div>'
                +'<div class="col-sm-2 col-xs-3">'
                  +'<div class="dropdown">'
                    +'<div class="dropup request-btn-dropdown">'
                      +'<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" style="float:right !important">Option</button>'
                      +'<ul class="dropdown-menu dropdown-menu-right">'
                        +'<li>'
                          +'<a class="request-dropdown-options" onclick=acceptRequest("'+obj._id+'")>Accept</a>'
                        +'</li>'
                        +'<li>'
                          +'<a class="request-dropdown-options" onclick=rejectRequest("'+obj._id+'")>Reject</a>'
                        +'</li>'
                      +'</ul>'
                    +'</div>'
                  +'</div>'
                +'</div>'
              +'</div>'
    $("#requestlist").append(div);
  }

  function addtoDOM3(obj)
  {
    // console.log(obj);
    var div = +'<div class="col-sm-12 col-xs-12 allcoms community-user-div" style="margin-top:5px;">'
                +'<div class="col-sm-2 col-xs-3" style="padding:5px;">'
                  +'<a href="/viewprofile/'+obj._id+'">'
                    +'<img src="'+obj.photoname+'" class="community-member-pic">'
                  +'</a>'
                +'</div>'
                +'<div class="col-sm-8 col-xs-6 scrollable">'
                  +'<a class="comusername" href="/viewprofile/'+obj._id+'">'+obj.name+'</a>'
                +'</div>'
                +'<div class="col-sm-2 col-xs-3">'
                  +'<a class="community-user-short-btn" onclick="" style="float:right"><i class="fa fa-times"></i></a>'
                +'</div>'
              +'</div>'
    $("#invitationlist").append(div);
  }

  function addtoDOM4(obj)
  {
    var div = '<div class="col-sm-12 col-xs-12 allcoms community-user-div" style="margin-top:5px;"><div class="col-sm-2 col-xs-3" style="padding:5px;"><a href="/viewprofile/'+obj._id+'"><img src="'+obj.photoname+'" class="community-member-pic"></a></div><div class="col-sm-8 col-xs-6 scrollable"><a class="comusername" href="/viewprofile/'+obj._id+'">'+obj.name+'</a></div><div class="col-sm-2 col-xs-3"><span class="label label-success" style="margin-top:25px;float:right">Owner</span></div></div>'
    $("#managerlist").append(div);
  }

  function addtoDOM5(obj,commid)
  {
    // console.log(obj);
    var div = '<div class="col-sm-12 col-xs-12 allcoms community-user-div" id="'+obj._id+'" style="margin-top:5px;">'
                +'<div class="col-sm-2 col-xs-3" style="padding:5px;">'
                  +'<a href="/viewprofile/'+obj._id+'">'
                    +'<img src="'+obj.photoname+'" class="community-member-pic">'
                  +'</a>'
                +'</div>'
                +'<div class="col-sm-8 col-xs-6 scrollable">'
                  +'<a class="comusername" href="/viewprofile/'+obj._id+'">'+obj.name+'</a>'
                +'</div>'
                +'<div class="col-sm-2 col-xs-3">'
                  +'<a class="community-user-short-btn" style="float:left" onclick=demoteUser("'+obj._id+'","'+commid+'")>'
                    +'<i class="fa fa-chevron-down"></i>'
                  +'</a>'
                  +'<a class="community-user-short-btn" style="float:right" onclick=removeUser("'+obj._id+'","'+commid+'")>'
                    +'<i class="fa fa-times"></i>'
                  +'</a>'
                +'</div>'
              +'</div>'
    $("#managerlist").append(div);
  }

  function promoteUser(userid,commid)
  {
    $.confirm({
        title: 'Confirm Promote!',
        content: 'Do you really want promote this user?',
        draggable: true,
        buttons: {
          Yes: {
               btnClass: 'btn-success',
                action: function ()
                {
                  var obj = Object();
                  obj.userid = userid;
                  obj.commid = commid;
                  var request = new XMLHttpRequest();
                  request.open('POST','/promoteUser')
                  request.setRequestHeader('Content-type',"application/json")
                  request.send(JSON.stringify(obj))
                  request.onload = function()
                  {
                    $('#' + userid).remove();
                    alert("done")
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

  function demoteUser(userid,commid)
  {
    $.confirm({
        title: 'Confirm Demote!',
        content: 'Do you really want to demote this user?',
        draggable: true,
        buttons: {
          Yes: {
               btnClass: 'btn-success',
                action: function ()
                {
                  var obj = Object();
                  obj.userid = userid;
                  obj.commid = commid;
                  var request = new XMLHttpRequest();
                  request.open('POST','/demoteUser')
                  request.setRequestHeader('Content-type',"application/json")
                  request.send(JSON.stringify(obj))
                  request.onload = function()
                  {
                    $('#' + userid).remove();
                    alert("done")
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

  function acceptRequest(userid)
  {
    console.log(userid);
    var obj = Object();
    obj.userid = userid;
    obj.commid = data._id;
    var request = new XMLHttpRequest();
    request.open('POST','/acceptRequest')
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      $("#"+userid.toString()).remove();
    }
  }

  function rejectRequest(userid)
  {
    console.log(userid);
    var obj = Object();
    obj.userid = userid;
    obj.commid = data._id;
    var request = new XMLHttpRequest();
    request.open('POST','/rejectRequest')
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      var p = document.getElementById(userid.toString());
      p.parentNode.removeChild(p);
    }
  }

  function removeUser(userid,commid)
  {
    console.log(userid,commid);
    $.confirm({
        title: 'Really want remove ?',
        content: 'Do you really want remove this user?',
        draggable: true,
        buttons: {
          Yes: {
               btnClass: 'btn-success',
                action: function ()
                {
                  var obj = Object();
                  obj.userid = userid;
                  obj.commid = commid;
                  var request = new XMLHttpRequest();
                  request.open('POST','/removeUser')
                  request.setRequestHeader('Content-type',"application/json")
                  request.send(JSON.stringify(obj))
                  request.onload = function()
                  {
                    $('#' + userid).remove();
                    alert("done")
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
