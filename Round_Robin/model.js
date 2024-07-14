class PCB {
    constructor(id, arrival, ram) {
        this.id = id;
        this.status = "New";
        this.arrival = arrival;
        this.ram = ram;
        this.execute = 0;
        this.waiting = 0;
        this.io = false;
        this.ioWaiting = 0;
        this.ioExecute = 0;

    }

    // Getter methods
    getId() {
        return this.id;
    }

    getStatus() {
        return this.status;
    }

    getArrival() {
        return this.arrival;
    }

    getRam() {
        return this.ram;
    }

    getExecute() {
        return this.execute;
    }

    getWaiting() {
        return this.waiting;
    }

    getIO() {
        return this.io;
    }

    getIOExecute() {
        return this.ioExecute;
    }

    getIOWaiting() {
        return this.ioWaiting;
    }

    // Setter methods
    setId(newId) {
        this.id = newId;
    }

    setStatus(newStatus) {
        this.status = newStatus;
    }

    setArrival(newArrival) {
        this.arrival = newArrival;
    }

    setRam(newRam) {
        this.ram = newRam;
    }

    setExecute(newExecute) {
        this.execute = newExecute;
    }

    setWaiting(newWaiting) {
        this.waiting = newWaiting;
    }

    setIO(newIO) {
        this.io = newIO;
    }

    setIOExecute(newvalue) {
        this.ioExecute = newvalue;
    }

    setIOWaiting(newvalue) {
        this.ioWaiting = newvalue;
    }
}

class Scheduling {
    constructor() {
        this.PCB = [];
        this.terminate = [];
        this.ioq = [];
        this.CurrentIndex = 0;
    }

    addProcess(id, arrival, ram) {
        this.PCB.push(new PCB(id, arrival, ram));
    }

    addIOQ(index) {
        if (index < this.PCB.length) {
            this.ioq.push(this.PCB[index]);
        } else {
            console.error(`Add IOQ fail Caulse , Index : ${index} invalid`);
        }
    }

    addTerminate(pcb, index) {
        if (index < this.PCB.length) {
            this.terminate.push(this.PCB[index]);
        } else {
            console.error(`Add Terminate fail Caulse , Index : ${index} invalid`);
        }

        if (pcb instanceof PCB) {
            var process = pcb;
            this.PCB = this.PCB.filter(function (item) {
                return item !== process;
            })
        } else {
            console.error("Process is not PCB");
        }


    }

    getProcess_Length() {
        return this.PCB.length;
    }

    getIO_Length() {
        return this.ioq.length;
    }

    getTerminate_Length() {
        return this.terminate.length;
    }

    getProcess(index) {
        if (this.PCB.length > 0 && index < this.PCB.length) {
            return this.PCB[index];
        } else {
            console.error(`Index : ${index} invalid`);
        }
    }

    getIOqueue(index) {
        if (this.ioq.length > 0 && index < this.ioq.length) {
            return this.ioq[index];
        } else {
            console.error(`Index : ${index} invalid`);
        }
    }

    getTerminate(index) {
        if (this.terminate.length > 0 && index < this.terminate.length) {
            return this.terminate[index];
        } else {
            console.error(`Index : ${index} invalid`);

        }
    }

    getCurrentIndex() {
        return this.CurrentIndex;

    }

    setCurrentIndex(index) {
        this.CurrentIndex = index;
    }

    DeleteIO(pcb) {
        if (pcb instanceof PCB) {
            var process = pcb;
            this.ioq = this.ioq.filter(function (item) {
                return item !== process;
            })
        } else {
            console.error("Process is not PCB");
        }

    }
}