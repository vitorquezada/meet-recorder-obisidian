import { intervalToDuration } from "date-fns";

export function GetStopwatch(initDate: Date) {
	const progress = intervalToDuration({
		start: initDate,
		end: new Date(),
	});
	const configLocale = "en";
	const configLocaleString = {
		minimumIntegerDigits: 2,
	};
	const hour = progress.hours
		? progress.hours?.toLocaleString(configLocale, configLocaleString) + ":"
		: "";
	const minutes =
		progress.minutes?.toLocaleString(configLocale, configLocaleString) ??
		"00";
	const seconds =
		progress.seconds?.toLocaleString(configLocale, configLocaleString) ??
		"00";
	var stopwatchStr = `${hour}${minutes}:${seconds}`;
	return stopwatchStr;
}
