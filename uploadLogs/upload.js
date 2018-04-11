//var indexId = "1dKd2VkHRqKccKgaT_l4LtvH4zoiDhWfo-UuHBEF4Mko";
console.log("a");
// Client ID and API key from the Developer Console
var CLIENT_ID = '1034390180382-m8182r44nbneu9ubqrhh5n2k1udcllpi.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAIQTtIoHf8_gX1gLZhZQACOAShvPNaW7c';
console.log("b");
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
DISCOVERY_DOCS.push("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest");
console.log("c");
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
SCOPES += " https://www.googleapis.com/auth/drive.file";
console.log("d");
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *
 */
function handleFile(file) {
	var reader = new FileReader();
	reader.onload = function(e) {
  		var text = reader.result;
  		console.log("file: \n"+text);
	};
	reader.readAsText(file);
}


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
	console.log("e");
	gapi.load('client:auth2', initClient);
	console.log("f");
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
 function initClient() {
 	console.log("g");
	gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		discoveryDocs: DISCOVERY_DOCS,
		scope: SCOPES
	}).then(function () {
		console.log("h");
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignoutClick;
		console.log("i");		
	});
 }

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
 function updateSigninStatus(isSignedIn) {
 	if (isSignedIn) {
 		authorizeButton.style.display = 'none';
 		signoutButton.style.display = 'block';
 		exec();
 	} else {
 		authorizeButton.style.display = 'block';
 		signoutButton.style.display = 'none';
 	}
 }

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}
	  
/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
	var pre = document.getElementById('content');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}

/**
 *
 */
 function exec() {

 	/*LIRE UNE SHEET AVEC L'API GOOGLE SHEET*/
 	gapi.client.sheets.spreadsheets.values.get({
 		spreadsheetId: '14cQyAjuJiXlpnLGenrAB4RPeRFZA99eVDGcW05HrXio',
 		range: 'C2:E5',
 	}).then(function(response) {
 		var range = response.result;
 		if (range.values.length > 0) {
 			for (i = 0; i < range.values.length; i++) {
 				var row = range.values[i];
				// Print columns A and E, which correspond to indices 0 and 4.
				appendPre(row[0]+', '+row[1]+', '+row[2]+', '+
					row[3]+', '+row[4]+', '+row[5]+', '+row[6	]) ;
			}
		} else {
			appendPre('No data found.');
		}
	}, function(response) {
		appendPre('Error: ' + response.result.error.message);
	});

 	/*UPLOAD UN FICHIER AVEC L'API GOOGLE DRIVE*/
 	var fileMetadata = {'name': 'photo.jpg'};
 	var media = {
 		mimeType: 'image/jpeg',
 		body: "ab"/*fs.createReadStream('files/photo.jpg')*/
 	};
 	console.log("j");
 	gapi.client.drive.files.create({
 		resource: fileMetadata,
 		media: media,
 		fields: 'id'
 	}, function (err, file) {
 		if (err) {
			// Handle error
			console.error(err);
		} else {
			console.log('File Id: ', file.id);
		}
	});
	console.log("k");

 }