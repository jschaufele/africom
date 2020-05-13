const axios = require("axios");
//const mockAdapter = require("axios-mock-adapter");
//let mock = new mockAdapter(axios);
const mdata = require("./mockdata");

module.exports = {
	data: async function () {
		//mock.onGet("https://sheet.best/api/sheets/1d5e73f5-6d17-4f57-ad23-77b7194e3043").reply(200, mdata._mockdata());
		let r = {};
		//	console.log("--------------->GETMUSTARD DATA DEV -----> ", process.env.NODE_ENV);
		if (process.env.NODE_ENV) {
			//		console.log("--------------->GETMUSTARD DATA SUCCESS DEV MODE !!!! -----> ");
			//return mdata._mockdata();
		}

		try {
			await axios
				.get("https://sheet.best/api/sheets/1d5e73f5-6d17-4f57-ad23-77b7194e3043")
				.then(function (response) {
					//	console.log("---------------> GETMUSTARD DATA SUCCESS -----> ");
					r = response.data;
				})
				.catch(function (error) {
					//	console.log("---------------> GETMUSTARD DATA ERROR ----->", error);
				});
		} catch (e) {
			console.log("getdata error--->", e);
		}
		//	mock.reset();
		return r;
	},
};
