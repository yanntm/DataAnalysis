var url;

var comparedType;
var techX;
var techY;
var removeFailed;

var query1;
var query2;

//objet tableau d'association : 
//	col.[nomDeColonne][0] = columnID, 
//	col.[nomDeColonne][1] = columnIndex
var col = {
		'log': ['A',0],
		'model': ['B',1],
		'examination': ['C',2],
		'technique': ['D',3],
		'testStarted': ['E',4],
		'testFail': ['F',5],
		'testFinished': ['G',6],
		'duration': ['H',7],
		'initial': ['I',8],
		'tautology': ['J',9],
		'ITS': ['K',10],
		'BMC': ['L',11],
		'induction': ['M',12],
		'PINS': ['N',13],
		'PINSPOR': ['O',14],
		'version': ['P',15]
};

function startQuerying() {

	//extraction des variables du formulaire HTML
	extractClientSettings();

	//creation des Queries selon les variables extraites
	query1 = createQuery(techX);
	query2 = createQuery(techY);

	console.log("url: "+url+"\ncomparedType: "+comparedType+"\ntechX: "+techX+
		"\ntechY: "+techY+"\nremoveFailed: "+removeFailed+"\nquery1: "+query1+"\nquery2: "+query2);

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
					var data = google.visualization.data.join(
						dataQuery1, 
						dataQuery2, 
						'inner', 
						[[col.model[1], col.model[1]], [col.examination[1], col.examination[1]]],
						[col.duration[1]], [col.duration[1]]);
					
					console.log("numberOfRows :\ndataQuery1: " + dataQuery1.getNumberOfRows() + " , dataQuery2: " + dataQuery2.getNumberOfRows() + " , dataJoined: " + data.getNumberOfRows());
					
					//genere les graphiques Google Charts et les affiche
					drawChart(data);
				});
			}); 
		}
	);
}

function extractClientSettings(){
	url = "https://docs.google.com/spreadsheets/d/"+
	document.getElementById("url").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";
	removeFailed = document.getElementById("removeFailed").checked;
	techX = document.getElementById("techX").value;
	techY = document.getElementById("techY").value;
	comparedType = document.getElementById("comparedType").value;
}

function createQuery(techniqueName){
	//var locale pour construire la requete
	var query;

	//clause SELECT : colonnes log, model, examination, [comparedType]
	query = 'SELECT *';
	//clause WHERE : technique = [techniqueName] AND (optionnel) testFail = 0
	query += ' WHERE '+col.technique[0]+' ="'+techniqueName+'"';
	
	if(removeFailed){
		query += ' AND '+col.testFail[0]+' = 0';
	}

	//clause LABEL : colonne comparedType renomme en "techniqueName comparedType"
	query += ' LABEL '+col[comparedType][0]+' "'+techniqueName+' '+comparedType+'"';

	return query;
}

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
	view.setColumns([2, 3, 
		{
			label: 'y=x',
			type: 'number',
			calc: function (dt, row) {return dt.getValue(row, 2);}
		}
	]);

	//Configuration du schema
	var options = {
			title: '['+techX+'] VS ['+techY+'] '+comparedType,
			hAxis: {title: techX},
			vAxis: {title: techY},
			
			seriesType: 'scatter',
			series: {
				1: {type: 'line'}
			},

			tooltip: { trigger: 'both' }
	};
	
	//creation du ScatterChart. On passe en parametre un pointeur vers l'element DOM
	//dans lequel le ScatterChart sera encapsule dans le fichier HTML.
	var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));

	chart.setAction({
		id: 'details',
		text: '[details]',
		action: function() {
			selection = chart.getSelection();
			//switch (selection[0].row) {
			//}
			alert(selection);
		}
	});

	//affichage graphique du ScatterChart
	chart.draw(view, options);
}

// traitement du chronogramme

function drawChrono() {
	 var queryStr = encodeURIComponent('SELECT A,H WHERE B matches \'.*Airplane.*\' and D= \'-ltsminpath\' and F=0 and C = \'ReachabilityDeadlock\' ORDER BY A');

     var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1Yhsm4LnZvbe-dEENoEKff-Z0Zfa2zu-GN_Aa3NJDbco/gviz/tq?sheet=Sheet1&headers=1&tq=' + queryStr);
     query.send(handlerDataQueryResponse);

} 
function handlerDataQueryResponse(response) {
      if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
      }

      var options = {
		chart: {
		  title: 'Chronogramme de la Technique ITSMINPATH',
		  subtitle: 'Pour un model donne et les examinations disponibles'
		},
		width: 600,
		height: 300
	  };
	  var data = response.getDataTable();
	  var view = new google.visualization.DataView(data);
	  var chart = new google.visualization.ColumnChart(document.getElementById("chrono_div"));
	  chart.draw(view, options);
}
