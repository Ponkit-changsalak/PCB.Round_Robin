const process = new Scheduling();
let id = 0, time = 0, countRAM = 0, MaxRam = 300, quantum1 = 5, quantum2 = 10, quantum = 0;
let intervalId, state1 = true, state2 = false, state3 = false;

document.getElementById("Add").addEventListener("click", addRow);
document.getElementById("Start").addEventListener("click", run);
document.getElementById("Stop").addEventListener("click", stop);


function addRow() {

    let index;
    const ram = getRandomNumber(20, 30);
    countRAM += ram;
    if (countRAM <= MaxRam) {
        process.addProcess(++id, time, ram);
        index = process.getProcess_Length() - 1;
        addRowProcessTable(process.getProcess(index), index);
        updateRam(countRAM, MaxRam);
    } else {
        countRAM -= ram;
        alert("Ram is empty");
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function run() {
    let CurrentIndex, id;
    if (process.getProcess_Length() > 0) {
        toggleButton();
        intervalId = setInterval(function () {
            updateCPUtime(++time);
            scheduling();
            IO_Start()
            SetProcessTable();
            setQueueTable();
            setIOTable();
            CurrentIndex = process.getCurrentIndex();

            if (process.getProcess_Length() > 0) {
                id = process.getProcess(CurrentIndex).getId();
                updateCPUID(id);
                //updateIOprocessID(id);
            }

        }, 1000);
    }

}

function stop() {
    clearInterval(intervalId);
    toggleButton();
}

////Terminate>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function terminate(button, index) {
    countRAM -= process.getProcess(index).getRam();
    updateRam(countRAM);
    deleteRow(button);
    process.getProcess(index).setStatus("Terminate");
    process.addTerminate(process.getProcess(index), index);
    let length = process.getTerminate_Length();
    addTerminateRow(process.getTerminate(length - 1));
    let turnaround = findAVG_T();
    AVG_Taurnaround(turnaround);
    let waiting = findAVG_W();
    AVG_Waiting(waiting);
    if (process.getProcess_Length() == 0) {
        updateCPUID("NO Process");
        //updateIOprocessID("NO Process");
        stop();
    }
}

function findAVG_W() {
    let waiting = 0, ioWaiting = 0, total;
    for (let i = 0; i < process.getTerminate_Length(); i++) {
        waiting += process.getTerminate(i).getWaiting();
        ioWaiting += process.getTerminate(i).getIOWaiting();
    }

    total = (waiting + ioWaiting) / process.getTerminate_Length();

    return total.toFixed(2);
}

function findAVG_T() {
    let execute = 0, waiting = 0, io = 0, ioWaiting = 0, total;
    for (let i = 0; i < process.getTerminate_Length(); i++) {
        execute += process.getTerminate(i).getExecute();
        waiting += process.getTerminate(i).getWaiting();
        io += process.getTerminate(i).getIOExecute();
        ioWaiting += process.getTerminate(i).getIOWaiting();
    }
    total = (execute + waiting + io + ioWaiting) / process.getTerminate_Length();
    return total.toFixed(2);
}

//Queue>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function getQueue() {
    let queue = [];
    let status, io;
    for (let i = 0; i < process.getProcess_Length(); i++) {
        status = process.getProcess(i).getStatus();
        execute = process.getProcess(i).getExecute();
        io = process.getProcess(i).getIO();
        if (status == "Ready" || io) {
            queue.push(process.getProcess(i).getId())
        }
    }
    return queue;
}

//SetTable>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function SetProcessTable() {
    clearProcessTable();
    let CurrentIndex = process.getCurrentIndex();
    let Waiting;
    for (let index = 0; index < process.getProcess_Length(); index++) {
        if (index == CurrentIndex && !process.getProcess(index).getIO()) {
            process.getProcess(index).setStatus("Running");
            addRowProcessTable(process.getProcess(index), index);
            addBTN(index, true);
        } else if (index == CurrentIndex && process.getProcess(index).getIO()) {
            process.getProcess(index).setStatus("Waiting");
            addRowProcessTable(process.getProcess(index), index);
            addBTN(index, false);
        } else if (index != CurrentIndex && !process.getProcess(index).getIO()) {
            process.getProcess(index).setStatus("Ready");
            Waiting = process.getProcess(index).getWaiting();
            process.getProcess(index).setWaiting(Waiting + 1);
            addRowProcessTable(process.getProcess(index), index);
        } else if (index != CurrentIndex && process.getProcess(index).getIO()) {
            process.getProcess(index).setStatus("Waiting");
            addRowProcessTable(process.getProcess(index), index);
        }
    }
}

function setQueueTable() {
    let queue = getQueue();
    clearRR1();

    for (let i = 0; i < queue.length; i++) {
        addRR1Row(queue[i]);
    }
}

function setIOTable() {
    clearIO();
    let index, value;
    if (process.getIO_Length() > 0) {
        for (let i = 0; i < process.getIO_Length(); i++) {
            index = getIndexbyID(process.getIOqueue(i).getId());
            value = process.getIOqueue(i).getId();
            addIORow(value, index);
        }
    }
}

function getIndexbyID(id) {
    let index;
    for (let i = 0; i < process.getProcess_Length(); i++) {
        if (process.getProcess(i).getId() == id) {
            index = i;
            break;
        }
    }
    return index;
}

//scheduling>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function scheduling() {

    let index, execute;

    if (process.getProcess_Length() > 0) {

        RR1();

        index = process.getCurrentIndex();

        if (process.getProcess(index).getIO()) {
            remain();
            index = process.getCurrentIndex();
            heema = process.getProcess(index).getExecute() + 5;
        }

        if (!process.getProcess(index).getIO()) {
            execute = process.getProcess(index).getExecute()
            process.getProcess(index).setExecute(execute + 1);
        }
        console.log("Index : " + index);

    }
}


function CountEror(index) {

    if (state1) {
        if (process.getProcess(index).getExecute() < quantum1 && !process.getProcess(index).getIO()) {
            return true;
        } else {
            return false;
        }

    } else if (state2) {
        if (process.getProcess(index).getExecute() < quantum1 + quantum2 && !process.getProcess(index).getIO()) {
            return true;
        } else {
            return false;
        }

    } else if (state3) {
        if (process.getProcess(index).getExecute() >= quantum1 + quantum2) {
            return true;
        } else {
            return false;
        }
    }
}

function outOfIndex() {
    if (process.getCurrentIndex() >= process.getProcess_Length()) {
        process.setCurrentIndex(0);
        index = process.getCurrentIndex();
        //findState();
    }
}

function All_Waiting() {
    let waiting = 0;
    for (let i = 0; i < process.getProcess_Length(); i++) {
        if (process.getProcess(i).getIO()) {
            waiting += 1;
        }
    }

    if (waiting == process.getProcess_Length()) {
        return true;
    } else {
        return false;
    }
}

function remain() {

    while (process.getCurrentIndex() < process.getProcess_Length() && process.getProcess(process.getCurrentIndex()).getIO()) {
        process.setCurrentIndex(process.getCurrentIndex() + 1);

        if (process.getCurrentIndex() >= process.getProcess_Length()) {
            process.setCurrentIndex(0);
        }

        if (All_Waiting()) {
            break;
        }
    }
}

let heema = 5;
function RR1() {
    let index;
    index = process.getCurrentIndex();
    if(index == process.getProcess_Length()){
        process.setCurrentIndex(process.getProcess_Length()-1);
        index = process.getCurrentIndex();
    }
    if ((process.getProcess(index).getExecute() < heema) && !(process.getProcess(index).getIO())) {
        process.setCurrentIndex(index);
    } else {
        process.setCurrentIndex(index + 1);
        index = process.getCurrentIndex()
        if (index < process.getProcess_Length()) {
            heema = process.getProcess(index).getExecute() + 5;
        } else {
            process.setCurrentIndex(0);
            
            index = process.getCurrentIndex()

            heema = process.getProcess(index).getExecute() + 5;

        }

    }

}


function findState() {

    let st1 = 0, st2 = 0, st3 = 0;
    for (let i = 0; i < process.getProcess_Length(); i++) {
        if (!process.getProcess(i).getIO()) {
            if (process.getProcess(i).getExecute() < quantum1) {
                st1 += 1;
            } else if (process.getProcess(i).getExecute() < quantum1 + quantum2 && process.getProcess(i).getExecute() >= quantum1) {
                st2 += 1;
            } else if (process.getProcess(i).getExecute() >= quantum1 + quantum2) {
                st3 += 1;
            }
        }
    }

    if (st1 >= st2 && st1 >= st3) {
        state1 = true;
        state2 = false;
        state3 = false;
        console.log("RR Quantum : " + quantum1);
    } else if (st2 > st1 && st2 >= st3) {
        state1 = false;
        state2 = true;
        state3 = false;
        console.log("RR Quantum : " + quantum2);
        console.log(state1, state2, state3);
    } else if (st3 > st1 && st3 > st2) {
        state1 = false;
        state2 = false;
        state3 = true;
        console.log("FCFS");
    }

}

//IO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function AddIO(index) {

    addBTN(index, false);
    process.getProcess(index).setIO(true);
    process.addIOQ(index);
    let IOindex = process.getIO_Length() - 1;
    addIORow(process.getIOqueue(IOindex).getId(), index);

}

function CloseIO(button, index) {

    deleteRow(button);
    process.getProcess(index).setIO(false);
    pcb = process.getProcess(index);
    process.DeleteIO(pcb);
    setIOTable();

}

function IO_Start() {

    if (process.getIO_Length() > 0 && process.getProcess_Length() > 0) {

        let execute, waiting;
        for (let i = 0; i < process.getProcess_Length(); i++) {
            if (process.getProcess(i).getIO()) {
                if (process.getProcess(i) == process.getIOqueue(0)) {
                    execute = process.getProcess(i).getIOExecute();
                    process.getProcess(i).setIOExecute(execute + 1);
                } else {
                    waiting = process.getProcess(i).getIOWaiting();
                    process.getProcess(i).setIOWaiting(waiting + 1);
                }
            }
        }
    }
}