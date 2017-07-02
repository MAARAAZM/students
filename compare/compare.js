(function () {
    var compareId = JSON.parse(localStorage.getItem('compareJSON'));
    var download = document.getElementById("ballsWaveG");
    var table = document.getElementById("compareTable");
    var tableBody = document.getElementById('tableBody');
    var head = document.getElementById('tableHead');
    var comparedStudents = [];
    var filesNumber = 0;


    for (var i = 0; i < compareId.length; i++){
        requestStudentsData(compareId[i])
    }

    function requestStudentsData(id) {
        var xhr = new XMLHttpRequest();
        var studentFile = "../studentsData/id" + id + ".json";

        xhr.open('GET', studentFile, true);

        xhr.send();

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;


            if (xhr.status !== 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                try {
                    var student = JSON.parse(xhr.responseText);

                } catch (e) {
                    alert("Некорректный ответ " + e.message);
                }
                head.innerHTML = '<tr>';
                comparedStudents.push(student);

                filesNumber++;

                if (filesNumber === compareId.length) {
                    download.style.visibility = 'hidden';
                    download.style.position = 'absolute';
                    showCompareTable()
                }
            }

        };

        table.style.visibility = 'hidden';
        table.style.position = 'absolute';
        download.style.visibility = 'visible';
        download.style.position = '';
    }

    function showCompareTable() {
        head.innerHTML = '<th></th>';
        var photos = [];
        for (var i = 0; i < comparedStudents.length; i++){
            head.innerHTML += '<th>' + comparedStudents[i].name[1] + ' ' + comparedStudents[i].surname[1] + '</th>';
            delete comparedStudents[i].name;
            delete comparedStudents[i].surname;
            photos[i] = comparedStudents[i].img;
            delete comparedStudents[i].img;
        }
        var contents = '';
        for (var key in comparedStudents[0]){
            contents += '<tr>';
            contents += '<td>' + comparedStudents[0][key][0] + '</td>';
            for (var i = 0; i < comparedStudents.length; i++) {
                contents += '<td>' + comparedStudents[i][key][1] + '</td>'
            }
        }
        contents += '</tr><tr><td>Фото</td>';
        for (var i = 0; i < photos.length; i++){
            contents += "<td><img src= \"../" + photos[i] + "\"></td>";
        }
        contents += '</tr>';
        tableBody.innerHTML = contents;
        table.style.visibility = '';
        table.style.position = '';
    }

})();