# Test de query sur google sheet

<html>
<body>

	<!--formulaire de configuration-->
	<form name="formulaireAjout">
		<!--URL-->
		<label for="url">Spreadsheet à analyser :</label>
		<select id="url">
			<option value="1ZLSqWxT4YT8zhg84WeoeGjCxDbuOWO_BVvS9J3IBKgo">csv001-100</option>
			<option value="1k1vyrsKs8A8aXDs4HkwkgHPCWvW-41h_F6PS93GHjbo">csv101-200</option>
			<option value="1MCmsdKAIQKuC9amV3V2XeKL6GpCxNG5aeU0byjt8agg">csv201-300</option>
			<option value="1FxiAz3-yENo_WQyM9_g8m9r_7BTYlu1Isqe5iuWcPUo">csv301-400</option>
			<option value="1Yhsm4LnZvbe-dEENoEKff-Z0Zfa2zu-GN_Aa3NJDbco" selected="selected">csv401-500</option>
		</select>
		<br />
		<!--plage de builds-->
		<label for="fromBuild">Builds : de </label>
		<input type="text" id="fromBuild" placeholder="401" value="401" />
		<label for="toBuild"> jusqu'à </label>
		<input type="text" id="toBuild" placeholder="500" value="500" />
		<br />
		<!--type de la comparaison-->
		<label for="comparedType">comparer sur</label>
		<select id="comparedType">
			<option value="duration" selected="selected">duration(ms)</option>
		</select>
		<br />
		<!--technique en abscisse dans le graphe-->
		<label for="techX">technique en abscisse :</label>
		<select id="techX">
			<option value="-its">-its</option>
			<option value="-ltsminpath" selected="selected">-ltsminpath</option>
			<option value="-its -smt -ltsminpath">-its -smt -ltsminpath</option>
			<option value="-ltsminpath -its -smt">-ltsminpath -its -smt</option>
		</select>
		<br />
		<!--technique en ordonnee dans le graphe-->
		<label for="techY">technique en ordonnée :</label>
		<select id="techY">
			<option value="-its">-its</option>
			<option value="-ltsminpath">-ltsminpath</option>
			<option value="-its -smt -ltsminpath">-its -smt -ltsminpath</option>
			<option value="-ltsminpath -its -smt" selected="selected">-ltsminpath -its -smt</option>
		</select>
		<br />
		<!--booleen pour enlever les tests failed-->
		<label for="removeFailed">enlever les tests failed</label>
		<input type="checkbox" id="removeFailed" />
		<br />
		<!--bouton pour lancer la recherche-->
		<input type="button" value="Go" onclick="startQueryingScatterPlot()" /> <br /><br />
		<!-- les cases à cochées pour le chrono -->
		<INPUT type="checkbox" name="AirplaneLD" value="AirplaneLD-PT-0010">AirplaneLD
		<INPUT type="checkbox" name="Angiogenesis" value="Angiogenesis-PT-01"> Angiogenesis
		<INPUT type="checkbox" name="AutoFlight" value="AutoFlight-PT-01a"> AutoFlight
		<INPUT type="checkbox" name="BridgeAndVehicles" value="BridgeAndVehicles-COL-V04P05N02"> BridgeAndVehicles <br />
		<input type="button" value="chronogramme" onclick="drawChronoAffiche()" />
	</form>

	<!--div des elements graphiques qui seront ajoutes par les fonctions JS-->
	<div id="table_div" style="width: 600px; height: 200px; border : 1px #000 solid;"></div>
	<div id="chart_div" style="width: 600px; height: 500px; border : 1px #000 solid;"></div>
	<div id="chrono_div" style="width: 600px; height: 300px; border : 1px #000 solid;"></div>
	
	<!--chargement du loader de lib google charts (+ajax)-->
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	<!--chargement de la lib google charts-->
	<script type="text/javascript">google.charts.load('current', {'packages':['corechart','table']});</script>
	<script type="text/javascript">
		google.charts.load('current', {'packages':['line']});
	</script>
	<!--chargement des fonctions custom JS-->
	<script type="text/javascript" src="functions.js"></script>

</body>
</html>