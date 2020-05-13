module.exports = {
	sleep: async function (ms) {
		return new Promise((r) => setTimeout(r, ms));
	},
};
