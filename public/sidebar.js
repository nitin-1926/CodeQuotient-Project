
  function showsidebar()
  {
    console.log("sdjksdkjsdkjdskj");
    var element = document.getElementById("viewscreen");
    element.classList.toggle("toggle-pc");

    var element = document.getElementById("sidebar");
    element.classList.toggle("sidebar-width");


    var element = document.getElementById("rightview");
    element.classList.toggle("set-rightview");
  }

  function open_home_page()
  {
    window.location = '/home'
  }

  function open_adduser_page()
  {
    window.location = '/adduser'
  }

  function open_userlist_page()
  {
      window.location = '/userslist'
  }

  function open_communitylist_page()
  {
      window.location = '/communitylist'
  }

  function open_switchmodel_page()
  {
      // document.getElementById("switchmodel-title").innerHTML="Switch as User"
      // document.getElementById("yes-switch").onclick = function()
      // {
      //     window.location = '/switchcommunityhome'
      // }
      let word = 'Admin';
      if($('p').html()=='admin')
      word = 'User';
      $.confirm({
          title: 'Switch As ' + word,
        	content: 'Do you really want switch state...',
        	draggable: true,
       		buttons: {
            Yes: {
                 btnClass: 'btn-success',
                	action: function ()
                  {
                	   window.location = '/switchcommunityhome'
            	    }
       		},
            No: {
                btnClass: 'btn-danger',
                 action: function () {}
       		},
        	}
    		});
  }

  function open_tag_page()
  {
      window.location = '/tagpanel'
  }

  function open_changepassword_page()
  {
    window.location = '/changepassword'
  }

  function open_communities_page()
  {
    console.log("here");
    // return ;
    window.location = '/home'
  }

  function editpage()
  {
    window.location = '/editpage'
  }

  function aslieditpage()
  {
    window.location = '/editinfo'
  }

  function open_logout()
  {
    $.confirm({
      	title: 'Confirm Logout!',
      	content: 'Do you really want logout?',
      	draggable: true,
        theme : 'supervan',
     		buttons: {
          Yes: {
               btnClass: 'btn-success',
              	action: function ()
                {
              	   window.location = '/logout'
          	    }
     		    },
          No: {
              btnClass: 'btn-danger',
               action: function () {}
     		   },
      	}
  		});
  }
