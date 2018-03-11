function initialisation(){
	/*affiche les dropdown menus contenant les noms de toutes les colonnes de la Spreadsheet*/
	google.charts.setOnLoadCallback(retrieveColumnsNames);
}

function retrieveColumnsNames(){
	/*String requete qui ne rend qu'une seule ligne de resultat, peu importe laquelle*/
	var query = "LIMIT 1";

	/*url de la spreadsheet google. concatenation debut_url+ Spreadsheet Key + fin_url*/
	var url = "https://docs.google.com/spreadsheets/d/"+
		document.getElementById("key").value+"/gviz/tq?sheet=Sheet1&headers=1&tq=";

	/*Objet Query (le constructeur prend un url et une String bien formatee)*/
	var queryEncoded = new google.visualization.Query(url + encodeURIComponent(query));
	
	/*envoi de la requete. prend un nom de fonction a callback
	https://developers.google.com/chart/interactive/docs/reference#methods_11*/
	queryEncoded.send(printColumnsNamesMenus);

	function printColumnsNamesMenus(response){
		/*response est un objet QueryResponse passee par la methode send.
		https://developers.google.com/chart/interactive/docs/reference#methods_12*/

		/*Erreur si requete fausse*/
		if (response.isError()) {
			alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
			return;
		}

		/*donnees utiles dans l'objet QueryResponse*/
		var data = response.getDataTable();

		/*fragment HTML = objet conteneur qu'on remplit de noeuds HTML*/
		var fragment = document.createDocumentFragment();

		/*boucle d'ajout d'un noeud <option> de nom de colonne dans le fragment HTML*/
		for(var i=0; i<data.getNumberOfColumns(); i++){
			var opt = document.createElement('option');
			opt.innerHTML = data.getColumnId(i)+": "+data.getColumnLabel(i);
		    opt.value = data.getColumnId(i);
		    fragment.appendChild(opt);
		}

		/*dropdown menus auxquels on veut ajouter les options*/
		var menu = document.getElementById("comparedType");

		/*ajout des options*/
		menu.appendChild(fragment);

		/*on rend les menus visibles dans le document HTML*/
		menu.style.display = 'inline';
	}
}