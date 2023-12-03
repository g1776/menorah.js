/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

function calculateFlameXPosition(night) {
	const candleWidth = 5;
	const candleSpacing = 6;
	const menorahWidth = document.getElementById("menorah-image").width;

	let pos = -5; // Adjust for the menorah's padding

	if (night === "shamash") {
		return pos + menorahWidth - (candleWidth + candleSpacing) * 4;
	}

	pos += menorahWidth - (candleWidth + candleSpacing) * night;

	// skip the shamash
	if (night > 3) {
		pos -= candleWidth + candleSpacing;
	}

	return pos;
}

function addFlame(night) {
	const flameImage = document.createElement("img");

	// Set attributes for the flame image
	flameImage.id = `flame-image-${night}`;
	flameImage.src = "flame.gif";
	flameImage.style.position = "absolute";
	flameImage.style.top = "14px";
	flameImage.style.left = calculateFlameXPosition(night) + "px";
	flameImage.width = "12";
	flameImage.height = "17";
	// set a transpareny to the gif
	flameImage.style.opacity = 0.7;

	if (night === "shamash") {
		flameImage.style.top = "6px";
	}

	// Append the flame image to the document body
	document.body.appendChild(flameImage);
}

async function getNightOfHanukkah() {
	const ISO3166CountryCode = await window.electronAPI.getCountryCode();
	const today = new Date();
	const year = today.getFullYear();

	try {
		const response = await fetch(
			`https://api.api-ninjas.com/v1/holidays?country=${ISO3166CountryCode}&year=${year}&type=jewish_holiday`,
			{
				headers: {
					"X-Api-Key": "dbQhvyA2gG3S2V2cXzU1lQ==8yecJLcLlPTigmJ5", // Replace with your actual API key
				},
			}
		);
		const data = await response.json();
		const hanukkah = data.find((holiday) => holiday.name.toLowerCase().includes("hanukkah"));
		const firstNightOfHanukkah = new Date(hanukkah.date);

		const timeDifference = today.getTime() - firstNightOfHanukkah.getTime();
		const nightNumber = Math.ceil(timeDifference / (1000 * 3600 * 24));

		return nightNumber;
	} catch (error) {
		alert(error);
		return 0; // Or handle the error appropriately
	}
}

async function drawMenorah() {
	// remove all flames. Where a flame is any img tag with an id of flame-image-*
	const flames = document.querySelectorAll("img[id^='flame-image-']");
	for (let i = 0; i < flames.length; i++) {
		flames[i].remove();
	}

	// calculate the day to determine how many candles to show and light
	const day = await getNightOfHanukkah();
	alert(day);

	// Set the menorah image (includes the candles, but not animated flames)
	const menorahImage = document.getElementById("menorah-image");
	if (day >= 1) {
		menorahImage.src = `menorahs/menorah${day}.png`; // Adjust the file extension as needed
	} else {
		menorahImage.src = "menorahs/menorah1.png"; // show the first night's menorah, but without any flames
	}

	// Add the flames
	if (day > 0) {
		addFlame("shamash");
		for (let i = 0; i < day; i++) {
			addFlame(i);
		}
	}
}

window.onload = async () => {
	// Add event listeners for the minimize buttons
	const minimizeButton = document.getElementById("minimizeButton");
	minimizeButton.addEventListener("click", () => {
		window.electronAPI.minimizeWindow();
	});

	await drawMenorah();

	// refresh the menorah every 24 hours
	setInterval(async () => await drawMenorah(), 1000 * 60 * 60 * 24);
};
