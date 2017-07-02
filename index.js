(function () {

    var button = document.getElementById("button");
    var table = document.getElementById("table");
    var header = document.getElementById("header");
    var body = document.getElementById('tableBody');
    var download = document.getElementById("ballsWaveG");
    var returnTable = document.getElementById("returnTable");
    var studentCard = document.getElementById('studentCard');
    var studData = document.getElementById('studData');
    var compareButton = document.getElementById('compare');
    var uncheckButton = document.getElementById('uncheck');

    function loadStudents() {

        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'students.json', true);

        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;

            download.style.visibility = 'hidden';
            download.style.position = 'absolute';

            if (xhr.status !== 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                try {
                    var students = JSON.parse(xhr.responseText);
                } catch (e) {
                    alert("Некорректный ответ " + e.message);
                }
                header.innerHTML = 'Список студентов';

                showStudents(students);

                if (localStorage.getItem('colNum')) {
                    sortGrid(localStorage.getItem('colNum'), localStorage.getItem('type'), localStorage.getItem('sorted'))
                }

                if (localStorage.getItem('cardRow')) {
                    studentDataRequest(+localStorage.getItem('cardRow'))
                }

            }

        };

        button.parentNode.removeChild(button);
        download.style.visibility = 'visible';
        download.style.position = '';
        localStorage.setItem('isLoaded', 1)
    }

    function studentDataRequest(row) {
        var studentId = table.rows[row].cells[0].innerHTML;
        var xhr = new XMLHttpRequest();
        var studentFile = "studentsData/id" + studentId + ".json";

        xhr.open('GET', studentFile, true);

        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            download.style.visibility = 'hidden';
            download.style.position = 'absolute';

            if (xhr.status !== 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                try {
                     var student = JSON.parse(xhr.responseText);

                } catch (e) {
                    alert("Некорректный ответ " + e.message);
                }
                getCard(row, student);
            }

        };
        compareButton.style.visibility = 'hidden';
        uncheckButton.style.visibility = 'hidden';
        table.style.visibility = 'hidden';
        table.style.position = 'absolute';
        download.style.visibility = 'visible';
        download.style.position = '';
    }


    function showStudents(students) {
        var contents = '';
        for (var i = 0; i < students.length; i++) {
            var student = students[i];
            contents += '<tr>';
            for (var key in student) {
                contents += "<td>" + student[key] + "</td>";
            }
            contents += "<td><input data-id ="+ student.id + " type='checkbox' class = 'checkbox'></td>";
            contents += '</tr>';
        }
        body.innerHTML = '<table>' + contents + '</table>';
        table.style.visibility = '';
        compareButton.style.visibility = '';
        uncheckButton.style.visibility = '';
    }


    function sortGrid(colNum, type, sorted) {

        var rowsArray = [].slice.call(body.rows);

        var compare;

        table.tHead.rows[0].cells[colNum].style.backgroundColor = 'grey';

        if (sorted === '1') {

            table.tHead.rows[0].cells[colNum].setAttribute("sorted", "2");

            switch (type) {
                case 'number':
                    compare = function (rowA, rowB) {
                        return rowB.cells[colNum].innerHTML - rowA.cells[colNum].innerHTML;
                    };
                    break;
                case 'string':
                    compare = function (rowA, rowB) {
                        return rowA.cells[colNum].innerHTML < rowB.cells[colNum].innerHTML ? 1 : -1;
                    };
                    break;
            }
        }
        else {
            table.tHead.rows[0].cells[colNum].setAttribute("sorted", "1");

            switch (type) {
                case 'number':
                    compare = function (rowA, rowB) {
                        return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
                    };
                    break;
                case 'string':
                    compare = function (rowA, rowB) {
                        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
                    };
                    break;
            }
        }

        rowsArray.sort(compare);

        table.removeChild(body);

        for (var i = 0; i < rowsArray.length; i++) {
            body.appendChild(rowsArray[i]);
        }

        table.appendChild(body);

        localStorage.setItem('colNum', colNum);
        localStorage.setItem('type', type);
        localStorage.setItem('sorted', sorted);
    }


    function getCard(row, student) {
        studentCard.style.visibility = 'visible';
        header.innerHTML = '';
        studData.innerHTML = '';
        var photo = document.getElementById('photo');
        photo.setAttribute("src", student.img);
        delete student.img;

        for (var key in student) {
            var studDataRow = student[key];

            studData.innerHTML += '<p>' + studDataRow[0] + ' : ' + studDataRow[1] + '</p>'
        }
        localStorage.setItem('cardRow', row);
    }

    function tableOnclick(e) {

        if (e.target.tagName === 'TH') {
            var th = table.getElementsByTagName("TH");
            for (var i = 0; i < th.length; i++) {
                th[i].style.backgroundColor = '#BCEBDD';
            }
            sortGrid(e.target.cellIndex, e.target.getAttribute('data-type'), e.target.getAttribute('sorted'));
        }

        if (e.target.tagName === 'TD') {
            if (e.target.firstChild.tagName === 'INPUT') {
                e.target.firstChild.checked = !e.target.firstChild.checked;
                } else studentDataRequest(e.target.parentNode.rowIndex);
        }
    }

    function returnTableOnclick() {
        compareButton.style.visibility = '';
        uncheckButton.style.visibility = '';
        table.style.visibility = 'visible';
        table.style.position = '';
        studentCard.style.visibility = 'hidden';
        header.innerHTML = 'Список студентов';
        localStorage.removeItem('cardRow');
    }

    if (localStorage.getItem('isLoaded')) {
        loadStudents()
    }

    function uncheck() {
        var checkboxes =  document.getElementsByClassName('checkbox');
        for (var i = 0; i<checkboxes.length; i++) {
            checkboxes[i].checked = false
            }

    }

    function compareButtonOnclick(e) {
        var checkboxes =  document.getElementsByClassName('checkbox');
        var compareJSON = [];
        var isChecked = 0;
        for (var i = 0; i<checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                isChecked++;
                compareJSON.push(checkboxes[i].getAttribute('data-id'))
            }
        }
        if (isChecked < 2) {
            alert('Выберете двух или более студентов!');
            e.preventDefault();
        }
        localStorage.setItem('compareJSON', JSON.stringify(compareJSON))
    }

    compareButton.addEventListener('click', compareButtonOnclick);
    uncheckButton.addEventListener('click', uncheck);
    table.addEventListener('click', tableOnclick);
    returnTable.addEventListener('click', returnTableOnclick);
    button.addEventListener('click', loadStudents)

})();