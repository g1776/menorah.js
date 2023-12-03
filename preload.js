/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	minimizeWindow: () => {
		ipcRenderer.send("minimize-window");
	},
	getCountryCode: () => {
		return new Promise((resolve, reject) => {
			ipcRenderer.once("country-code", (_, countryCode) => {
				resolve(countryCode);
			});
			ipcRenderer.send("get-country-code");
		});
	},
});
