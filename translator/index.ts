import { LocalizationService, Players, RunService } from "@rbxts/services";

const localizationTable = LocalizationService.WaitForChild("LocalizationTable", 3);

if (!localizationTable || !localizationTable.IsA("LocalizationTable")) {
	error("Could not find localization table");
}

async function init(): Promise<Translator> {
	const results = opcall(() => {
		return LocalizationService.GetTranslatorForPlayerAsync(Players.LocalPlayer);
	});

	if (results.success === true) {
		return results.value;
	} else {
		error(results.error);
	}
}

let translator: Translator;

if (RunService.IsClient() && Players.LocalPlayer) {
	init()
		.then((trans) => {
			translator = trans;
		})
		.catch((err: string) => {
			warn(err);
			translator = LocalizationService.GetTranslatorForPlayer(Players.LocalPlayer);
		});
}

const englishTranslator = localizationTable.GetTranslator(localizationTable.SourceLocaleId);

export function formatByKey(key: string, ...data: Array<unknown>): string {
	//No translator for player, try to fallback to English
	if (translator === undefined) {
		const results = opcall(() => {
			return englishTranslator.FormatByKey(key, data);
		});

		if (results.success === true) {
			return results.value;
		} else {
			error(results.error);
		}
	}

	//Try to translate to user's locale id
	const results = opcall(() => {
		return translator.FormatByKey(key, data);
	});

	if (results.success) {
		return results.value;
	} else {
		warn(results.error);

		//Error. Time to try English again
		const englishResults = opcall(() => {
			return englishTranslator.FormatByKey(key, data);
		});

		if (englishResults.success === true) {
			return englishResults.value;
		} else {
			error(englishResults.error);
		}
	}
}

export function translateBySource(context: Instance, source: string): string {
	if (translator === undefined) {
		const results = opcall(() => {
			return englishTranslator.Translate(context, source);
		});

		if (results.success === true) {
			return results.value;
		} else {
			warn(results.error);
			return source;
		}
	}

	const results = opcall(() => {
		return translator.Translate(context, source);
	});

	if (results.success) {
		return results.value;
	} else {
		warn(results.error);
		return source;
	}
}
