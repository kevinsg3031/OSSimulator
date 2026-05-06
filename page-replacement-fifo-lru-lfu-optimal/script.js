var numberOfFrames, dropDown, inputString, numberOfPages, pageFaults, pageHits = 0, s = false, missRate, hitRate;
var arr = new Array();

function visualize() {
	var table = document.getElementById("tbl");
	document.getElementById('SUM').classList.add('hidden');
	table.innerHTML = "<thead></thead><tbody></tbody>";
	pageHits = 0;
	inputString = document.getElementById("input_string").value;
	if(inputString==""){
		alert("Please enter page stream");
		return;
	}
	arr = inputString.split(' ').map(Number);
	numberOfPages = arr.length;
	if(isNaN(numberOfPages)){
		alert("Please enter page stream");
		return;
	}
	if(inputString.includes('-')){
		alert("Please enter positive page numbers");
		return;
	}
	numberOfFrames = parseInt(document.getElementById("frame_size").value);
	if(isNaN(numberOfFrames)){
		alert("Please choose number of frames to be at least 1");
		return;
	}
	if (numberOfFrames <= 0) {
		alert("Please choose number of frames to be at least 1");
		return;
	}
	dropDown = document.getElementById("drop_down").value;
	if (dropDown == "") {
		alert("Please choose an algorithm");
		return;
	}
	var temp = new Array();
	for (let o = 0; o < numberOfFrames; o++) {
		temp[o] = -1;
	}
	if (dropDown=="FIFO"||dropDown=="Optimal"||dropDown=="LRU"||dropDown=="MRU"||dropDown=="LFU"||dropDown=="MFU"||dropDown=="Random") {
		var row = table.insertRow(0);
		var thead = table.querySelector('thead');
		thead.innerHTML = '';
		for (let j = 0; j <= (numberOfFrames + 1); j++) {
			var cell = document.createElement('th');
			if (j == 0)
				cell.innerHTML = "Page Sequence";
			else if (j == (numberOfFrames + 1))
				cell.innerHTML = "Page Hit/Miss";
			else
				cell.innerHTML = `Frame ${j}`;
			thead.appendChild(cell);
		}
		table.deleteRow(0);
		if (dropDown == "FIFO") {
			let l = 0;
			for (let m = 0; m < numberOfPages; m++) {
				let n;
				for (n = 0; n < numberOfFrames; n++) {
					if (arr[m] == temp[n]) {
						s = true;
						pageHits++;
						break;
					}
				}
				if (!s) {
					temp[l] = arr[m];
					l = (l + 1) % numberOfFrames;
				}
				row = table.insertRow(m);
				cell = row.insertCell(0);
				cell.innerHTML = arr[m];
				for (n = 0; n < numberOfFrames; n++) {
					cell = row.insertCell(n + 1);
					cell.innerHTML = temp[n] >= 0 ? temp[n] : " - ";
				}
				cell = row.insertCell(numberOfFrames + 1);
				if (s) {
					cell.innerHTML = "Hit";
					cell.style.backgroundColor = "rgba(0, 200, 0, 0.3)";
					cell.style.color = "#00ff00";
				}
				else {
					cell.innerHTML = "Miss";
					cell.style.backgroundColor = "rgba(200, 0, 0, 0.3)";
					cell.style.color = "#ff6b6b";
				}
				s = false;
			}
		}
		else if (dropDown == "Optimal") {
			for (let m = 0; m < numberOfPages; m++) {
				let n;
				for (n = 0; n < numberOfFrames; n++) {
					if (arr[m] == temp[n]) {
						s = true;
						pageHits++;
						break;
					}
				}
				if (!s) {
					let l = 0, dur = 0;
					for (n = 0; n < numberOfFrames; n++) {
						if (temp[n] < 0) {
							l = n;
							break;
						}
						let k;
						for (k = m; k < numberOfPages; k++) {
							if (arr[k] == temp[n]) {
								if (dur < k - m + 1) {
									l = n;
									dur = k - m + 1;
								}
								break;
							}
						}
						if (k >= numberOfPages) {
							l = n;
							dur = numberOfPages + 1;
						}
					}
					temp[l] = arr[m];
				}
				row = table.insertRow(m);
				cell = row.insertCell(0);
				cell.innerHTML = arr[m];
				for (n = 0; n < numberOfFrames; n++) {
					cell = row.insertCell(n + 1);
					cell.innerHTML = temp[n] >= 0 ? temp[n] : " - ";
				}
				cell = row.insertCell(numberOfFrames + 1);
				if (s) {
					cell.innerHTML = "Hit";
					cell.style.backgroundColor = "rgba(0, 200, 0, 0.3)";
					cell.style.color = "#00ff00";
				}
				else {
					cell.innerHTML = "Miss";
					cell.style.backgroundColor = "rgba(200, 0, 0, 0.3)";
					cell.style.color = "#ff6b6b";
				}
				s = false;
			}
		}
		else if (dropDown == "LRU") {
			var last = new Array();
			for (let j = 0; j < numberOfFrames; j++)
				last[j] = -1;
			for (let m = 0; m < numberOfPages; m++) {
				let n;
				for (n = 0; n < numberOfFrames; n++) {
					if (arr[m] == temp[n]) {
						s = true;
						pageHits++;
						last[n] = m;
						break;
					}
				}
				if (!s) {
					let l = 0;
					for (let j = 0; j < numberOfFrames; j++)
						if (last[l] > last[j])
							l = j;
					temp[l] = arr[m];
					last[l] = m;
				}
				row = table.insertRow(m);
				cell = row.insertCell(0);
				cell.innerHTML = arr[m];
				for (n = 0; n < numberOfFrames; n++) {
					cell = row.insertCell(n + 1);
					cell.innerHTML = temp[n] >= 0 ? temp[n] : " - ";
				}
				cell = row.insertCell(numberOfFrames + 1);
				if (s) {
					cell.innerHTML = "Hit";
					cell.style.backgroundColor = "rgba(0, 200, 0, 0.3)";
					cell.style.color = "#00ff00";
				}
				else {
					cell.innerHTML = "Miss";
					cell.style.backgroundColor = "rgba(200, 0, 0, 0.3)";
					cell.style.color = "#ff6b6b";
				}
				s = false;
			}
		}
		else if (dropDown == "MRU") {
			var last = new Array();
			for (let j = 0; j < numberOfFrames; j++)
				last[j] = numberOfPages + 1;
			for (let m = 0; m < numberOfPages; m++) {
				let n;
				for (n = 0; n < numberOfFrames; n++) {
					if (arr[m] == temp[n]) {
						s = true;
						pageHits++;
						last[n] = m;
						break;
					}
				}
				if (!s) {
					let l = 0;
					for (let j = 0; j < numberOfFrames; j++)
						if (last[l] < last[j])
							l = j;
					temp[l] = arr[m];
					last[l] = m;
				}
				row = table.insertRow(m);
				cell = row.insertCell(0);
				cell.innerHTML = arr[m];
				for (n = 0; n < numberOfFrames; n++) {
					cell = row.insertCell(n + 1);
					cell.innerHTML = temp[n] >= 0 ? temp[n] : " - ";
				}
				cell = row.insertCell(numberOfFrames + 1);
				if (s) {
					cell.innerHTML = "Hit";
					cell.style.backgroundColor = "rgba(0, 200, 0, 0.3)";
					cell.style.color = "#00ff00";
				}
				else {
					cell.innerHTML = "Miss";
					cell.style.backgroundColor = "rgba(200, 0, 0, 0.3)";
					cell.style.color = "#ff6b6b";
				}
				s = false;
			}
		}
		else if (dropDown == "LFU") {
			var freq = new Array();
			var arrive = new Array();
			for (let j = 0; j < numberOfFrames; j++) {
				freq[j] = 0;
				arrive[j] = -1;
			}
			for (let m = 0; m < numberOfPages; m++) {
				let n;
				for (n = 0; n < numberOfFrames; n++) {
					if (arr[m] == temp[n]) {
						s = true;
						pageHits++;
						freq[n]++;
						break;
					}
				}
				if (!s) {
					let l = -1;
					// First, check if there are any empty frames
					for (let j = 0; j < numberOfFrames; j++) {
						if (temp[j] == -1) {
							l = j;
							break;
						}
					}
					// If no empty frames, apply LFU replacement policy
					if (l == -1) {
						l = 0;
						for (let j = 0; j < numberOfFrames; j++)
							if (freq[j] < freq[l] || (freq[j] == freq[l] && arrive[j] < arrive[l]))
								l = j;
					}
					temp[l] = arr[m];
					freq[l] = 1;
					arrive[l] = m;
				}
				row = table.insertRow(m);
				cell = row.insertCell(0);
				cell.innerHTML = arr[m];
				for (n = 0; n < numberOfFrames; n++) {
					cell = row.insertCell(n + 1);
					cell.innerHTML = temp[n] >= 0 ? temp[n] : " - ";
				}
				cell = row.insertCell(numberOfFrames + 1);
				if (s) {
					cell.innerHTML = "Hit";
					cell.style.backgroundColor = "rgba(0, 200, 0, 0.3)";
					cell.style.color = "#00ff00";
				}
				else {
					cell.innerHTML = "Miss";
					cell.style.backgroundColor = "rgba(200, 0, 0, 0.3)";
					cell.style.color = "#ff6b6b";
				}
				s = false;
			}
		}
		else if (dropDown == "MFU") {

			var freq = {};
			var arrive = {};

			for (let m = 0; m < numberOfPages; m++) {

				let n;

				// CHECK HIT
				for (n = 0; n < numberOfFrames; n++) {

					if (arr[m] == temp[n]) {

						s = true;
						pageHits++;

						// increase frequency of PAGE
						freq[arr[m]]++;

						break;
					}
       			}

        // MISS
        if (!s) {

            let l = -1;

            // find empty frame first
            for (let j = 0; j < numberOfFrames; j++) {

                if (temp[j] == -1) {

                    l = j;
                    break;
                }
            }

            // if no empty frame → apply MFU
            if (l == -1) {

                l = 0;

                for (let j = 1; j < numberOfFrames; j++) {

                    let currentPage = temp[j];
                    let selectedPage = temp[l];

                    if (
                        freq[currentPage] > freq[selectedPage] ||

                        (
                            freq[currentPage] == freq[selectedPage]
                            &&
                            arrive[currentPage] < arrive[selectedPage]
                        )
                    ) {
                        l = j;
                    }
                }
            }

            // insert new page
            temp[l] = arr[m];

            // initialize page frequency if first time
            if (!freq[arr[m]])
                freq[arr[m]] = 0;

            freq[arr[m]]++;

            arrive[arr[m]] = m;
        }

        // DISPLAY TABLE
        row = table.insertRow(m);

        cell = row.insertCell(0);
        cell.innerHTML = arr[m];

        for (n = 0; n < numberOfFrames; n++) {

            cell = row.insertCell(n + 1);
            cell.innerHTML = temp[n] >= 0 ? temp[n] : " - ";
        }

        cell = row.insertCell(numberOfFrames + 1);

        if (s) {

            cell.innerHTML = "Hit";
            cell.style.backgroundColor = "rgba(0, 200, 0, 0.3)";
            cell.style.color = "#00ff00";
        }
        else {

            cell.innerHTML = "Miss";
            cell.style.backgroundColor = "rgba(200, 0, 0, 0.3)";
            cell.style.color = "#ff6b6b";
        }

        s = false;
    }
}
		else if(dropDown == "Random"){
			let x = 0;
			for (let m = 0; m < numberOfPages; m++) {
				let n;
				for (n = 0; n < numberOfFrames; n++) {
					if (arr[m] == temp[n]) {
						s = true;
						pageHits++;
						break;
					}
				}
				if (!s) {
					if (x < numberOfFrames)
						temp[x++] = arr[m];
					else {
						let l = Math.floor(Math.random() * numberOfFrames);
						temp[l] = arr[m];
					}
				}
				row = table.insertRow(m);
				cell = row.insertCell(0);
				cell.innerHTML = arr[m];
				for (n = 0; n < numberOfFrames; n++) {
					cell = row.insertCell(n + 1);
					cell.innerHTML = temp[n] >= 0 ? temp[n] : " - ";
				}
				cell = row.insertCell(numberOfFrames + 1);
				if (s) {
					cell.innerHTML = "Hit";
					cell.style.backgroundColor = "rgba(0, 200, 0, 0.3)";
					cell.style.color = "#00ff00";
				}
				else {
					cell.innerHTML = "Miss";
					cell.style.backgroundColor = "rgba(200, 0, 0, 0.3)";
					cell.style.color = "#ff6b6b";
				}
				s = false;
			}
		}
		pageFaults = numberOfPages - pageHits;
		hitRate = (pageHits / numberOfPages) * 100;
		missRate = (pageFaults / numberOfPages) * 100;
		document.getElementById("page_miss").innerHTML = "❌ Page Faults: <strong>" + pageFaults + "</strong>";
		document.getElementById("page_hits").innerHTML = "✓ Page Hits: <strong>" + pageHits + "</strong>";
		document.getElementById("miss_rate").innerHTML = "Miss Rate: <strong>" + missRate.toFixed(2) + "%</strong>";
		document.getElementById("hit_rate").innerHTML = "Hit Rate: <strong>" + hitRate.toFixed(2) + "%</strong>";
		document.getElementById('SUM').classList.remove('hidden');
	}
	else {
		alert("Please choose a valid algorithm");
		return;
	}
}
