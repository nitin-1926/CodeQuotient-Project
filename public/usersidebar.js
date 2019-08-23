  function showsidebar()
  {
      var element = document.getElementById("viewscreen");
      element.classList.toggle("toggle-pc");

      var element = document.getElementById("sidebar");
      element.classList.toggle("sidebar-width");


      var element = document.getElementById("rightview");
      element.classList.toggle("set-rightview");
  }

  function open_home_page()
  {
      window.location = "/profile"
  }

  function open_changepassword_page()
  {
      window.location ='/changepassword'
  }

  function open_communities_page()
  {
    window.location = '/community/communitypanel'
  }

  function openeditpage()
  {
    window.location = '/home'
  }

  function open_logout()
  {
    // window.location = '/logout'
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
