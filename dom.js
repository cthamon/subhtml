const isNumber = function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
};

$(document).ready(function () {
    const url = 'https://brook-olivine-cactus.glitch.me/ref';

    $.ajax({
        type: "get",
        url,
        beforeSend: function () {
            $('#debenture-options').hide();
        },
        success: function (response) {
            $('#small-loader').hide();
            $('#debenture-options').show();

            response.forEach(row => {
                row[1].split(",").forEach(deal => {
                    $('#debenture-options').append('<option data-url=' + row[0] + ' value=' + deal + '>' + deal + '</option>');
                });
            });
            // $('#debenture-options').append()
        }
    });
});

// $("input#name").on('keydown', function (e) {
$("select#debenture-options").on('change', function (e) {
    e.stopImmediatePropagation();
    const url = 'https://brook-olivine-cactus.glitch.me/conn';

    const optionSelected = $("option:selected", this);
    const valueSelected = this.value;

    // if (e.key === "Enter") {
    if (valueSelected !== "0") {
        $.ajax({
            type: "POST",
            url,
            data: {
                // 'name': $("input#name").val() 
                'name': e.target.value,
                'url': optionSelected.attr('data-url')
            },
            beforeSend: function () {
                $('#sheetscon').html("<div id='loading' style='width: 48px; margin: 120px auto 0 auto;'><i class='bx bx-loader-alt bx-spin'></i></div>");
                $('#sheetsinfo').html("");
            },
            success: function (response) {
                $('div#loading').remove();

                // console.log(response);

                const rows = response;

                const data = {};

                const table2 = document.createElement('table');
                table2.id = "sheets-info";
                document.querySelector('#sheetsinfo').appendChild(table2);

                const sheetsinfo = document.querySelector('#sheets-info');

                const thead2 = document.createElement('thead');
                const tbody2 = document.createElement('tbody');
                const tfoot2 = document.createElement('tfoot');
                const tr2 = document.createElement('tr');
                const title2 = ['Team', 'Employee', 'Subs ', 'Allot', 'Waiting', 'Remark'];
                title2.forEach(item => {
                    const th = document.createElement('th');
                    th.innerText = item;
                    tr2.appendChild(th);
                });

                thead2.appendChild(tr2);
                sheetsinfo.appendChild(thead2);

                try {
                    rows.forEach(row => {
                        const tr = document.createElement('tr');
                        const td1 = document.createElement('td');
                        const td2 = document.createElement('td');
                        const td3 = document.createElement('td');
                        const td4 = document.createElement('td');
                        const td5 = document.createElement('td');
                        const td6 = document.createElement('td');

                        const sub = typeof (row[7]) !== 'undefined' && row[7] ? +row[7].replace(/,/g, '') : 0;
                        const wait = typeof (row[8]) !== 'undefined' && row[8] ? +row[8].replace(/,/g, '') : 0;

                        if (data[row[2]]) {
                            data[row[2]]['sub'] += isNumber(sub) ? sub : 0;
                            data[row[2]]['wait'] += isNumber(wait) ? wait : 0;
                        } else {
                            data[row[2]] = {};
                            data[row[2]]['sub'] = isNumber(sub) ? sub : 0;
                            data[row[2]]['wait'] = isNumber(wait) ? wait : 0;
                        }

                        td1.innerText = row[2];
                        td2.innerText = row[6];
                        td3.innerText = row[3];
                        td4.innerText = isNumber(sub) ? sub.toLocaleString() : 0;
                        td5.innerText = isNumber(wait) ? wait.toLocaleString() : 0;
                        td6.innerText = '';
                        if (row[9]) {
                            td6.innerText = row[9];
                        }

                        td3.className = "align-right";
                        td4.className = "align-right";
                        td5.className = "align-right";

                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tr.appendChild(td3);
                        tr.appendChild(td4);
                        tr.appendChild(td5);
                        tr.appendChild(td6);

                        tbody2.appendChild(tr);
                    });
                } catch (err) {
                    $('#sheetscon').html("<h1 style='text-align: center;'>No Data</h1>");
                }

                sheetsinfo.appendChild(tbody2);

                const table = document.createElement('table');
                table.id = "sheets-table";

                $('#sheetscon').append('<h3>Summary</h3>');
                if (rows[0][10]) {
                    $('#description-box #d1').html('<h3>' + rows[0][10] + '</h3>');
                }
                if (rows[1][10] && rows[1][11]) {
                    $('#description-box #d2').html('<h3>' + rows[1][10] + ' ' + rows[1][11] + '</h3>');
                }

                document.querySelector('#sheetscon').appendChild(table);

                const sheetstable = document.querySelector('#sheets-table');

                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');
                const tfoot = document.createElement('tfoot');
                const tr = document.createElement('tr');
                const title = ['Team', 'Size', 'Wait'];
                title.forEach(item => {
                    const th = document.createElement('th');
                    th.innerText = item;
                    tr.appendChild(th);
                });

                thead.appendChild(tr);
                sheetstable.appendChild(thead);

                for (const property in data) {
                    if (data[property]['sub'] === 0) {
                        continue;
                    }

                    const tr = document.createElement('tr');

                    const td1 = document.createElement('td');
                    td1.innerText = property;
                    tr.appendChild(td1);

                    const td2 = document.createElement('td');
                    td2.className = "align-right";
                    td2.innerText = data[property]['sub'].toLocaleString();
                    tr.appendChild(td2);

                    const td3 = document.createElement('td');
                    td3.className = "align-right";
                    td3.innerText = data[property]['wait'].toLocaleString();
                    tr.appendChild(td3);

                    tbody.appendChild(tr);
                    sheetstable.appendChild(tbody);
                }

                sheetstable.appendChild(tfoot);

                $('#sheets-table tfoot').html('<tr><th>Total</th><th id="totalsub" class="align-right">0</th><th id="totalwait" class="align-right">0</th></tr>');

                $('#sheets-table').DataTable({
                    paging: false,
                    // ordering: false,
                    info: false,
                    search: false,
                    footerCallback: function (row, data, start, end, display) {
                        const api = this.api();

                        // Remove the formatting to get integer data for summation
                        const intVal = function (i) {
                            return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                        };

                        // Total over all pages
                        totalsub = api
                            .column(1)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        totalwait = api
                            .column(2)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        $('#sheets-table tfoot #totalsub').text(totalsub.toLocaleString());
                        $('#sheets-table tfoot #totalwait').text(totalwait.toLocaleString());
                    }
                });

                $('#sheets-info').DataTable({
                    iDisplayLength: 25
                });
            },
            error: function (err) {
                $('#sheetscon').html("<h1 style='text-align: center;'>Error</h1>");
            }
        });
    }
});