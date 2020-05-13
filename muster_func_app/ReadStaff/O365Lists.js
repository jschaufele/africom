const axios = require("axios");
let accessToken = null;
module.exports.o365 = {
	init: (accesstoken) => {
		if (accesstoken) {
			accessToken = accesstoken;
		} else {
			return accessToken;
		}
	},
	getItem: async function (listName, filter) {
		try {
			console.log("----------------------------->getItem------------->", listName, filter);
			var r = {};
			filter = filter || "";
			if (filter != "") {
				filter = `&$filter=${filter}`;
			}
			await axios
				.get(
					`https://citseurope.sharepoint.com/sites/TeamCollab/_api/web/lists/getbytitle('${listName}')/items?$top=1000${filter}`,
					{
						headers: {
							Authorization: "Bearer " + accessToken,
							Accept: "application/json; odata=verbose",
							"Content-Type": "application/json; odata=verbose",
						},
					}
				)
				.then(function (response) {
					r = response.data.d.results;
				})
				.catch(function (error) {
					console.log("---------------> getItem ERROR ----->", error);
				});
		} catch (e) {
			console.log("getItem error 2 --->", e);
		}

		return r;
	},
	getAlertRoster: async function () {
		return await this.getItem("AlertRoster", "Missing ne 'Y'");
	},
	getDivisionItems: async function () {
		return await this.getItem("MusterAlertOncall", "Division ne 'CONTROL'");
	},
	getControlItem: async function () {
		return await this.getItem("MusterAlertOncall", "Division eq 'CONTROL'");
	},
	updateMusterAlertList: async function (info) {
		try {
			console.log("----------------------------->update------------->", info);

			var data = JSON.stringify({
				__metadata: { type: "SP.Data.MusterNotifyListItem" },
				Title: info.title,
				FullName: info.fullName,
				WorkEmail: info.workEmail,
				PersonalEmail: info.personalEmail,
				WorkEmailSvr: info.workEmailSvr,
				PersonalEmailSvr: info.personalEmailSvr,
			});
			console.log("----------------------------->update------------->", info, data);
			await axios
				.post(
					"https://citseurope.sharepoint.com/sites/TeamCollab/_api/web/lists/getbytitle('MusterNotify')/items",
					data,
					{
						headers: {
							Authorization: "Bearer " + accessToken,
							Accept: "application/json; odata=verbose",
							"Content-Type": "application/json; odata=verbose",
						},
					}
				)
				.then(function (response) {
					console.log("---------------> updatelist SUCCESS -----> ", JSON.stringify(response));
					//	r = response.data;
				})
				.catch(function (error) {
					console.log("---------------> updatelist ERROR ----->", error);
				});
		} catch (e) {
			console.log("updatelist error 2 --->", e);
		}
		return;
	},
};
