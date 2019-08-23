
  window.onload = function()
  {
    var id = document.getElementById("id").textContent;
    var obj = Object();
    obj._id = id;
    var request = new XMLHttpRequest();
    request.open('POST','/getDiscussion');
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj));
    request.onload = function()
    {
      var data = JSON.parse(request.responseText);
      console.log(data);
      for(var i in data.communitydiscussion)
      {
        addtoDOM(data.communitydiscussion[i]);
      }
    }
  }
  function addtoDOM(obj)
  {
    console.log(obj);
    var div = '<div class="container discussion-container">'
                +'<div class="panel panel-default allSidesSoft" style="background:white;">'
                  +'<div class="dropup">'
                    +'<a class="discussion-dropdown-menu" data-toggle="dropdown" style="float:right !important" aria-expanded="false"><i class="fa fa-ellipsis-h"></i></a>'
                    +'<ul class="dropdown-menu dropdown-menu-right dropdown-menu-discussion">'
                      +'<li><a class="request-dropdown-options" onclick="">Delete</a></li>'
                      +'<li id=""><a class="request-dropdown-options" onclick="" id="">Feature</a></li>'
                      +'<li id=""><a class="request-dropdown-options" onclick="" id="">Publish to CQ</a></li>'
                    +'</ul>'
                  +'</div>'
                  +'<div class="panel-body" style="padding:0; padding-top:10px;">'
                    +'<div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-title">'
                      +'<a class="discussion-title" href="#" target="">'+obj.dtitle+'</a>'
                    +'</div>'
                    +'<div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-head"> posted by <a href="/viewprofile/'+obj.cid+'">'+obj.cname+'</a> at '+obj.dday+'</div>'
                  +'</div>'
                  +'<div class="panel-body" style="padding:0;padding-top:10px;">'
                    +'<div class="col-sm-12 col-xs-12 col-lg-12 col-md-12 discussion-content" style="font-size:16px">'+obj.ddetail+'</div>'
                  +'</div>'
                +'</div>'
              +'</div>';
    $('#discussionsList').append(div);
  }
