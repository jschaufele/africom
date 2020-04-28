//var lists = require("./O365Lists");
const _ = require("lodash");
module.exports = {
	getLateStaffers: (todaysMuster, staffRoster) => {
		var report = [];
		for (var r = 0; r < staffRoster.length; r++) {
			staffRoster[r].found = false;
			staffRoster[r].NameKeySvr = _.trim(staffRoster[r].NameKeySvr);
			staffRoster[r].WorkEmailSvr = "";
			staffRoster[r].PersonalEmailSvr = "";
			var i = 0;
			do {
				// catches duplicate muster entries-
				i = todaysMuster.findIndex((e) => {
					return _.trim(staffRoster[r].NameKey) == _.trim(e.NameKey) && !e.found;
				});
				if (i > -1) {
					staffRoster[r].found = true;
					todaysMuster[i].found = true;
				}
			} while (i > -1);
		}
		// helps keep lists in sync
		var missingNames = todaysMuster.filter((r, i, a) => {
			return !r.found;
		});
		var notifyStaff = staffRoster.filter((r, i, a) => {
			return !r.found;
		});
		// to notifiy supervisor's
		notifyStaff = notifyStaff.map((e) => {
			if (e.NameKeySvr.length > 0) {
				var i = staffRoster.findIndex((s) => {
					return e.NameKeySvr == s.NameKey;
				});
				if (i > -1) {
					e.WorkEmailSvr = staffRoster[i].WorkEmail;
					e.PersonalEmailSvr = staffRoster[i].PersonalEmail;
				}
			}
			return e;
		});
		return { missingNames: missingNames, notifyStaff: notifyStaff };
	},
	processLateStaff: async (lists, lateStaff, divisionMangers, note) => {
		var cdata = JSON.parse(divisionMangers.Misc);

		lateStaff.map((e) => {
			var nm = (cdata.test == "Y" ? "TEST->" : "") + e.FirstName + " " + e.LastName;
			var i = {
				title: note,
				fullName: nm,
				workEmail: e.WorkEmail,
				personalEmail: e.PersonalEmail,
				personalEmailSvr: e.PersonalEmailSvr,
				workEmailSvr: e.WorkEmailSvr,
			};

			lists.o365.updateMusterAlertList(i);
		});
	},
};
