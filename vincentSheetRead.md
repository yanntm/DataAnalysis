# Sheet api exemple

(Ouvrir les logs de la console avant de lancer)
<html>
<body>
	<script src="https://apis.google.com/js/api.js"></script>
	<script> 
		function loadClient() {
			gapi.client.setApiKey("AIzaSyDR_QWaELj_Ri_Vt6ubIGmgDKFPzCuGwMk");
			return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/sheets/v4/rest")
			.then(function() {
				console.log("GAPI client loaded for API");
			}, function(error) {
				console.error("Error loading GAPI client for API");
			});
		}

  	// Make sure the client is loaded before calling this method.
  	function execute() {
  	return gapi.client.sheets.spreadsheets.values.get({
  		"spreadsheetId": "1ZdhTerwqhyGxmSyCpfmQGeCHynFL2gcbC-PJ56NzXrE",
  		"range": "A3:E4"
  	})
  	.then(function(response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
      }, function(error) {
      	console.error("Execute error", error);
      });
  	}
  
  	gapi.load("client");

	</script>
	<button onclick="loadClient()">load</button>
	<button onclick="execute()">execute</button>
</body>
</html>