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
			var wp = AFC.Notices;
			var settings = {
				announcements: {
					site: "https://portal.usafricom.mil/info",
					list: "Announcements",
					viewall: "https://portal.usafricom.mil/info/Lists/Announcements/AllItems.aspx",
					ordercol: "Id",
					itemsReturned: 1,
					order: "desc",
				},
				commanderscorner: {
					site: "https://portal.usafricom.mil",
					list: "Commander''s Corner",
					viewall: "https://portal.usafricom.mil/CommandersCorner/Forms/MainView.aspx",
					ordercol: "Order0",
					itemsReturned: 5,
					order: "asc",
					biography: "https://portal.usafricom.mil/orgs/J0/J00/Shared%20Documents/General%20Townsend%20Bio.pdf",
				},
				hqcommandant: {
					site: "https://portal.usafricom.mil/orgs/j03/J031",
					list: "Weekly Newsletter",
					viewall: "https://portal.usafricom.mil/orgs/j03/J031/WeeklyNewsletter/Forms/AllItems.aspx",
					ordercol: "Id",
					itemsReturned: 1,
					order: "desc",
				},
				publicaffairs: [
					{
						docUrl: "https://www.africom.mil/media-room/articles",
						title: "News Articles",
					},
					{
						docUrl: "https://www.africom.mil/media-room/press-releases",
						title: "Press Releases",
					},
				],
				directorate: {
					site: "https://portal.usafricom.mil/orgs/J6",
					list: "News You Can Use",
					viewall: "https://portal.usafricom.mil/orgs/J6/NewsUse/Forms/AllItems.aspx",
					ordercol: "Id",
					itemsReturned: 1,
					order: "desc",
				},
				divId: id,
			};

			wp.init(settings);
		}

		function init() {
			var util = AFC.Util;
			util.init({}, "/jslibs/custom/announments.js", func_base + ".setInit");
		}
		return {
			init: init,
			setInit: setInit,
		};
	})(window);

	_spBodyOnLoadFunctionNames.push(func_base + ".init");
})();
