
  var data;

  function showOwner()
  {
    $('.active-link-btn').removeClass('active-link-btn');
    $('#admins-list-btn').addClass('active-link-btn');
    $('.comUsersList').hide()
    $('.OwnerDivMain').show()
  }

  function showMembers()
  {
    $('.active-link-btn').removeClass('active-link-btn');
    $('#users-list-btn').addClass('active-link-btn');
    $('.OwnerDivMain').hide()
    $('.comUsersList').show()
  }

  window.onload = function()
  {
    $('.comUsersList').hide()
    var id = $('#id').html();
    var obj = Object();
    obj._id = id;
    console.log(id);
    var request = new XMLHttpRequest()
    request.open('POST','/get')
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      data = JSON.parse(request.responseText);
      console.log(data);
      addtoDOM1();
      addtoDOM2();
    }
  }

  function addtoDOM1()
  {
      let div =    '<div class="col-sm-12 community-user-div" style="margin-top: 5px">'
                     +'<div class="col-sm-3" style="padding:5px;">'
                         +'<a href="/viewprofile/'+data.communityownerid._id+'">'
                           +'<img src="'+data.communityownerid.photoname+'" class="community-member-pic">'
                         +'</a>'
                         +'<span class="label label-primary">Owner</span>'
                     +'</div>'
                     +'<div class="col-sm-9 scrollable">'
                        +'<a class="comusername" href="/viewprofile/'+data.communityownerid._id+'">'+data.communityownerid.name+'</a>'
                     +'</div>'
                   +'</div>'
      $('.OwnerDivMain').append(div);
      for(let i=0;i<data.communitymanager.length;i++)
      {
        let div = '<div class="col-sm-12 community-user-div" style="margin-top: 5px">'
                    +'<div class="col-sm-3" style="padding:5px;">'
                      +'<a href="/viewprofile/'+data.communitymanager[i]._id+'">'
                        +'<img src="'+data.communitymanager[i].photoname+'" class="community-member-pic">'
                      +'</a>'
                      +'<span class="label label-primary">Admin</span>'
                    +'</div>'
                    +'<div class="col-sm-9 scrollable">'
                      +'<a class="comusername" href="/viewprofile/'+data.communitymanager[i]._id+'">'+data.communitymanager[i].name+'</a>'
                    +'</div>'
                  +'</div>'
        $('.OwnerDivMain').append(div);
      }
  }

  function addtoDOM2()
  {
    for(let i=0;i<data.communitymember.length;i++)
    {
      // console.log("hello");
      let div = '<div class="col-sm-12 community-user-div" style="margin-top: 5px">'
                  +'<div class="col-sm-3" style="padding:5px;">'
                    +'<a href="/viewprofile/'+data.communitymember[i]._id+'">'
                      +'<img src="'+data.communitymember[i].photoname+'" class="community-member-pic">'
                    +'</a>'
                  +'</div>'
                  +'<div class="col-sm-9 scrollable">'
                    +'<a class="comusername" href="/viewprofile/'+data.communitymember[i]._id+'">'+data.communitymember[i].name+'</a>'
                  +'</div>'
                +'</div>'

      $('.comUsersList').append(div);
    }
  }
