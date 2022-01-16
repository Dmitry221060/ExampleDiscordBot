const fetch = require("node-fetch");
const config = require("../../config");

class Util {
	static LCP(strings) { //Принимает массив строк, возвращает наиболее длинный общий префикс
		var smallest, largest, i, str;
		if (!Array.isArray(strings) || !strings.length) return "";
		//Находим алфавитно наименьшую и наибольшую строки
		smallest = strings[0];
		largest = strings[0];
		for (i = 1; i < strings.length; i++) {
			str = strings[i];
			if (str > largest) largest = str;
			if (str < smallest) smallest = str;
		}
		//Сравниваем их, пока не найдём отличающийся символ
		for (i = 0; i < smallest.length; i++) if (smallest[i] != largest[i]) return smallest.substr(0, i);
		return smallest;
	}

  static formatTimestamp(date = new Date()) { // Возвращает форматированную дату [DD.MM.YYYY HH.MM.SS]
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

  static twoNum(str) { // Дополняет строку нулями слева, возвращает последние два символа
    return ("0" + str).slice(-2);
  }

  static trunk(str, maxLength) { // Ограничивает длинну строки сверху до maxLength-3, добавляя троеточие
    if (str.length <= maxLength) return str;
    if (maxLength <= 3 || maxLength > Number.MAX_SAFE_INTEGER) throw new Error("max length should be safe number greater then 3");
    return str.slice(0, maxLength - 3) + "...";
  }

  static dayOfYear(day = new Date()) { // Возвращает номер дня в году, от 0 до 364(365)
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

  static randomOf(arr) { //Возвращает случайный элемент массива
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

module.exports = Util;
