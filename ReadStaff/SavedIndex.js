var fs = require("fs");
var adal = require("adal-node");
var graph = require("@microsoft/microsoft-graph-client");
const axios = require("axios");
//var graph = require("./graph");
require("isomorphic-fetch");
var AuthenticationContext = adal.AuthenticationContext;

function turnOnLogging() {
	var log = adal.Logging;
	log.setLoggingOptions({
		level: log.LOGGING_LEVEL.VERBOSE,
		log: function (level, message, error) {
			console.log(message);
			if (error) {
				console.log(error);
			}
		},
	});
}

var parametersFile = process.argv[2] || process.env["ADAL_SAMPLE_PARAMETERS_FILE"];

function getPrivateKey(filename) {
	var p = __dirname + "//africom.pem";
	console.log("----------------------------->  file-->", p);

	var privatePem = fs.readFileSync(p, { encoding: "utf8" });
	return privatePem;
}
// var sampleParameters;
// if (parametersFile) {
// 	var jsonFile = fs.readFileSync(parametersFile);
// 	if (jsonFile) {
// 		sampleParameters = JSON.parse(jsonFile);
// 	} else {
// 		console.log("File not found, falling back to defaults: " + parametersFile);
// 	}
// }

sampleParameters = {
	tenant: "citseurope.onmicrosoft.com",
	authorityHostUrl: "https://login.windows.net",
	clientId: "8f007486-f72a-4e43-848c-281298e450f7",
	thumbprint: "39E31D546219CA43D3577C62310EDB9B9CE74AEB",
	privateKeyFile: "sample.dat",
};

var authorityUrl = sampleParameters.authorityHostUrl + "/" + sampleParameters.tenant;

var resource = "8f007486-f72a-4e43-848c-281298e450f7"; //" "e872fcb9-69cf-4a2d-801e-25438715dac2";

function getAuthenticatedClient(accessToken) {
	// Initialize Graph client
	const client = graph.Client.init({
		// Use the provided access token to authenticate
		// requests
		authProvider: (done) => {
			done(null, accessToken);
		},
	});

	return client;
}

async function signInComplete(err, token) {
	if (!token.accessToken) {
		return done(new Error("No TOKEN FOUND."), null);
	}
	console.log("-------------->token----->", token);
	try {
		const client = getAuthenticatedClient(token.accessToken);
		try {
			const user = await client.api("/me").get();
			if (user) {
				// Add properties to profile
				profile["email"] = user.mail ? user.mail : user.userPrincipalName;
			}
		} catch (err) {
			console.log("----err getting user--->", err);
			return done(err, null);
		}
		//const user = await graph.getUserDetails(token.accessToken);
	} catch (err) {
		console.log("----err getting getAuthenticatedClient--->", err);
		return done(err, null);
	}

	// Save the profile and tokens in user storage
	//users[profile.oid] = { profile, accessToken };
	return done(null, accessToken);
}

module.exports = async function (context, req) {
	turnOnLogging();
	var authContext = new AuthenticationContext(authorityUrl);
	var key = getPrivateKey(sampleParameters.privateKeyFile);
	//	console.log("----------->filedata----------->", key);
	var token = {};

	// authContext.acquireTokenWithClientCredentials(
	// 	"https://graph.microsoft.com/",

	// 	sampleParameters.clientId,
	// 	"dUAEd6kFuL_kK7Gq.XiZJPs?Ax5e=pX2",
	// 	function (err, tokenResponse) {
	// 		if (err) {
	// 			console.log("well that didn't work: " + err.stack);
	// 		} else {
	// 			console.log("------------------------->token-------------------->>\n\n", tokenResponse);
	// 			var accesstoken = tokenResponse.accessToken;
	// 			// var options = {
	// 			// 	method: "GET",
	// 			// 	uri: "https://graph.microsoft.com/beta/groups",
	// 			// 	headers: {
	// 			// 		Accept: "application/json;odata.metadata=full",
	// 			// 		Authorization: "Bearer " + accesstoken,
	// 			// 	},
	// 			// };

	// 			// context.log(options);
	// 			// request(options, function (error, res, body) {
	// 			// 	context.log(error);
	// 			// 	context.log(body);
	// 			// 	context.res = { body: body || "" };
	// 			// 	context.done();
	// 			// });

	// 			let r = {};
	// 			try {
	// 				axios
	// 					//.get("https://citseurope.sharepoint.com/sites/TeamCollab/_api/web/lists/getbytitle('Team Collab')/items", {
	// 					.get("https://graph.microsoft.com/v1.0/sites/root", {
	// 						headers: {
	// 							Authorization: "Bearer " + tokenResponse.accessToken,
	// 							Accept: "application/json;odata.metadata=full",
	// 							//	"Content-Type": "application/json; odata=verbose",
	// 						},
	// 					})
	// 					.then(function (response) {
	// 						console.log("---------------> SUCCESS -----> ", response.data);
	// 						r = response.data;
	// 					})
	// 					.catch(function (error) {
	// 						console.log("---------------> ERROR ----->", error);
	// 					});
	// 				// .finally(function () {
	// 				// 	console.log("---------------> FINALLY ----->");
	// 				// });
	// 			} catch (e) {
	// 				console.log("getdata error--->", e);
	// 			}
	// 		}
	// 	}
	// );

	//acquireTokenWithClientCredentials(resource: string, clientId: string, clientSecret: string, callback: AcquireTokenCallback)

	authContext.acquireTokenWithClientCertificate(
		//"https://citseurope.sharepoint.com/",
		"https://graph.microsoft.com/",
		//"8f007486-f72a-4e43-848c-281298e450f7",
		sampleParameters.clientId,
		key,
		sampleParameters.thumbprint,
		//signInComplete
		function (err, tokenResponse) {
			if (err) {
				console.log("well that didn't work: " + err.stack);
			} else {
				let r = {};
				try {
					axios
						.get(
							"https://citseurope.sharepoint.com/sites/MusterNotify/_api/web/lists/getbytitle('Team Collab')/items",
							{
								//.get("https://graph.microsoft.com/v1.0/sites/root", {
								headers: {
									Authorization: "Bearer " + tokenResponse.accessToken,
									Accept: "application/json; odata=verbose",
									"Content-Type": "application/json; odata=verbose",
									//Accept: "application/json;odata.metadata=full",
									//	"Content-Type": "application/json; odata=verbose",
								},
							}
						)
						.then(function (response) {
							console.log("---------------> SUCCESS -----> ", response.data);
							r = response.data;
						})
						.catch(function (error) {
							console.log("---------------> ERROR ----->", error);
						});
					// .finally(function () {
					// 	console.log("---------------> FINALLY ----->");
					// });
				} catch (e) {
					console.log("getdata error--->", e);
				}
				//return r;
			}
		}
	);

	context.res = {
		body: "inside",
	};
};
