var AFC = window.AFC || {};
(function () {
	var seed = new Date().getTime();
	var func = "f_" + seed;
	var func_base = "AFC." + func;
	AFC[func] = (function (win, undefined) {
		var script = document.createElement("script");
		script.src = _spPageContextInfo.webAbsoluteUrl + "/jslibs/custom/africom_utils.js";
		//var d = document.createAttribute("defer");
		//script.setAttributeNode(d);
		document.write(script.outerHTML);
		var s = new Date().getTime();
		var id = "id_" + s;
		document.write("<div id='" + id + "'></div>");
		function setInit() {
			var opts = {
				divId: id,
				container: { title: "Personnel Support" },
				arriving: {
					title: "Arriving",
					site: "/info",
					list: "Buttons Inprocessing",
					url: "/info/Pages/Arriving%20Personnel.aspx",
					// image - inline default in personnel script
				},
				current: {
					title: "Current",
					site: "/info",
					list: "Buttons Current Personnel",
					url: "/info/Pages/Current%20Personnel.aspx",
					// image - inline default in personnel script
				},
				departing: {
					title: "Departing",
					site: "/info",
					list: "Buttons Outprocessing",
					url: "/info/Pages/Departing%20Personnel.aspx",
					// image - inline default in personnel script
				},
			};

			var wp = AFC.Personnel;
			wp.init(opts);
		}
		function init() {
			var util = AFC.Util;
			util.init({}, "/jslibs/custom/personnel.js", func_base + ".setInit");
		}

		return {
			init: init,
			setInit: setInit,
		};
	})(window);

	_spBodyOnLoadFunctionNames.push(func_base + ".init");
})();
