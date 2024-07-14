let processTable, rr1Table, rr2Table, fcfsTable, terminateTable, cpuTime, ramInfo, cpuId, rr1Quantum, rr2Quantum, ioTable, ioProcessId, avgTaurnaround, avgWaiting;
        document.addEventListener("DOMContentLoaded", () => {
            // Process Table
            processTable = document.getElementById("processTable");
            // Queue Tables
            rr1Table = document.getElementById("rr1");
            rr2Table = document.getElementById("rr2");
            fcfsTable = document.getElementById("fcfs");
            //Terminate Table
            terminateTable = document.getElementById("terminate");
            // CPU Information
            cpuTime = document.getElementById("cpu_time");
            ramInfo = document.getElementById("ram");
            cpuId = document.getElementById("cpu");
            //Queue Information
            rr1Quantum = document.getElementById("q1");
            rr2Quantum = document.getElementById("q2");
            // I/O table
            ioTable = document.getElementById("io");
            //Terminate information
            avgTaurnaround = document.getElementById("avg_turnaround");
            avgWaiting = document.getElementById("avg_waiting");
        });

        function addRowProcessTable(process, index) {
            const row = processTable.insertRow();
            let btn;
            if (process instanceof PCB) {
                if (process.getStatus() == "Running") {
                    btn = `<td><button  class="btn btn-danger" style="height: 32px;" value="${index}" id="terminate" onclick="terminate(this,this.value)" >terminate</button></td>`;
                } else {
                    btn = `<td><button class="btn btn-danger" style="height: 32px;" value="${index}" id="terminate" onclick="terminate(this,this.value)" disabled>terminate</button></td>`;
                }
                row.innerHTML = `<td>${process.getId()}</td>
                                <td class="${process.getStatus()}">${process.getStatus()}</td>
                                <td>${process.getArrival()}</td>
                                <td>${process.getExecute()}</td>
                                <td>${process.getWaiting()}</td>
                                <td>${process.getIOExecute()}</td>
                                <td>${process.getIOWaiting()}</td>
                                <td>${process.getRam()}</td> ${btn}`;
            }
        }

        function addRR1Row(value) {
            const row = rr1Table.insertRow();
            row.innerHTML = `<td>${value}</td>`;
        }

        function addRR2Row(value) {
            const row = rr2Table.insertRow();
            row.innerHTML = `<td> ProcessID: ${value}</td>`;
        }

        function addFCFSRow(value) {
            const row = fcfsTable.insertRow();
            row.innerHTML = `<td> ProcessID: ${value}</td>`;
        }

        function addTerminateRow(process) {
            const row = terminateTable.insertRow();
            if (process instanceof PCB) {
                row.innerHTML = `<td>${process.getId()}</td>
                                <td class="${process.getStatus()}">${process.getStatus()}</td>
                                <td>${process.getArrival()}</td>
                                <td>${process.getExecute()}</td>
                                <td>${process.getWaiting()}</td>
                                <td>${process.getIOExecute()}</td>
                                <td>${process.getIOWaiting()}</td>`;
            }
        }
        function addIORow(value, index) {

            const row = ioTable.insertRow();
            if (ioTable.rows.length == 2) {
                row.innerHTML = `<td>${value}</td><td><button style="height: 32px;" class="btn btn-danger" onclick="CloseIO(this,${index})">Close USB</button></td>`;
            } else {
                row.innerHTML = `<td>${value}</td><td>Waiting</td>`;
            }

        }

        function clear(tableElement) {
            while (tableElement.rows.length > 1) {
                tableElement.deleteRow(1);
            }
        }

        function clearProcessTable() {
            clear(processTable);
        }

        function clearRR1() {
            clear(rr1Table);
        }

        function clearRR2() {
            clear(rr2Table);
        }

        function clearFCFS() {
            clear(fcfsTable);
        }

        function clearIO() {
            clear(ioTable);
        }

        function deleteRow(button) {
            var row = button.parentNode.parentNode;
            row.parentNode.removeChild(row);
        }

        function toggleButton() {
            var startButton = document.getElementById("Start");
            var stopButton = document.getElementById("Stop");

            if (startButton.style.display !== "none") {
                // ถ้าปุ่ม "Start" ปรากฏ
                startButton.style.display = "none";
                stopButton.style.display = "inline-block";
                stopButton.removeAttribute("disabled");
            } else {
                // ถ้าปุ่ม "Stop" ปรากฏ
                startButton.style.display = "inline-block";
                stopButton.style.display = "none";
            }
        }

        function updateCPUtime(newValue) {
            cpuTime.innerHTML = `CPU Time : ${newValue} s`;
        }

        function updateCPUID(newValue){
            cpuId.innerHTML = `Current Process: ID ${newValue}`;
        }

        function updateRam(newValue,maxRam) {
            ramInfo.innerHTML = `RAM : ${newValue}/300`;
        }

        function AVG_Taurnaround(newValue) {
            avgTaurnaround.innerHTML = `Average Turnaround : ${newValue} s`;

        }

        function AVG_Waiting(newValue) {
            avgWaiting.innerHTML = `Average Waiting : ${newValue} s`;
        }

        function addBTN(index, state) {
            const row = ioTable.rows[0];
            if (row) {
                const cell = row.cells[1];
                if (cell) {
                    if (state) {
                        cell.innerHTML = `<button class="btn btn-success" style="height: 32px;" onclick="AddIO(${index})">Add USB</button>`;
                    } else {
                        cell.innerHTML = `<button class="btn btn-success" style="height: 32px;" onclick="AddIO(${index})" disabled>Add USB</button>`;
                    }
                }
                else {
                    console.error("Invalid cell index");
                }


            }
        }