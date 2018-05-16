var sheetColumns;
var sheetVersions;

function initialisation(){
	cleanForm();

	/*affiche les dropdown menus contenant les noms de toutes les colonnes de la Spreadsheet*/
	google.charts.setOnLoadCallback(retrieveColumnsNames);
}

function retrieveColumnsNames(){
	/*String requete qui ne rend qu'une seule ligne de resultat, peu importe laquelle*/
	var query = "LIMIT 1";

	/*url de la spreadsheet google. concatenation debut_url+ Spreadsheet Key + fin_url*/
	var url = "https://docs.google.com/spreadsheets/d/"+
		document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";

	sendQuery(url, query, function(response){
		/*extract... renvoie un objet Datatable avec les donneess utiles dedans*/
		var data = extractDataTableFromAnswer(response);

		/*creation du tableau key/value lettre<=>nom de colonne*/
		sheetColumns = {};
		for(var i=0; i<data.getNumberOfColumns(); i++){
			sheetColumns[data.getColumnLabel(i)] = data.getColumnId(i);
			//console.log(data.getColumnLabel(i)+" ** "+data.getColumnId(i));
		}

		for (var key in sheetColumns) {
		    if (sheetColumns.hasOwnProperty(key)) {
		        //console.log(key + " : " + sheetColumns[key]);
		    }
		}

		printColumnsNamesMenus();

		retrieveTechniquesNames();

		retrieveVersions(data);

	});

	function printColumnsNamesMenus(){
		/*fragment HTML = objet conteneur qu'on remplit de noeuds HTML*/
		var fragment = document.createDocumentFragment();

		/*boucle d'ajout d'un noeud <option> de nom de colonne dans le fragment HTML*/
		for (var key in sheetColumns) {
		    if (sheetColumns.hasOwnProperty(key)) {
		        var opt = document.createElement('option');
				opt.innerHTML = sheetColumns[key]+": "+key;
		    	opt.value = sheetColumns[key];
		    	fragment.appendChild(opt);
		    }
		}
		/*dropdown menus auxquels on veut ajouter les options*/
		var menu1 = document.getElementById("comparedType");
		var menu2 = document.getElementById("comparedColumn");

		/*ajout des options*/
		menu1.appendChild(fragment.cloneNode(true));
		menu2.appendChild(fragment.cloneNode(true));

		/*on rend les menus visibles dans le document HTML*/
		menu1.style.display = 'inline';
		menu2.style.display = 'inline';
	}

	function retrieveVersions(data){
		var versionColumnId;
		for(var i=0; i<=data.getNumberOfColumns() && data.getColumnLabel(i).search(/version/i); i++){
		}
		versionColumnId = data.getColumnId(i);

		var query = "SELECT "+versionColumnId+", count("+versionColumnId+") GROUP BY "+versionColumnId;
		var queryEncoded = new google.visualization.Query(url + encodeURIComponent(query));
		queryEncoded.send( function(response){
			var dt = extractDataTableFromAnswer(response);
			console.log("Le nombre de version: "+dt.getNumberOfRows());
			for(var i=0; i<dt.getNumberOfRows(); i++ ) 
				console.log(dt.getValue(i, 0));

		});
	}

	/*function retrieveModel(data){
		var versionColumnId;
		for(var i=0; i<=data.getNumberOfColumns() && data.getColumnLabel(i).search(/Model/i); i++){
		}
		ModelColumnId = data.getColumnId(i);

		var query = "SELECT "+ModelColumnId+", count("+ModelColumnId+") GROUP BY "+ModelColumnId;
		var queryEncoded = new google.visualization.Query(url + encodeURIComponent(query));
		queryEncoded.send( function(response){
			var dt1 = extractDataTableFromAnswer(response);
			console.log("Le nombre de Model: "+dt1.getNumberOfRows());
			var ListeModel = new Array();
			for(var i=0; i<dt1.getNumberOfRows()-1; i++ ) 
		 		//console.log(dt1.getValue(i, 0));
		 		ListeModel[i] = dt1.getValue(i, 0);
		 	
		 	document.monformChrono.model.options.length = ListeModel.length;
		 	for (var i = 0 ;i < ListeModel.length; i++) {
		 		document.monformChrono.model.options[i].value=ListeModel[i];
		 		document.monformChrono.model.options[i].text=ListeModel[i];
		 	}
		});
	}*/

	/*function retrieveExamination(data){
		var versionColumnId;
		for(var i=0; i<=data.getNumberOfColumns() && data.getColumnLabel(i).search(/Examination/i); i++){
		}
		ExaColumnId = data.getColumnId(i);

		var query = "SELECT "+ExaColumnId+", count("+ExaColumnId+") GROUP BY "+ExaColumnId;
		var queryEncoded = new google.visualization.Query(url + encodeURIComponent(query));
		queryEncoded.send( function(response){
			var dt1 = extractDataTableFromAnswer(response);
			console.log("Le nombre d'examinations: "+dt1.getNumberOfRows());
			var ListeExa = new Array();
			for(var i=0; i<dt1.getNumberOfRows()-1; i++ ) 
		 		//console.log(dt1.getValue(i, 0));
		 		ListeExa[i] = dt1.getValue(i, 0);
		 	
		 	document.monformChrono.examination.options.length = ListeExa.length;
		 	for (var i = 0 ;i < ListeExa.length; i++) {
		 		document.monformChrono.examination.options[i].value=ListeExa[i];
		 		document.monformChrono.examination.options[i].text=ListeExa[i];
		 	}
		});
	}*/
}


function funExa(technique){
	var url = "https://docs.google.com/spreadsheets/d/"+
		document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";

	console.log("La valeur de la technique est :" +technique);

	//var query = "SELECT "+examinationColumnId+"WHERE "+modelColumnId+" = "+model;
	var query = "SELECT "+sheetColumns["Examination"]+", count("+sheetColumns["Techniques"]+
	" WHERE "+sheetColumns["Techniques"]+"=\'" +technique+ "\'";

	var query = "SELECT "+sheetColumns["Examination"]+
		", count("+sheetColumns["Examination"]+")"+
		" WHERE "+sheetColumns["Techniques"]+"=\'" +technique+ "\'"+
		" GROUP BY "+sheetColumns["Examination"];


	var queryEncoded = new google.visualization.Query(url + encodeURIComponent(query));
	queryEncoded.send( function(response){
			
			var data = extractDataTableFromAnswer(response);
			//console.log("Le nombre d'examinations de la Technique: "+Liste.getNumberOfRows());


			cleanElem("examination");
		 	var exaMenu = document.getElementById("examination");

		 	for (var i=0; i<data.getNumberOfRows(); i++) {
		 		/*ON NE GARDE PAS LES TECHNIQUES QUI ONT <= 1 RESULTAT*/
				if(data.getValue(i,1)>1){
		 			var opt = document.createElement('option');
					opt.innerHTML = "("+data.getValue(i,1)+"): "+data.getValue(i,0);
		    		opt.value = data.getValue(i,0);
		    		exaMenu.appendChild(opt);
		    	}
		    }

			exaMenu.style.display = 'inline';    
	});
}

function retrieveTechniquesNames(){

	/*String requete qui rend les techniques distinctes et le nombre de lignes
	resultats pour chacune*/
	var query = "SELECT "+sheetColumns["Techniques"]+
		", count("+sheetColumns["Techniques"]+
		") GROUP BY "+sheetColumns["Techniques"];

	/*url de la spreadsheet google. concatenation debut_url+ Spreadsheet Key + fin_url*/
	var url = "https://docs.google.com/spreadsheets/d/"+
		document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";

	sendQuery(url, query, printTechniquesNamesMenus);

	function printTechniquesNamesMenus(response){
		/*extract... renvoie un objet Datatable avec les donneess utiles dedans*/
		var data = extractDataTableFromAnswer(response);

		//console.log("distinct techniques in the spreadsheet :\n"+
		//	data.getDistinctValues(0)+"\n(techniques with <= 1 row removed from dropdown menu)");

		/*fragment HTML = objet conteneur qu'on remplit de noeuds HTML*/
		var fragment = document.createDocumentFragment();

		/*boucle d'ajout d'un noeud <option> de nom de technique dans le fragment HTML*/
		for (var i=0; i<data.getNumberOfRows(); i++) {
			/*ON NE GARDE PAS LES TECHNIQUES QUI ONT <= 1 RESULTAT*/
			if(data.getValue(i,1)>1){
				var opt = document.createElement('option');
				opt.innerHTML = "("+data.getValue(i,1)+"): "+data.getValue(i,0);
		    	opt.value = data.getValue(i,0);
		    	fragment.appendChild(opt);
			}
		}

		/*dropdown menus auxquels on veut ajouter les options*/
		var menu1 = document.getElementById("techX");
		var menu2 = document.getElementById("techY");
		var menu3 = document.getElementById("techChrono");

		/*ajout des options*/
		menu1.appendChild(fragment.cloneNode(true));
		menu2.appendChild(fragment.cloneNode(true));
		menu3.appendChild(fragment.cloneNode(true));

		/*on rend les menus visibles dans le document HTML*/
		menu1.style.display = 'inline';
		menu2.style.display = 'inline';
		menu3.style.display = 'inline';

		retrieveVersionsNames("X");
		retrieveVersionsNames("Y");
	}
}

function retrieveVersionsNames(axe){
	var tech;
	var version;

	if(axe=="X"){
		tech = document.getElementById("techX").value;
		version = "versionX";
	}
	if(axe=="Y"){
		tech = document.getElementById("techY").value;
		version = "versionY";
	}

	cleanElem(version);

	/*String requete qui rend les versions distinctes et le nombre de lignes
	resultats pour chacune*/
	var query = "SELECT "+sheetColumns["version"]+
		", count("+sheetColumns["version"]+
		") WHERE "+sheetColumns["Techniques"]+" = \""+tech+
		"\" GROUP BY "+sheetColumns["version"];

	/*url de la spreadsheet google. concatenation debut_url+ Spreadsheet Key + fin_url*/
	var url = "https://docs.google.com/spreadsheets/d/"+
		document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";

	sendQuery(url, query, printVersionsNamesMenus);

	function printVersionsNamesMenus(response){
		/*extract... renvoie un objet Datatable avec les donneess utiles dedans*/
		var data = extractDataTableFromAnswer(response);

		//console.log("distinct versions in the spreadsheet :\n"+
		//	data.getDistinctValues(0)+"\n(versions with <= 1 row removed from dropdown menu)");

		/*fragment HTML = objet conteneur qu'on remplit de noeuds HTML*/
		var fragment = document.createDocumentFragment();

		/*boucle d'ajout d'un noeud <option> de nom de version dans le fragment HTML*/
		for (var i=0; i<data.getNumberOfRows(); i++) {
			/*ON NE GARDE PAS LES VERSIONS QUI ONT <= 1 RESULTAT*/
			if(data.getValue(i,1)>1){
				var opt = document.createElement('option');
				opt.innerHTML = /*"("+data.getValue(i,1)+"): "+*/toDate(data.getValue(i,0));
		    	opt.value = data.getValue(i,0);
		    	fragment.appendChild(opt);
			}
		}

		/*dropdown menus auxquels on veut ajouter les options*/
		var menu1 = document.getElementById("versionX");
		var menu2 = document.getElementById("versionY");

		/*ajout des options*/
		menu1.appendChild(fragment.cloneNode(true));
		menu2.appendChild(fragment.cloneNode(true));

		/*on rend les menus visibles dans le document HTML*/
		menu1.style.display = 'inline';
		menu2.style.display = 'inline';
	}
}

function cleanArray(array) {
	var i, j, len = array.length, out = [], obj = {};
	for (i = 0; i < len; i++) {
	obj[array[i]] = 0;
	}
	for (j in obj) {
	out.push(j);
	}
	return out;
}

function cleanForm(){
		var toClean = ["comparedType", "techX", "techY", "comparedColumn", "versionX", "versionY"];
		for(var i=0; i<toClean.length; i++)
			cleanElem(toClean[i]);
}

function cleanElem(elem){
	var tmp = document.getElementById(elem);
	tmp.style.display = 'none';
	while (tmp.lastChild) 
  		tmp.removeChild(tmp.lastChild);
}

function toDate(n){
	var tab = (''+n);
	var s = tab[6]+tab[7]+"/"+tab[4]+tab[5]; // jour/mois
	s += "/"+tab[0]+tab[1]+tab[2]+tab[3]; // annee
	s += " "+tab[8]+tab[9]+":"+tab[10]+tab[11]; // heure
	console.log(s);
	return s;
}