const getMustardData = require("./getTodaysMustardData");
const authenicate = require("./authenticate");
const _ = require("lodash");
const roster = require("./roster")._data();
//var moment = require("moment");
var moment = require("moment-timezone");
var lists = require("./O365Lists");
var services = require("./services");
var u = require("./utils");
require("dotenv").config({ path: __dirname + "//.env" });

module.exports = async function (context, req) {
	//check if time to process

	var rdt = req.query.rundate;
	var notifySupervisor = req.query.notifySupervisor;
	var note = req.query.note || "Run time";
	var rundate = null;
	if (!rdt) {
		rundate = moment(new Date()).format("YYYY-MM-DD"); //+ "T00:00";
	} else {
		rundate = moment(rdt).format("YYYY-MM-DD"); // + "T00:00";
	}

	if (!notifySupervisor) {
		notifySupervisor = "Y";
	}

	var mustered = await getMustardData.data();

	var t = await authenicate.getAuthToken();
	lists.o365.init(t.token.accessToken);
	var controlInfo = await lists.o365.getControlItem();
	var cdata = JSON.parse(controlInfo[0].Misc);
	var todaysMuster = mustered.filter((e) => {
		var edate = moment(e.Timestamp).format("YYYY-MM-DD");
		if (rundate == edate) {
			var mName = e["Select Your Name"].trim();
			var mparts = mName.split(",");
			var mFirstName = mparts[1].trim().toLowerCase();
			var mLastName = mparts[0].trim().toLowerCase();
			e["NameKey"] = mFirstName + mLastName;
			e["formattedDate"] = edate;
			e["found"] = false;

			return true;
		}
		return false;
	});

	var divisionMangers = await lists.o365.getDivisionItems();
	var staffRoster = await lists.o365.getAlertRoster();
	var processedMuster = services.getLateStaffers(todaysMuster, staffRoster);
	var notifyStaff = processedMuster.notifyStaff;
	divisionMangers[0].Misc = controlInfo[0].Misc;
	if (cdata.test == "Y") {
		divisionMangers[0].WorkEmail = cdata.email;
		divisionMangers[0].PersonalEmail = cdata.email;
		divisionMangers[0].Misc = controlInfo[0].Misc;
		//notifyStaff = processedMuster.notifyStaff.slice(0, 3);
		notifyStaff = notifyStaff.map((e, i, a) => {
			e.WorkEmail = cdata.email;
			e.PersonalEmail = cdata.email;
			e.WorkEmailSvr = divisionMangers[0].WorkEmail;
			e.PersonalEmailSvr = divisionMangers[0].PersonalEmail;

			e.WorkEmailSvr = cdata.email;
			e.PersonalEmailSvr = cdata.email;

			return e;
		});
	}

	var timeStr = moment(rdt).tz("Europe/Berlin").format("YYYY-MM-DD HH:mm");

	note = `${timeStr}->${note}`;

	services.processLateStaff(lists, notifyStaff, divisionMangers[0], note);

	if (notifySupervisor == "Y") {
		latestaffNames = "";
		const na = "Number not available";
		notifyStaff.map((e) => {
			var wp = e.WorkPhone ? stripDNS(e.WorkPhone) : "";

			if (wp != "") {
				wp = `<br>Work:<a href='tel:${wp}'>${e.WorkPhone}</a>`;
			} else {
				wp = `<br>Work: ${na}`;
			}

			var hp = e.HomePhone ? stripDNS(e.HomePhone) : "";

			if (hp != "") {
				hp = `<br>Mobile: <a href='tel:${hp}'>${e.HomePhone}</a>`;
			} else {
				hp = `<br>Mobile: ${na}`;
			}

			latestaffNames = latestaffNames + `<br><br><b>${e.FirstName} ${e.LastName}</b> ${wp.trim()} ${hp.trim()} `;
		});
		var d = moment(new Date()).format("MMMM Do YYYY, h:mm:ss a");
		var msg = `All staff have mustered for ${d} ${latestaffNames}`;
		if (notifyStaff.length > 0) {
			msg = `These are the current staff who have not mustered for ${timeStr} ${latestaffNames}`;
		}

		var json = {
			workEmail: divisionMangers[0].WorkEmail,
			personalEmail: divisionMangers[0].PersonalEmail,
			subject: "Muster Alert",
			body: msg,
		};

		context.res = {
			headers: {
				"content-type": "text/javascript",
			},

			body: JSON.stringify(json),
		};
	}
	context.done();

	return;

	function stripDNS(n) {
		var wp = n + " ".trim().toUpperCase();
		if (wp.indexOf(":") > -1) wp = wp.split(":")[1];
		// general
		else if (wp.indexOf("N") > -1) {
			wp = wp.split("N")[1]; // for DSN
		}

		return (wp = wp.replace("null", "").trim());
	}
};
