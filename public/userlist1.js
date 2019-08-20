$(document).ready(function() {
  $('#users-table').DataTable(
    {
      "processing": true,
        "serverSide": true,
        "ajax": {
          "url" : "/ul",
          "type" : "get",
        }
    }
  );
})
