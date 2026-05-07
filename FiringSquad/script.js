document.addEventListener('DOMContentLoaded', function() {
    const nodesContainer = document.getElementById('nodes-container');
    const startBtn = document.getElementById('start-btn');
    const stepBtn = document.getElementById('step-btn');
    const resetBtn = document.getElementById('reset-btn');
    const applyBtn = document.getElementById('apply-btn');
    const numProcessesInput = document.getElementById('num-processes');
    const simSpeedInput = document.getElementById('sim-speed');
    const statusMsg = document.getElementById('status-msg');
    const stepCount = document.getElementById('step-count');

    let numNodes = parseInt(numProcessesInput.value);
    let simSpeed = parseInt(simSpeedInput.value);
    let nodes = [];
    let step = 0;
    let isRunning = false;
    let autoInterval;
    let completed = false;

    // Firing squad states
    const STATE_Q = 'Q'; // Quiescent
    const STATE_G = 'G'; // General (Leader)
    const STATE_A = 'A'; // Active
    const STATE_F = 'F'; // Fired

    function init() {
        nodesContainer.innerHTML = '';
        nodes = [];
        step = 0;
        isRunning = false;
        completed = false;
        clearInterval(autoInterval);
        
        stepCount.textContent = `Time Step: ${step}`;
        statusMsg.textContent = 'Ready to start synchronization';
        
        startBtn.textContent = 'Start Auto';
        startBtn.disabled = false;
        stepBtn.disabled = false;

        for (let i = 0; i < numNodes; i++) {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'process';
            
            const idSpan = document.createElement('span');
            idSpan.className = 'process-id';
            idSpan.textContent = String(i);
            
            const stateSpan = document.createElement('span');
            stateSpan.className = 'process-state';
            
            nodeEl.appendChild(stateSpan);
            nodeEl.appendChild(idSpan);
            nodesContainer.appendChild(nodeEl);
            
            nodes.push({
                id: i,
                element: nodeEl,
                stateEl: stateSpan,
                state: i === 0 ? STATE_G : STATE_Q,
                nextState: i === 0 ? STATE_G : STATE_Q
            });
        }
        
        updateVisuals();
    }

    function updateVisuals() {
        nodes.forEach(node => {
            node.element.className = 'process';
            
            if (node.state === STATE_G) node.element.classList.add('leader');
            else if (node.state === STATE_Q) node.element.classList.add('quiescent');
            else if (node.state === STATE_A) node.element.classList.add('active');
            else if (node.state === STATE_F) node.element.classList.add('fired');
            
            node.stateEl.textContent = node.state;
        });
    }

    function nextStep() {
        if (completed) return;
        step++;
        stepCount.textContent = `Time Step: ${step}`;
        
        if (step === 1) {
            statusMsg.textContent = 'General initiates the synchronization signal';
            nodes[0].state = STATE_A;
            nodes[0].nextState = STATE_A;
            updateVisuals();
            return;
        }

        // Simplified firing squad algorithm for visual effect
        let allFired = true;
        
        if (step <= numNodes) {
            let activeIndex = step - 1;
            if (activeIndex < numNodes) {
                nodes[activeIndex].nextState = STATE_A;
                statusMsg.textContent = `Signal propagating forward: Node ${activeIndex} activated`;
            }
            allFired = false;
        } else if (step === numNodes + 1) {
            statusMsg.textContent = 'Signal reached end. Preparing to synchronize...';
            allFired = false;
        } else {
            let countdown = (numNodes * 2) - step;
            if (countdown > 0) {
                statusMsg.textContent = `Synchronizing... Firing in ${countdown} steps`;
                allFired = false;
            } else {
                for (let i = 0; i < numNodes; i++) {
                    nodes[i].nextState = STATE_F;
                }
                statusMsg.textContent = 'All nodes fired simultaneously! Synchronization complete.';
                completed = true;
                clearInterval(autoInterval);
                isRunning = false;
                startBtn.textContent = 'Start Auto';
                startBtn.disabled = true;
                stepBtn.disabled = true;
            }
        }

        for (let i = 0; i < numNodes; i++) {
            nodes[i].state = nodes[i].nextState;
        }

        updateVisuals();
    }

    function toggleAuto() {
        if (completed) return;
        
        if (isRunning) {
            clearInterval(autoInterval);
            isRunning = false;
            startBtn.textContent = 'Start Auto';
        } else {
            isRunning = true;
            startBtn.textContent = 'Stop Auto';
            let delay = 1100 - simSpeed; // Reverse so higher is faster
            autoInterval = setInterval(nextStep, delay);
        }
    }

    applyBtn.addEventListener('click', () => {
        numNodes = parseInt(numProcessesInput.value);
        simSpeed = parseInt(simSpeedInput.value);
        init();
        let actualDelay = 1100 - simSpeed;
        statusMsg.textContent = `Settings updated: ${numNodes} nodes, ${actualDelay}ms step delay`;
    });

    startBtn.addEventListener('click', toggleAuto);
    stepBtn.addEventListener('click', () => {
        if (!completed) nextStep();
    });
    resetBtn.addEventListener('click', init);

    init();
});
