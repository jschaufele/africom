var ANC = window.ANC || {};

function initanc() {
	var settings = {
		jqUrl: "/jslibs/jQuery/1.10.2/jquery-1.10.2.min.js",
		bsUrl: "/jslibs/bootstrap/bootstrap-3.3.5-dist/js/bootstrap.js",
		bsCssUrl: "/jslibs/bootstrap/bootstrap-3.3.5-dist/css/bootstrap.min.css",
		fontawesome: "/jslibs/font-awesome/font-awesome-4.5.0/css/font-awesome.min.css",
	};

	ANC.Util.init(settings, ANC.Notices.init);
}

_spBodyOnLoadFunctionNames.push("initanc");

ANC.Util = (function (win, undefined) {
	/*  var settings = {
  
          jqUrl: "/jslibs/jQuery/1.10.2/jquery-1.10.2.min.js",
          bsUrl: "/jslibs/bootstrap/bootstrap-3.3.5-dist/js/bootstrap.js",
          bsCssUrl: "/jslibs/bootstrap/bootstrap-3.3.5-dist/css/bootstrap.min.css",
          fontawesome:"/jslibs/font-awesome/font-awesome-4.5.0/css/font-awesome.min.css",
          fontawesomewoff:"/jslibs/font-awesome/font-awesome-4.5.0/fonts/fontawesome-webfont.woff2?v=4.5.0"
      };
  */
	var settings = {};

	function localExtend(a, b) {
		for (var key in b) if (b.hasOwnProperty(key)) a[key] = b[key];
		return a;
	}
	function loadScript(url, callback) {
		var script = document.createElement("script");
		script.type = "text/javascript";

		if (script.readyState) {
			//IE
			script.onreadystatechange = function () {
				if (script.readyState == "loaded" || script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else {
			//Others
			script.onload = function () {
				callback();
			};
		}

		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	function init(o, callback) {
		// should be called in _spBodyOnLoadFunctionNames vs document ready
		var options = typeof o !== "undefined" ? o : {};
		settings = localExtend(settings, options);
		Object.keys(settings).forEach(function (k, i, arr) {
			settings[k] = _spPageContextInfo.webAbsoluteUrl + settings[k];
		});

		if (window.jQuery) {
			if (!(typeof $().modal == "function")) {
				$("head").append($('<link rel="stylesheet" type="text/css" />').attr("href", settings.bsCssUrl));
				$("head").append($('<link rel="stylesheet" type="text/css" />').attr("href", settings.fontawesome));
				//	$('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', settings.fontawesomewoff));
				// assume if BS is not loaded might as well load font awesome-

				$.getScript(settings.bsUrl, callback);
			} else {
				callback();
			}
		} else {
			var cb = function (callback) {
				$("head").append($('<link rel="stylesheet" type="text/css" />').attr("href", settings.bsCssUrl));
				$("head").append($('<link rel="stylesheet" type="text/css" />').attr("href", settings.fontawesome));
				//	$('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', settings.fontawesomewoff));

				$.getScript(settings.bsUrl, callback);
			};
			var cbbound = cb.bind(null, callback);
			loadScript(settings.jqUrl, cbbound);
		}
	}
	function findCss(fileName) {
		// can find if font-awesome is loaded
		var finderRe = new RegExp(fileName + ".*?.css", "i");
		var linkElems = document.getElementsByTagName("link");
		for (var i = 0, il = linkElems.length; i < il; i++) {
			if (linkElems[i].href && finderRe.test(linkElems[i].href)) {
				return true;
			}
		}
		return false;
	}
	return {
		loadScript: loadScript,
		init: init,
	};
})(window);

ANC.Notices = (function (win, undefined) {
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
	};

	var cHtmlParts = {};
	cHtmlParts["css"] =
		"<style>.announcements-container{border: 1px solid rgb(128, 128, 128);padding: 10px;background: rgb(243, 243, 243);}.announcements-container h2{color: rgb(96, 96, 96);margin-bottom: 5px !important;margin-top: 5px !important;font-size: large !important;}.announcements-container .icon{color: rgb(96, 96, 96);margin-right: 5px;}.announcement-item, .announcement-item:visited{color: #666666 !important;line-height: 1.8em;}.more-link{margin-top: 5px;}.more-link a:visited{color: #125ab2;} .link-section{margin-top: 20px;padding-left: 10px;}.link-header{font-size: large !important;margin-bottom:5px;text-decoration: underline;}.link-header a{text-decoration: underline;}.link-header a:visited{color: #337ab7;}.link-header a:visited:hover{color: #23527c;}.link-item a{color: #666666;}.link-item a:hover{text-decoration: none;}.right-container{margin-right: 15px;} </style>";
	cHtmlParts["wrapper"] =
		'<div class="bootstrap-iso"><div class="row"><div class="col-md-12"><div class="right-container">{0}{1}{2}{3}{4}</div></div></div></div>';
	cHtmlParts["announcement"] =
		'<div id="announcements"> <div class="announcements-container"> <h2><span class="icon fa fa-bullhorn"></span>Announcements</h2> <div> <a class="announcement-item" href="{0}" target="_blank" >New! Portal Service Request on NIPR</a> </div><div class="more-link"><a target="_blank" href="{1}">More...</a></div></div></div>';
	cHtmlParts["commandant-section"] = '<div id="commandant-section" class="link-section">{0}</div>';
	cHtmlParts["link-header"] = '<div class="link-header">{0}</div>';
	cHtmlParts["link-image"] = '<img style="padding-bottom: 2px;" align="right" src="{0}">';
	cHtmlParts["link-item"] = '<div class="link-item">{0}</div>';
	cHtmlParts["href-modal"] =
		'<a href="#" onclick="javascript:ANC.Notices.openDialog(\'{0}\');"><span class="fa fa-file-text-o"></span> {1}</a>';
	cHtmlParts["href-newpage"] = '<a href="{0}" target="_blank"><span class="fa fa-file-text-o"></span> {1}</a>';
	cHtmlParts["view-all"] =
		'<div class="link-item" style="color: #808080; font-size: x-small; padding-bottom:3px; padding-top:3px;"> <a href="{0}" target="_blank"><em>View All...</em></a></div>';
	cHtmlParts["biography"] =
		'<div class="link-item" style="color: #808080; font-size: x-small; padding-bottom:3px; padding-top:3px;" align="right"><a href="#" onclick="javascript:ANC.Notices.openDialog(\'{0}\')"><em>Biography</em></a> </div>';
	cHtmlParts["archive"] =
		'<div class="link-item"><a href="{0}" target="_blank"><span class="fa fa-archive"></span> Archive</a></div>';

	var starimg =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAQAAAADHm0dAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAHdElNRQfjCgkCOA0BFoCPAAACGklEQVQoz5WTT0gUcRTHP7+Z3+w4s+uqpItRqCutHTrYH1n6A8VehDBEEsIO0aU/54IOnevULSiChKBuHqPwEtShiwShaLV0yGhbWlEzd3d2ZmdmZ6aDVDiR0Ls8eN8Pj/felyeIxTjH6aCLqbiAiBeKCF3mtTn8/piixFEdbUi/nehP/NU1hr7FRJyOToajCks7oyHlLnvCI5hstqd2QhexqZ0oH9wkyJOXzP4btciq3mTZsFBS0WRFZLeh8oWSSXfooRGaJKOkNcCoSQKXcCw955TnG2bDtIVrOeub0lWdi1xpa5e60ElIrUN6SCzoMx4FPn7kBp5f8+/Wp9XLofOR7rDgdvptqqYrSVw0fHyEUpVCF2Yjsh+406Yr4A2q1rpo3ar22kA3KQR1FJIEaPC1ddOZ0VoFVJhmKkzOO4vB4UpmgWUcAkzWKdPEWFCuPnx2JCz8MfY5Lvohe6aeS1GjxDFyrBEU5TneeZzausAWeoYltErV/84an3B4TQ+DeK1gFbLxu6pE++lr8ZkmCWq8pMTGQHWoHrfgGx7BSJRaxWOvvW8xa4cUqbaHIwEfflmwlSqk5UbeZxf6e3mHWWMsdSN9QEM5qqt2sK1rQLXHG05Y3feN8cKTxvqFx2K87Z5WD4e9TGyAFm7OLBnnjWuDy71cQrBnWV6XU+JLPdfc/gVPEbs7o+LKWXp+r1HiFX2ZH4qyMsF/xk/BEMqZ58C/ngAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0xMC0wOVQwMjo1NjoxMy0wNDowMNRiL5AAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMTAtMDlUMDI6NTY6MTMtMDQ6MDClP5csAAAAAElFTkSuQmCC";

	function init(o) {
		if (typeof jQuery === "undefined") {
			alert("jQuery is required for the announcements");
			return;
		}
		if (!(typeof $().modal == "function")) {
			alert("Bootstrap is required for the announcements");
			return;
		}
		var options = isNullEmptyUndefined(o) ? {} : o;
		settings = $.extend(settings, options);

		var an = getDocuments(settings.announcements);
		var cc = getDocuments(settings.commanderscorner);
		var hq = getDocuments(settings.hqcommandant);
		var dir = getDocuments(settings.directorate);

		var announcements = cHtmlParts["announcement"].format(
			"{0}/lists/{1}/DispForm.aspx?ID={2}".format(settings.announcements.site, settings.announcements.list, an[0].id),
			settings.announcements.viewall
		);
		var si = cHtmlParts["link-image"].format(starimg);
		var ch = cHtmlParts["link-header"].format("Commander's Corner{0}{1}{2}{3}".format(si, si, si, si));
		var ci = "";
		for (var x = 0; x < cc.length; x++) {
			ci = ci + cHtmlParts["link-item"].format(cHtmlParts["href-modal"].format(cc[x].docUrl, cc[x].title));
		}
		ci = ci + cHtmlParts["view-all"].format(settings.commanderscorner.viewall);
		ci = cHtmlParts["biography"].format(settings.commanderscorner.biography) + ci;

		var commandersCorner = cHtmlParts["commandant-section"].format(ch + ci);

		var hh = cHtmlParts["link-header"].format("HQ&nbspCommandant");
		var hi = "";
		for (var x = 0; x < hq.length; x++) {
			hi = hi + cHtmlParts["link-item"].format(cHtmlParts["href-newpage"].format(hq[x].docUrl, hq[x].title));
		}

		var hqcommandant = cHtmlParts["commandant-section"].format(
			hh + hi + cHtmlParts["archive"].format(settings.hqcommandant.viewall)
		);

		var pa = cHtmlParts["link-item"].format(
			cHtmlParts["href-newpage"].format(settings.publicaffairs[0].docUrl, settings.publicaffairs[0].title)
		);
		pa =
			pa +
			cHtmlParts["link-item"].format(
				cHtmlParts["href-newpage"].format(settings.publicaffairs[1].docUrl, settings.publicaffairs[1].title)
			);

		var publicaffairs = cHtmlParts["commandant-section"].format(
			cHtmlParts["link-header"].format("Public&nbsp;Affairs") + pa
		);
		var dh = cHtmlParts["link-header"].format("J6&nbsp;Directorate");
		var di = "";
		for (var x = 0; x < dir.length; x++) {
			di = di + cHtmlParts["link-item"].format(cHtmlParts["href-newpage"].format(dir[x].docUrl, dir[x].title));
		}

		var directorate = cHtmlParts["commandant-section"].format(
			dh + di + cHtmlParts["archive"].format(settings.directorate.viewall)
		);

		var nav = cHtmlParts["wrapper"].format(announcements, commandersCorner, hqcommandant, publicaffairs, directorate);
		$("#announcements_nav")
			.parent()
			.html(cHtmlParts["css"] + nav);
		$("#announcements_nav").remove();
	}

	function openDialog(fileUrl) {
		var options = {
			url: fileUrl,
			title: "Commander's Corner",
			showClose: true,
			width: 800,
			height: 1000,
		};
		SP.SOD.execute("sp.ui.dialog.js", "SP.UI.ModalDialog.showModalDialog", options);
	}

	function getDocuments(listinfo) {
		var siteUrl = _spPageContextInfo.webAbsoluteUrl;
		var listData = [];
		$.ajax({
			async: false,
			url:
				listinfo.site +
				"/_api/web/lists/getbytitle('{0}')/items?$select=EncodedAbsUrl,FileRef/FileRef,File/Name,*&$expand=File&$orderby={1} {2}&$top={3}".format(
					listinfo.list,
					listinfo.ordercol,
					listinfo.order,
					listinfo.itemsReturned
				),
			method: "GET",
			headers: { Accept: "application/json; odata=verbose" },
			success: function (data) {
				// Returning the results
				var listItems = data.d.results;
				var x = 0;
				listItems.forEach(function (entry) {
					var t = entry.Title;
					if (isNullEmptyUndefined(t)) {
						t = entry.File.Name.split(/\.(?=[^\.]+$)/)[0];
					}

					listData[x] = {
						docUrl: entry.EncodedAbsUrl,
						itemUrl: entry.FileRef,
						title: t,
						id: entry.Id,
					};
					x++;
				});
			},
			error: function (data) {
				alert("Error: " + data);
			},
		});

		return listData;
	}

	function isNullEmptyUndefined(value) {
		return (
			(typeof value === "undefined" || value === null || value.length === 0 || value === "") &&
			typeof value !== "function"
		);
	}

	return {
		init: init,
		openDialog: openDialog,
	};
})(window);

if (!String.prototype.format) {
	String.prototype.format = function () {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function (match, number) {
			return typeof args[number] != "undefined" ? args[number] : match;
		});
	};
}
