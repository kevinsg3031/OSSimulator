// fifo queue implementation using array
class FifoQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(item) {
        this.queue.push(item);
    }

    dequeue() {
        return this.queue.shift();
    }

    size() {
        return this.queue.length;
    }
}

// sleep function to make the code wait for some time before executing next line of code
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// getting the input from the user
function getValues() {
    let inputVal = document.getElementById("customerCount").value.trim();
    let chair = document.getElementById("chairCount").value;
    
    let customers = [];
    if (inputVal === "") {
        // Handled below
    } else if (!isNaN(inputVal) && parseInt(inputVal) > 0) {
        let count = parseInt(inputVal);
        for(let i=1; i<=count; i++) {
            customers.push("Customer_" + i);
        }
    } else {
        customers = inputVal.split(" ");
    }
    
    let chairs = [];

    if (customers.length === 0) {
        let time = new Date().toLocaleTimeString();
        document.getElementById("waitingRoom").innerHTML = `<div class="status-msg info">Waiting Room Empty at ${time}</div>`;
        document.getElementById("cuttingRoom").innerHTML = `<div class="status-msg success">Hair Cut Room Empty at ${time}</div>`;
        document.getElementById("baberSl").classList.remove("hidden");
        document.getElementById("barberSleeping").innerHTML = `<div class="status-msg warning">Barber Sleeping at ${time}</div>`;
        return [[], []];
    } else if (chair == "" || parseInt(chair) <= 0) {
        document.getElementById("chEr").classList.remove("hidden");
        return [[], []];
    } else {
        document.getElementById("chEr").classList.add("hidden");
    }

    for (let i = 0; i < chair; i++) {
        chairs.push("chair" + i);
    }

    return [customers, chairs];
}

// clear function
function clr() {
    document.getElementById("leaveWaitingRoom").innerHTML = "";
    document.getElementById("waitingRoom").innerHTML = "";
    document.getElementById("cuttingRoom").innerHTML = "";
    document.getElementById("cuttingLeavingRoom").innerHTML = "";
    document.getElementById("barberSleeping").innerHTML = "";
    document.getElementById("cuttingLeaving").classList.add("hidden");
    document.getElementById("baberSl").classList.add("hidden");
}

// start function to start the simulation and show the output
function start() {
    clr();
    const [customers, chairs] = getValues();
    if (customers.length === 0) return;

    let waitting = 0;
    const queue = new FifoQueue();

    let leaveWaitingRoom = document.getElementById("leaveWaitingRoom");
    let waitingRoom = document.getElementById("waitingRoom");
    let cuttingRoom = document.getElementById("cuttingRoom");
    let cuttingLeavingRoom = document.getElementById("cuttingLeavingRoom");
    let barberSleeping = document.getElementById("barberSleeping");
    let baberSl = document.getElementById("baberSl");
    let cuttingLeaving = document.getElementById("cuttingLeaving");

    setTimeout(async () => {
        for (let i = 0; i < customers.length; i++) {
            let time = new Date().toLocaleTimeString();
            if (waitting < chairs.length) {
                queue.enqueue(customers[i]);
                waitting++;
                console.log(`Customer Entered the Waiting Room ${customers[i]} at ${time}`);
                waitingRoom.innerHTML += `<div class="status-msg info">Customer ${customers[i]} Entered Waiting Room at ${time}</div>`;
            } else {
                console.log(`Customer Left because of Full Waiting Room ${customers[i]} at ${time}`);
                leaveWaitingRoom.innerHTML += `<div class="status-msg error">Customer ${customers[i]} Left: Full Waiting Room at ${time}</div>`;
            }
        }
    }, 500);

    setTimeout(async () => {
        if (waitting > 0) {
            for (let i = 0; i < waitting; i++) {
                const customer = queue.dequeue();
                
                // Remove the top waiting message
                if(waitingRoom.childNodes.length > 0) {
                    waitingRoom.removeChild(waitingRoom.childNodes[0]);
                }
                
                let time = new Date().toLocaleTimeString();
                if (i == waitting - 1) {
                    waitingRoom.innerHTML += `<div class="status-msg info-bold">Waiting Room Empty at ${time}</div>`;
                }
                cuttingLeaving.classList.remove("hidden");
                
                console.log(`Customer Hair Cut Started ${customer} at ${time}`);
                cuttingRoom.innerHTML += `<div class="status-msg success">Barber Cutting Hair of ${customer} at ${time}</div>`;
                
                await sleep(2000);
                time = new Date().toLocaleTimeString();
                
                console.log(`Customer Hair Cut Done ${customer} at ${time}`);
                cuttingLeavingRoom.innerHTML += `<div class="status-msg default">Customer ${customer} Left After Cut at ${time}</div>`;
                
                await sleep(2000);
                if(cuttingRoom.childNodes.length > 0) {
                    cuttingRoom.removeChild(cuttingRoom.childNodes[0]);
                }
                
                time = new Date().toLocaleTimeString();
                if (i == waitting - 1) {
                    cuttingRoom.innerHTML += `<div class="status-msg success-bold">Hair Cut Room Empty at ${time}</div>`;
                }
                await sleep(1000);
            }
        }
        
        let finalTime = new Date().toLocaleTimeString();
        if (waitting == 0 || queue.size() == 0) {
            if (waitting == 0) {
                waitingRoom.innerHTML += `<div class="status-msg info-bold">Waiting Room Empty at ${finalTime}</div>`;
                cuttingRoom.innerHTML += `<div class="status-msg success-bold">Hair Cut Room Empty at ${finalTime}</div>`;
            }
            baberSl.classList.remove("hidden");
            barberSleeping.innerHTML += `<div class="status-msg warning">Barber Sleeping at ${finalTime}</div>`;
        }
    }, 1000);
}
