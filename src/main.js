const tbody = document.querySelector('.my-table__body');
let data = [];

const getData = async () => {
    const response = await fetch('data.json');
    const json = await response.json();
    data = json;
};

const createRow = function(rowData) {
    const tr = document.createElement('TR');

    Object.keys(rowData).forEach(key => {
        if (key === 'id' || key === 'phone') return;

        if (typeof key === Object) console.log(key);

        const td = document.createElement('TD');
        td.textContent = rowData[key];
        tr.appendChild(td);
    });

    return tr;
};

const drawTable = function(tableData) {
    const fragment = document.createDocumentFragment();

    tableData.forEach(row => {
        const newRow = createRow(row);
        fragment.appendChild(newRow);
    });

    tbody.appendChild(fragment);
};



(async function() {
    await getData();
    drawTable(data);
    console.log(data);
}());
