var fs = require("fs");
var adal = require("adal-node");
var updatelist = require("./O365Lists");
var utils = require("./utils");
var AuthenticationContext = adal.AuthenticationContext;
//var tokenresult = null;
function processTokenResponse(error, tokenResponse) {
	var t = null;
	var e = null;
	if (error) {
		e = error;
	}
	tokenresult = {
		error: error,
		token: tokenResponse,
	};
}
function getPrivateKey(filename) {
	var p = __dirname + "//" + filename;
	var privatePem = fs.readFileSync(p, { encoding: "utf8" });
	return privatePem;
}

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

module.exports = {
	getAuthToken: async function () {
		const params = {
			tenant: process.env.TENANT,
			authorityHostUrl: process.env.AUTHORITYHOSTURL,
			clientId: process.env.CLIENTID,
			thumbprint: process.env.THUMBPRINT,
			privateKeyFile: process.env.PRIVATEKEYFILE,
			authorityUrl: `${process.env.AUTHORITYHOSTURL}/${process.env.TENANT}`,
			spo_resource: process.env.SPO_RESOURCE,
			graph_resource: process.env.GRAPH_RESOURCE,
		};
		turnOnLogging();
		var authContext = new AuthenticationContext(params.authorityUrl);
		var key = getPrivateKey(params.privateKeyFile);
		// var t = {};
		var tokenresult = null;
		authContext.acquireTokenWithClientCertificate(
			params.spo_resource,
			params.clientId,
			key,
			params.thumbprint,
			function (error, tokenResponse) {
				var t = null;
				var e = null;
				if (error) {
					e = error;
				}

				tokenresult = {
					error: error,
					token: tokenResponse,
				};
			}
		);

		do {
			await utils.sleep(500);
		} while (!tokenresult);

		return tokenresult;
	},
};

// var token = {};
// authContext.acquireTokenWithClientCertificate(params.spo_resource, params.clientId, key, params.thumbprint, function (
// 	err,
// 	tokenResponse
// ) {
// 	if (err) {
// 		console.log("well that didn't work: " + err.stack);
// 	} else {
// 		let r = {};
// 		let data = JSON.stringify({
// 			__metadata: { type: "SP.Data.MusterNotifyListItem" },
// 			Title: "Test ",
// 			Email: "jack@schaufele.com",
// 			SMSNumber: "+17202173519",
// 		});
// 		try {
// 			axios
// 				.post(
// 					"https://citseurope.sharepoint.com/sites/TeamCollab/_api/web/lists/getbytitle('MusterNotify')/items",
// 					data,
// 					{
// 						headers: {
// 							Authorization: "Bearer " + tokenResponse.accessToken,
// 							Accept: "application/json; odata=verbose",
// 							"Content-Type": "application/json; odata=verbose",
// 						},
// 					}
// 				)
// 				.then(function (response) {
// 					console.log("---------------> SUCCESS -----> ", JSON.stringify(response.data));
// 					r = response.data;
// 				})
// 				.catch(function (error) {
// 					console.log("---------------> ERROR ----->", error);
// 				});
// 			// .finally(function () {
// 			// 	console.log("---------------> FINALLY ----->");
// 			// });
// 		} catch (e) {
// 			console.log("getdata error--->", e);
// 		}
// 		//return r;
// 	}
// });
