# Test de query sur google sheet

<html>
<body>
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<script type="text/javascript" src="functions.js"></script>	
	<script type="text/javascript">

		//charge la lib google charts
		google.charts.load('current', {'packages':['corechart','table']});

		//lance la fonction anonyme en parametre une fois la librairie chargee
		google.charts.setOnLoadCallback(
			function() {
				//envoie la 1e requete url+query1 a Google
				sendQuery(url, query1, function(response) {

					//extrait une DataTable declaree globale de la 1e reponse recue.
					dataQuery1 = extractDataTableFromAnswer(response);
					
					//envoie la 2e requete url+query2 a Google
					sendQuery(url, query2, function(response) {

						//extrait une DataTable declaree globale de la 2e reponse recue.
						dataQuery2 = extractDataTableFromAnswer(response);

						//fusionne les deux tables avec Join
						var data = google.visualization.data.join(dataQuery1, dataQuery2, 'inner', [[1,1], [2,2]], [3], [3]);
						console.log("numberOfRows :\ndataQuery1: " + dataQuery1.getNumberOfRows() + " , dataQuery2: " + dataQuery2.getNumberOfRows() + " , dataJoined: " + data.getNumberOfRows());

						//genere les graphiques Google Charts et les affiche
						drawChart(data);
					});
				}); 
			});

		var url = 'https://docs.google.com/spreadsheets/d/1ZdhTerwqhyGxmSyCpfmQGeCHynFL2gcbC-PJ56NzXrE/gviz/tq?sheet=Sheet1&headers=1&tq=';
		var query1 = 'SELECT A, B, C, H WHERE D ="-its" AND F = 0';
		var query2 = 'SELECT A, B, C, H WHERE D ="-its -smt -ltsminpath" AND F = 0';
	</script>
	<div id="table_div" style="width: 600px; height: 300px;"></div>
	<div id="chart_div" style="width: 600px; height: 500px;"></div>
</body>
</html>