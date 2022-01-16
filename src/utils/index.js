const fetch = require("node-fetch");
const config = require("../../config");

class Util {
	static LCP(strings) { // Takes an array of strings and returns longest common prefix
		var smallest, largest, i, str;
		if (!Array.isArray(strings) || !strings.length) return "";

		smallest = strings[0];
		largest = strings[0];
		for (i = 1; i < strings.length; i++) {
			str = strings[i];
			if (str > largest) largest = str;
			if (str < smallest) smallest = str;
		}

		for (i = 0; i < smallest.length; i++) if (smallest[i] != largest[i]) return smallest.substr(0, i);
		return smallest;
	}

  static formatTimestamp(date = new Date()) { // Formates Date as [DD.MM.YYYY HH.MM.SS]
    return `[${
      Util.twoNum(date.getDate())
    }.${
      Util.twoNum(date.getMonth() + 1)
    }.${
      date.getFullYear()
    } ${
      Util.twoNum(date.getHours())
    }:${
      Util.twoNum(date.getMinutes())
    }:${
      Util.twoNum(date.getSeconds())
    }]`;
  }

  static twoNum(str) { // Pads string with zeros until it's length equals 2
    return ("0" + str).slice(-2);
  }

  static trunc(str, maxLength) { // Truncates string to maxLength - 3 and adds ... to the end
    if (str.length <= maxLength) return str;
    if (maxLength <= 3 || maxLength > Number.MAX_SAFE_INTEGER) throw new Error("max length should be safe number greater then 3");
    return str.slice(0, maxLength - 3) + "...";
  }

  static dayOfYear(day = new Date()) { // Returns the number of the day in the year. (From 0 to 364 or 365)
    if (!(day instanceof Date)) throw new Error("day can only be a Date object");

    const startOfYear = new Date(day.getFullYear(), 0, 0);
    const res = Math.floor((day - startOfYear) / 24/60/60/1000);
    return res - 1;
  }

  static async searchOnWiki(page) {
    try {
      const url = "https://en.wiktionary.org/w/api.php" +
                  "?action=opensearch" +
                  "&format=json" +
                  "&formatversion=2" +
                  "&search=" + encodeURIComponent(page) +
                  "&namespace=0" +
                  "&limit=" + config.bot.maxWikiSearchResults;
      const res = await fetch(url);

      const data = await res.json();
      return { data };
    } catch(error) {
      return { data: null, error };
    }
  }

  static randomOf(arr) { // Returns tandom element of an array
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

module.exports = Util;
