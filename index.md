# Test de query sur google sheet

[DIY test a Query](test.html){:target="_blank"}

<html>
<body>

	<div>
		<!--URL-->
		<label for="key">Spreadsheet à analyser :</label>
		<input type="text" id="key" placeholder="Spreadsheet Key" value="1Yhsm4LnZvbe-dEENoEKff-Z0Zfa2zu-GN_Aa3NJDbco" />
		<!--choix de keyss preremplies-->
		<label for="keysChoice"> ou </label>
		<select id="keysChoice" onclick='document.getElementById("key").value = document.getElementById("keysChoice").value ;'>
			<option value="1ZLSqWxT4YT8zhg84WeoeGjCxDbuOWO_BVvS9J3IBKgo">csv001-100</option>
			<option value="1k1vyrsKs8A8aXDs4HkwkgHPCWvW-41h_F6PS93GHjbo">csv101-200</option>
			<option value="1MCmsdKAIQKuC9amV3V2XeKL6GpCxNG5aeU0byjt8agg">csv201-300</option>
			<option value="1FxiAz3-yENo_WQyM9_g8m9r_7BTYlu1Isqe5iuWcPUo">csv301-400</option>
			<option value="1Yhsm4LnZvbe-dEENoEKff-Z0Zfa2zu-GN_Aa3NJDbco" selected>csv401-500</option>
		</select>
		<br />
		<!--reload menu button-->
		<input type="button" value="Load Menu" onclick="initialisation()" />
	</div>
		<br />
		<br />	
	<!--formulaire de configuration-->
	<form id="formConfig">
		<!--plage de builds-
		<label for="fromBuild">Builds : de </label>
		<input type="text" id="fromBuild" placeholder="401" value="401" />
		<label for="toBuild"> jusqu'à </label>
		<input type="text" id="toBuild" placeholder="500" value="500" />
		<br />-->
		
		<!--type de la comparaison-->
		<label for="comparedType">comparer sur</label>
		<select id="comparedType" style="display:none"></select>
		<br />
		
		<!--technique en abscisse dans le graphe-->
		<label for="techX">technique en abscisse :</label>
		<select id="techX" style="display:none"></select>
		<br />
		
		<!--technique en ordonnee dans le graphe-->
		<label for="techY">technique en ordonnée :</label>
		<select id="techY" style="display:none"></select>
		<br />
		
		<!--booleen pour enlever les tests failed-->
		<label for="removeFailed">enlever les tests failed</label>
		<input type="checkbox" id="removeFailed" checked />
		<br />
		
		<!--bouton pour lancer la recherche ScatterChart
			setOnLoadCallBack prend le nom d'une fonction en argument, et la lance
			(seulement si les librairies JS de google ont fini de charger)-->
		<input type="button" value="Scatter Chart" onclick="google.charts.setOnLoadCallback(startScatterChart)" /> 

		<br />
		<br />
		<br />
		
		<!-- Les champs modèle pour le chrono -->
		<label for="model">modèle :</label>
		<input type="text" id="model" placeholder="AirplaneLD-COL-0010" value="AirplaneLD-COL-0010" />
		<label for="regex">Regex ?</label>
		<input type="checkbox" id="regex" checked />
		<br />
		<label for="examination"> examination :</label>
		<input type="text" id="examination" placeholder="LTLCardinality" value="LTLCardinality" />
		<br />

		<!--bouton pour lancer la recherche Chronogramme-->
		<input type="button" value="Chronogramme" onclick="google.charts.setOnLoadCallback(drawChronoAffiche())" />
	</form>

	<!--div des elements graphiques qui seront ajoutes par les fonctions JS-->
	<div id="chrono_div" style="width: 600px; height: 300px; border : 1px #000 solid;"></div>
	<div id="table_div" style="width: 600px; height: 200px; border : 1px #000 solid;"></div>
	<div id="chart_div" style="width: 600px; height: 500px; border : 1px #000 solid;"></div>
	

	<!--chargement du loader de lib google charts (+ajax)-->
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	
	<!--chargement de la lib google charts-->
	<script type="text/javascript">google.charts.load('current', {'packages':['corechart','table']}); google.charts.load('current');</script>

	<!--chargement des fonctions custom JS-->
	<script type="text/javascript" src="functions.js"></script>
	<script type="text/javascript" src="init.js"></script>
	<script type="text/javascript">initialisation();</script>

</body>
</html>