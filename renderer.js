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

	// If night is -1, then we're calculating the shamash's position
	if (night === -1) {
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
	flameImage.id = "flame-image";
	flameImage.src = "flame.gif";
	flameImage.style.position = "absolute";
	flameImage.style.top = "14px";
	flameImage.style.left = calculateFlameXPosition(night) + "px";
	flameImage.width = "12";
	flameImage.height = "17";
	// set a transpareny to the gif
	flameImage.style.opacity = 0.7;

	// shamash
	if (night === -1) {
		flameImage.style.top = "6px";
	}

	// Append the flame image to the document body
	document.body.appendChild(flameImage);
}

window.onload = () => {
	// Add event listeners for the minimize buttons
	const minimizeButton = document.getElementById("minimizeButton");
	minimizeButton.addEventListener("click", () => {
		window.electronAPI.minimizeWindow();
	});

	const day = window.electronAPI.getDaysRemaining();
	const menorahImage = document.getElementById("menorah-image");

	// Set the src attribute of the image dynamically
	if (day >= 1) {
		menorahImage.src = `menorahs/menorah${day}.png`; // Adjust the file extension as needed
	} else {
		menorahImage.src = "menorahs/menorah1.png"; // Provide a default image if daysRemaining is zero or negative
	}

	// shamash
	addFlame(-1);

	for (let i = 0; i < day; i++) {
		addFlame(i);
	}
};
