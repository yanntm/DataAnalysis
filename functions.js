var url;

var comparedType;
var techX;
var techY;
var removeFailed;

function startScatterChart() {

	//extraction des variables du formulaire HTML
	extractClientSettings();

	//creation des Queries selon les variables extraites
	var query1 = createQueryScatterChart(techX);
	var query2 = createQueryScatterChart(techY);

	console.log("url: "+url+"\ncomparedType: "+comparedType+"\ntechX: "+techX+
		"\ntechY: "+techY+"\nremoveFailed: "+removeFailed+"\nquery1: "+query1+"\nquery2: "+query2);
	
	//envoie la 1e requete url+query1 a Google
	sendQuery(url, query1, onReceiveQuery1);

	function onReceiveQuery1(response) {

		//extrait une DataTable declaree globale de la 1e reponse recue.
		dataQuery1 = extractDataTableFromAnswer(response);

		//envoie la 2e requete url+query2 a Google
		sendQuery(url, query2, onReceiveQuery2);
	}

	function onReceiveQuery2(response) {

		//extrait une DataTable declaree globale de la 2e reponse recue.
		dataQuery2 = extractDataTableFromAnswer(response);

		//fusionne les deux tables avec Join
		var data = google.visualization.data.join(
			dataQuery1, 
			dataQuery2, 
			'inner', 
			[[1,1], [2,2]],
			[0,3], 
			[0,3]);
		
		console.log("numberOfRows :\ndataQuery1: " + dataQuery1.getNumberOfRows() + " , dataQuery2: " + dataQuery2.getNumberOfRows() + " , dataJoined: " + data.getNumberOfRows());
		
		//genere les graphiques Google Charts et les affiche
		drawScatterChart(data);
	}
}

function extractClientSettings(){
	url = "https://docs.google.com/spreadsheets/d/"+
	document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";
	/*fromBuild = document.getElementById("fromBuild").value;
	toBuild = document.getElementById("toBuild").value;*/
	
	removeFailed = document.getElementById("removeFailed").checked;
	techX = document.getElementById("techX").value;
	techY = document.getElementById("techY").value;
	comparedType = document.getElementById("comparedType").value;
}

function createQueryScatterChart(techniqueName){
	//var locale pour construire la requete
	var query;

	//clause SELECT : colonnes log, model, examination, [comparedType]
	query = 'SELECT A, B, C, '+comparedType ;
	//clause WHERE : technique = [techniqueName] AND (optionnel) testFail = 0
	query += ' WHERE D ="'+techniqueName+'"';
	
	if(removeFailed){
		query += ' AND F = 0';
	}

	return query;
}

function sendQuery(url, queryString, handleQueryResponse) {
	
	//Requete Google Query
	var queryEncoded = new google.visualization.Query(url + encodeURIComponent(queryString));

	//envoi de la Requete avec en parametre la fonction a appeler quand la reponse arrive
	queryEncoded.send(handleQueryResponse);
}

function extractDataTableFromAnswer(response) {
	/*response est un objet QueryResponse passee par la methode send.
		https://developers.google.com/chart/interactive/docs/reference#methods_12*/

	/*Erreur si requete fausse*/
	if (response.isError()) {
		alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
		return;
	}

	/*donnees utiles dans l'objet QueryResponse*/
	return response.getDataTable();
}

function drawScatterChart(data) {

	/*AFFICHAGE DATATABLE*/

	//creation de la Table. On passe en parametre un pointeur vers l'element DOM
	//dans lequel la Table sera encapsulee dans le fichier HTML.
	//var table = new google.visualization.Table(document.getElementById('table_div'));

	//affichage graphique de la table de donnees recue en reponse
	//table.draw(data, {showRowNumber : true});


	/*AFFICHAGE SCATTERCHART*/

	var view = new google.visualization.DataView(data);
	view.setColumns([3, 5, 3]);

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
			var selection = chart.getSelection();
			var message = '';

			for (var i = 0; i < selection.length; i++) {
				var item = selection[i];
				if (item.row != null && item.column != null) {
					message += '{row:' + item.row + ',column:' + item.column + '}';
				} else if (item.row != null) {
					message += '{row:' + item.row + '}';
				} else if (item.column != null) {
					message += '{column:' + item.column + '}';
				}
			}
			if (message == '') {
				message = 'nothing';
			}
			alert('You selected ' + message);

		}
	});

	//affichage graphique du ScatterChart
	chart.draw(view, options);
}

// traitement du chronogramme
// B matches \'.*Airplane.*\'

function drawChronoAffiche(){
	google.charts.setOnLoadCallback(donneesChrono);

	function donneesChrono(){

		var model = document.getElementById("model").value;
		var examination = document.getElementById("examination").value;
		var isRegex = document.getElementById("regex").checked;

		url = "https://docs.google.com/spreadsheets/d/"+
		document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";
		

		var BEqualOrRegexModel;
		if (isRegex) {
			BEqualOrRegexModel = "B matches \'.*" +model+ ".*\'";
		} else {
			BEqualOrRegexModel = "B=\'" +model+ "\'";
		}

		var queryStr1 = "SELECT P,sum(H) WHERE " +BEqualOrRegexModel+
			" and C=\'" +examination+ "\' and F=0 GROUP BY P PIVOT D ORDER BY P";

		//var queryStr1 = "SELECT A,min(H) WHERE B matches \'.*" +model+ ".*\' " +
		//	"and D=\'-ltsminpath -its -smt\'" + " and F=0 GROUP BY A PIVOT C ORDER BY A";
		
		console.log(queryStr1);
		sendQuery(url,queryStr1,RecevoirQueryStr1);

		function RecevoirQueryStr1(reponse){
			data = extractDataTableFromAnswer(reponse);
			console.log("numberOfRows :\ndata: " + data.getNumberOfRows());
			

			var options = {
				chart: {
					title: 'Chronogramme'
				},
				lineWidth: 1.5,
				pointSize: 2,
				interpolateNulls: true
			};

			var view = new google.visualization.DataView(data);

			var columns = [];
			for (var i = 1; i <= view.getNumberOfColumns()-1; i++) {columns.push(i);}

			var dateStringColumn = 
				{
            		type: 'string',
            		calc: function (dt, row) {return dt.getFormattedValue(row, 0);}
            	}

            columns.unshift(dateStringColumn);

			view.setColumns(columns);

			var chart = new google.visualization.LineChart(document.getElementById("chrono_div"));
			chart.draw(view, options);

			//affichage graphique de la table de donnees 
			var table = new google.visualization.Table(document.getElementById('table_div'));
			table.draw(view, {showRowNumber : true});
		}

	}
}

/*function drawChrono(data) {
	var view = new google.visualization.DataView(data);

	var options = {
		chart: {
		  title: 'Chronogramme de la Technique ITSMINPATH',
		  subtitle: 'Pour un model donne et les examinations disponibles'
		},
		width: 600,
		height: 300
	  };
	  //var data = response.getDataTable();
	  //var view = new google.visualization.DataView(data);
	  var chart = new google.visualization.LineChart(document.getElementById("chrono_div"));
	  chart.draw(view, options);

} 
function drawChrono() {
	 var queryStr = encodeURIComponent('SELECT C,H WHERE B matches \'.*Angiogenesis.*\'  and D= \'-ltsminpath\' and F=0 and C = \'ReachabilityDeadlock\' LIMIT 50');

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
	  var chart = new google.visualization.LineChart(document.getElementById("chrono_div"));
	  chart.draw(view, options);
}*/
