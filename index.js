var button = document.getElementById("button");
var table = document.getElementById("table");
var head = document.getElementById("head");
var download = document.getElementById("ballsWaveG");
var returnTable = document.getElementById("returnTable");
var studentCard = document.getElementById('studentCard');
var studData = document.getElementById('studData');

function loadStudents() {

    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'students.json', true);

    xhr.send();

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        download.parentNode.removeChild(download);

        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            try {
                var students = JSON.parse(xhr.responseText);
            } catch (e) {
                alert("Некорректный ответ " + e.message);
            }
            head.innerHTML = 'Список студентов';

            showStudents(students);

            if (getCookie('colNum')){
                sortGrid(getCookie('colNum'), getCookie('type'), getCookie('sorted'))
            }

            if (getCookie('cardRow')){
                getCard(+getCookie('cardRow'))
            }

        }

    };

    button.parentNode.removeChild(button);
    download.style.visibility = 'visible';
    setCookie('isLoaded', 1, {expires: 3600*500})
}


function showStudents(students) {
    var contents = '<thead><th data-type="number">№</th><th data-type="string">Имя</th><th data-type="string">Фамилия</th><th data-type="number">Группа</th><th data-type="number">Средний бал</th></thead><tbody>';
        for (var i = 0; i < students.length; i++) {
        contents += "<tr><td>" + students[i].id + "</td><td>" + students[i].name + "</td><td>"
                + students[i].surname + "</td><td>" + students[i].group  + "</td><td>" +  students[i].averagePoint + "</td></tr>";
    }
    contents += '</tbody>';

    table.innerHTML = '<table>' + contents + '</table>';
}



function sortGrid(colNum, type, sorted) {
    var tbody = table.getElementsByTagName('tbody')[0];

    var rowsArray = [].slice.call(tbody.rows);

    var compare;

    table.tHead.rows[0].cells[colNum].style.backgroundColor = 'grey';

    if (sorted=='1'){

        table.tHead.rows[0].cells[colNum].setAttribute("sorted", "2");

        switch (type) {
            case 'number':
                compare = function(rowA, rowB) {
                    return  rowB.cells[colNum].innerHTML - rowA.cells[colNum].innerHTML;
                };
                break;
            case 'string':
                compare = function(rowA, rowB) {
                    return rowA.cells[colNum].innerHTML < rowB.cells[colNum].innerHTML ? 1 : -1;
                };
                break;
        }
    }
    else {
        table.tHead.rows[0].cells[colNum].setAttribute("sorted", "1");

        switch (type) {
            case 'number':
                compare = function(rowA, rowB) {
                    return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
                };
                break;
            case 'string':
                compare = function(rowA, rowB) {
                    return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
                };
                break;
        }
    }

    rowsArray.sort(compare);

    table.removeChild(tbody);

    for (var i = 0; i < rowsArray.length; i++) {
        tbody.appendChild(rowsArray[i]);
    }

    table.appendChild(tbody);

    setCookie('colNum', colNum, {expires: 3600*500});
    setCookie('type', type, {expires: 3600*500});
    setCookie('sorted', sorted, {expires: 3600*500});
}


function getCard(row) {
    table.style.visibility = 'hidden';
    table.style.position = 'absolute';
    studentCard.style.visibility = 'visible';
    head.innerHTML = '';
    studData.innerHTML = '';

    for(var i = 0; i< table.rows[row].cells.length; i++){
        studData.innerHTML += '<p>'+ table.tHead.rows[0].cells[i].innerHTML + ' :     ' + table.rows[row].cells[i].innerHTML + '</p>'
    }
    setCookie('cardRow', row, {expires: 3600*500});
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}


if (getCookie('isLoaded')){
    loadStudents()
}



table.onclick = function(e) {
    if (e.target.tagName == 'TH') {
        var th = table.getElementsByTagName("TH");
        for (var i = 0; i < th.length; i++) {
            th[i].style.backgroundColor = '#BCEBDD';
        }
        sortGrid(e.target.cellIndex, e.target.getAttribute('data-type'), e.target.getAttribute('sorted'));
    }

    if (e.target.tagName == 'TD') getCard(e.target.parentNode.rowIndex)
};

returnTable.onclick = function () {
    table.style.visibility = 'visible';
    table.style.position = '';
    studentCard.style.visibility = 'hidden';
    head.innerHTML = 'Список студентов';
    setCookie('cardRow', '', {expires: -1});
};

