var AFC = window.AFC || {};

AFC.Util =
	AFC.Util ||
	(function (win, undefined) {
		var options = {
			jqUrl: "/jslibs/jQuery/1.10.2/jquery-1.10.2.min.js",
			bsUrl: "/jslibs/bootstrap/bootstrap-3.3.5-dist/js/bootstrap.js",
			bsCssUrl: "/jslibs/bootstrap/bootstrap-3.3.5-dist/css/bootstrap.min.css",
			fontawesome: "/jslibs/font-awesome/font-awesome-4.5.0/css/font-awesome.min.css",
		};

		function localExtend(a, b) {
			//shallow extend
			var o = {};
			for (var key in a) if (a.hasOwnProperty(key)) o[key] = a[key];
			for (var key in b) if (b.hasOwnProperty(key)) o[key] = b[key];
			return o;
		}

		function loadJQ(url, callback) {
			// this is not the best javascript script loader - something could be reworked down the road
			// This is reqired as a priming dynamic loader for JQ - so then everythings uses standard JQ
			var script = document.createElement("script");
			script.type = "text/javascript";
			//var d = document.createAttribute("defer");
			//script.setAttributeNode(d);
			//	document.write(script.outerHTML);
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
		function init(o, scriptUrl, callbackStr) {
			// should be called in _spBodyOnLoadFunctionNames vs document ready

			var opt = typeof o !== "undefined" ? o : {};

			var settings = localExtend(options, opt); // $.extend can replace this if JQ is known to be loaded -

			Object.keys(settings).forEach(function (k, i, arr) {
				// the only setting for this are URLs so just making sure they have a full path
				if (settings[k].toLowerCase().indexOf("http") < 0) {
					settings[k] = (_spPageContextInfo.webAbsoluteUrl + settings[k]).toLowerCase();
				}
			});

			scriptUrl = _spPageContextInfo.webAbsoluteUrl + scriptUrl;

			if (win.jQuery) {
				// test for BS

				if (!(typeof $().modal == "function")) {
					loadBS(settings, scriptUrl, callbackStr);
				} else {
					loadWPScript(scriptUrl, callbackStr);
				}
			} else {
				var cbLoadBS = loadBS.bind(null, settings, scriptUrl, callbackStr);
				loadJQ(settings.jqUrl, cbLoadBS);
			}
		}
		function loadBS(settings, scriptUrl, callbackStr) {
			//JQ must be loaded for BS and is assumed to be loaded at this time

			var bscss = $("link[href*='{0}']".format(settings.bsCssUrl));

			if (bscss.length == 0) {
				$("head").append($('<link rel="stylesheet" type="text/css" id="afc_bscss" />').attr("href", settings.bsCssUrl));
			}
			var fontawesome = $("link[href*='{0}']".format(settings.fontawesome));

			if (fontawesome.length == 0) {
				$("head").append(
					$('<link rel="stylesheet" type="text/css" id="afc_fontawesome" />').attr("href", settings.fontawesome)
				);
			}

			var bsjs = $("script[src*='bootstrap.js']");
			if (bsjs.length == 0) {
				$.getScript(settings.bsUrl, function () {
					loadWPScript(scriptUrl, callbackStr);
				});
				return;
			}
			loadWPScript(scriptUrl, callbackStr);
		}
		function loadWPScript(scriptUrl, callbackStr) {
			$.getScript(scriptUrl)
				.then(function () {
					var cb = eval(callbackStr);
					cb();
				})
				.fail(function (e) {
					console.log("script2 error->", e);

					if (arguments[0].readyState == 0) {
						//script failed to load
					} else {
						//script loaded but failed to parse
						alert(arguments[2].toString());
					}
				});
		}
		function isNullEmptyUndefined(value) {
			return (
				(typeof value === "undefined" || value === null || value.length === 0 || value === "") &&
				typeof value !== "function"
			);
		}
		function getDocuments(listinfo) {
			// have not made this generaic yet !!!

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
						if (AFC.Util.isNullEmptyUndefined(t)) {
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
		return {
			loadScript: loadJQ,
			init: init,
			isNullEmptyUndefined: isNullEmptyUndefined,
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
