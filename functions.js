function sendQuery(url, queryString, handleQueryResponse) {
	
	//Requete Google Query
	var queryEncoded = new google.visualization.Query(url + encodeURIComponent(queryString));

	//envoi de la Requete avec en parametre la fonction a appeler quand la reponse arrive
	queryEncoded.send(handleQueryResponse);
}

function extractDataTableFromAnswer(queryResponse) {
	if (queryResponse.isError()) {
		alert('Error in query: ' + queryResponse.getMessage() + ' ' + queryResponse.getDetailedMessage());
		return;
	}
	return queryResponse.getDataTable();
}

function drawChart(data) {

	/*AFFICHAGE DATATABLE*/

	//creation de la Table. On passe en parametre un pointeur vers l'element DOM
	//dans lequel la Table sera encapsulee dans le fichier HTML.
	var table = new google.visualization.Table(document.getElementById('table_div'));

	//affichage graphique de la table de donnees recue en reponse
	table.draw(data, {showRowNumber : true});


	/*AFFICHAGE SCATTERCHART*/

	var view = new google.visualization.DataView(data);
	view.setColumns([2, 3, {
		label: 'y=x',
		type: 'number',
		calc: function (dt, row) {return dt.getValue(row, 2);}
	}]);

	//Configuration du schema
	var options = {
			title: '[-its] VS [-its -smt -ltsminpath] Durations',
			hAxis: {title: '-its'},
			vAxis: {title: '-its -smt -ltsminpath'},
			
			seriesType: 'scatter',
			series: {
				1: {type: 'line'}
			}
	};
	
	//creation du ScatterChart. On passe en parametre un pointeur vers l'element DOM
	//dans lequel le ScatterChart sera encapsule dans le fichier HTML.
	var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));

	//affichage graphique du ScatterChart
	chart.draw(view, options);
}

function startQuerying() {

	//extraction du formulaire HTML
	var url = document.getElementById("url").value;
	var query1 = document.getElementById("query1").value;
	var query2 = document.getElementById("query2").value;
	console.log("url: "+url+"\nquery1: "+query1+"\nquery2: "+query2);

	//Script qui interroge 2 fois la google Spreadsheet et affiche le résultat graphiquement.
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
		}
	);
}