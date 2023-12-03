// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, ipcMain, Tray, Menu } = require("electron");
const path = require("node:path");

function createWindow() {
	// Create the browser window.

	let display = screen.getPrimaryDisplay();
	let height = display.bounds.height;
	let tray;

	const mainWindow = new BrowserWindow({
		width: 150,
		height: 150,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
		frame: false,
		transparent: true,
		titleBarStyle: "hidden",
		title: "",
		alwaysOnTop: true,
		type: "toolbar",
		autoHideMenuBar: true,
		x: 0,
		y: height - 155,
	});

	const today = new Date();
	const december7 = new Date(today.getFullYear(), 11, 7); // Month is 0-based (0 = January)
	const timeDifference = today.getTime() - december7.getTime();
	const day = Math.ceil(timeDifference / (1000 * 3600 * 24));

	mainWindow.loadFile("index.html", {
		query: { daysRemaining: day }, // Pass daysRemaining as a query parameter
	});

	// Minimize the window
	ipcMain.on("minimize-window", () => {
		mainWindow.minimize();
	});

	mainWindow.on("blur", () => {
		mainWindow.setBackgroundColor("#00000000");
	});

	mainWindow.on("focus", () => {
		mainWindow.setBackgroundColor("#00000000");
	});

	// Create a tray icon
	tray = new Tray(path.join(__dirname, "icon.png"));
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Quit",
			click: () => {
				app.quit();
			},
		},
	]);

	tray.setToolTip("Menorah.js");
	tray.on("click", () => {
		mainWindow.show();
	});
	tray.setContextMenu(contextMenu);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
