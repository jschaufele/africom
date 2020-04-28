// const axios = require("axios");
// const MockAdapter = require("axios-mock-adapter");
// const mockdata=require("axios-mock-adapter");
// let mock = new MockAdapter(axios);
// mock.onGet("https://sheet.best/api/sheets/1d5e73f5-6d17-4f57-ad23-77b7194e3043").reply(200, _mockdata());

// const getMusterData = async function getMusterData() {
// 	let r = {};
// 	try {
// 		await axios
// 			.get("https://sheet.best/api/sheets/1d5e73f5-6d17-4f57-ad23-77b7194e3043")
// 			.then(function (response) {
// 				console.log("---------------> SUCCESS -----> ");
// 				r = response.data;
// 			})
// 			.catch(function (error) {
// 				console.log("---------------> ERROR ----->", error);
// 			})
// 			.finally(function () {
// 				console.log("---------------> FINALLY ----->");
// 			});
// 	} catch (e) {
// 		console.log("getdata error--->", e);
// 	}
// 	return r;
// };
// function _mockdata() {
// 	return [
// 		{
// 			Timestamp: "3/16/2020 15:26:21",
// 			"Reporting Date": "3/16/2020",
// 			"Select Your Name": "Santillan, Ubaldo",
// 			"Present For Duty?": "Yes",
// 			"Are you feeling any COVID-19 symptoms?": "No",
// 			"Comments and/or questions": "Test update.",
// 			"Present for Duty Location": null,
// 			"Are you ill and taking PTO/sick time for any non-COVID-19 illness?": null,
// 		},
// 		{
// 			Timestamp: "3/17/2020 15:15:58",
// 			"Reporting Date": "3/16/2020",
// 			"Select Your Name": "Yurisevic, Ivan",
// 			"Present For Duty?": "Yes",
// 			"Are you feeling any COVID-19 symptoms?": "No",
// 			"Comments and/or questions": null,
// 			"Present for Duty Location": null,
// 			"Are you ill and taking PTO/sick time for any non-COVID-19 illness?": null,
// 		},

// 		{
// 			Timestamp: "3/18/2020 15:27:16",
// 			"Reporting Date": "3/15/2020",
// 			"Select Your Name": "Santillan, Ubaldo",
// 			"Present For Duty?": "Yes",
// 			"Are you feeling any COVID-19 symptoms?": "No",
// 			"Comments and/or questions": "Test update 1.1",
// 			"Present for Duty Location": null,
// 			"Are you ill and taking PTO/sick time for any non-COVID-19 illness?": null,
// 		},
// 		{
// 			Timestamp: "3/16/2020 15:49:52",
// 			"Reporting Date": "3/16/2020",
// 			"Select Your Name": "Molina, Lucia",
// 			"Present For Duty?": "Yes",
// 			"Are you feeling any COVID-19 symptoms?": "No",
// 			"Comments and/or questions": null,
// 			"Present for Duty Location": null,
// 			"Are you ill and taking PTO/sick time for any non-COVID-19 illness?": null,
// 		},
// 		{
// 			Timestamp: "3/17/2020 16:44:40",
// 			"Reporting Date": "3/16/2020",
// 			"Select Your Name": "Myers, Jeremy",
// 			"Present For Duty?": "Yes",
// 			"Are you feeling any COVID-19 symptoms?": "No",
// 			"Comments and/or questions": null,
// 			"Present for Duty Location": null,
// 			"Are you ill and taking PTO/sick time for any non-COVID-19 illness?": null,
// 		},
// 		{
// 			Timestamp: "3/18/2020 17:29:54",
// 			"Reporting Date": "3/16/2020",
// 			"Select Your Name": "Welsh, Raymond",
// 			"Present For Duty?": "Yes",
// 			"Are you feeling any COVID-19 symptoms?": "No",
// 			"Comments and/or questions": "Testing",
// 			"Present for Duty Location": null,
// 			"Are you ill and taking PTO/sick time for any non-COVID-19 illness?": null,
// 		},
// 		{
// 			Timestamp: "3/16/2020 19:33:30",
// 			"Reporting Date": "3/16/2020",
// 			"Select Your Name": "Dell, Michael",
// 			"Present For Duty?": "Yes",
// 			"Are you feeling any COVID-19 symptoms?": "No",
// 			"Comments and/or questions": "Telework ",
// 			"Present for Duty Location": null,
// 			"Are you ill and taking PTO/sick time for any non-COVID-19 illness?": null,
// 		},
// 		{
// 			Timestamp: "3/17/2020 20:27:20",
// 			"Reporting Date": "3/16/2020",
// 			"Select Your Name": "Craft, Jason",
// 			"Present For Duty?": "Yes",
// 			"Are you feeling any COVID-19 symptoms?": "No",
// 			"Comments and/or questions": null,
// 			"Present for Duty Location": null,
// 			"Are you ill and taking PTO/sick time for any non-COVID-19 illness?": null,
// 		},
// 		{
// 			Timestamp: "3/18/2020 21:29:02",
// 			"Reporting Date": "3/16/2020",
// 			"Select Your Name": "Wendeln, Michael",
// 			"Present For Duty?": "Yes",
// 			"Are you feeling any COVID-19 symptoms?": "No",
// 			"Comments and/or questions": null,
// 			"Present for Duty Location": null,
// 			"Are you ill and taking PTO/sick time for any non-COVID-19 illness?": null,
// 		},
// 	];
// }

// module.exports = {
// 	getMusterData: getMusterData,
// 	Util2: () => {
// 		return "INNNER 2";
// 	},
// };
