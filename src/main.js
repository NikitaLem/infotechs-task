import initialData from './data.json'; //импорт данного в задаче json
 
const sorterArr = document.querySelectorAll('.sorter'); //список всех элементов, инициализирующих сортировку
const editor = document.querySelector('.edit');
const visibilityController = document.querySelector('.visible-controller');
const table = document.querySelector('.my-table');
const pagination = document.querySelector('.my-pagination div');
let paginationControlls = [];
let tableRows = [];

const NOTES_IN_TABLE = 10; //константа для максимального количества записей в таблице

let data = []; //переменная с массивом данных для записи в таблицу
let pageCounter = 1; //переменная для номера текущей десятки отображаеммых записей
let maxPageAmount = Math.ceil(initialData.length / 10);

//отрисовываем интерефейс для пагинации
const drawPagination = function() {
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= maxPageAmount; i++) {
        let div = document.createElement('div');
        div.textContent = i;
        fragment.appendChild(div);
    }

    pagination.appendChild(fragment);
    paginationControlls = [...pagination.querySelectorAll('div')];
    pagination.addEventListener('click', (event) => {
        const target = event.target.closest('div');
        pageCounter = Number.parseInt(target.textContent, 10);
        setInitialData();
        refreshTable(data, '.my-table__body');
    }, false);
};

//заносим в data только те 10 записей из initialData, которые соответствуют текущему номеру paginationCounter
const setInitialData = function() {
    data.splice(0, data.length);

    initialData.slice((pageCounter - 1) * NOTES_IN_TABLE, pageCounter * NOTES_IN_TABLE).forEach(item => {
        let currentPerson = {
            firstName: item.name.firstName,
            lastName: item.name.lastName,
            about: item.about,
            eyeColor: item.eyeColor
        };

        data.push(currentPerson);
    });
};

//создаем одну строку в таблице. Принимает один элемент из массива data
const createRow = function(rowData) {
    const tr = document.createElement('TR');

    Object.keys(rowData).forEach(key => {
        if (key === 'id' || key === 'phone') return;

        if (key === 'eyeColor') {
            const td = document.createElement('TD');
            td.setAttribute('data-type', key);
            td.style.backgroundColor = rowData[key];
            tr.appendChild(td);    
        } else {
            const td = document.createElement('TD');
            td.setAttribute('data-type', key);
            td.textContent = rowData[key];
            tr.appendChild(td);
        }
    });

    return tr;
};

//отрисовываем данные в таблицу
const drawTable = function(tableData, tableClass) {
    const tbody = document.querySelector(tableClass);
    const fragment = document.createDocumentFragment();

    tableData.forEach(row => {
        const newRow = createRow(row);
        fragment.appendChild(newRow);
    });

    tbody.appendChild(fragment);
    tableRows = [...document.querySelectorAll('.my-table__body tr')];

    sorterArr.forEach(item => {
        item.addEventListener('click', makeSort, false);
    });

    tableRows.forEach(item => {
        item.addEventListener('click', prepareEditor, false);
    });
};

//сортируем массив data по переданному ключу
const sortBy = function(key) {
    data.sort((a, b) => {
        if (a[key] > b[key])
            return 1;
        if (a[key] < b[key])
            return -1;

        return 0;
    });
};

//удаляем все строки в tbody нашей таблицы
const clearTable = function(tableClass) {
    const tbody = document.querySelector(tableClass);
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
};

//композиция для удаления старой таблицы и отрисовки новой. Для удобства
const refreshTable = function(tableData, tableClass) {
    clearTable(tableClass);
    drawTable(tableData, tableClass);
}

//колбэк для вызова функции сортировки
const makeSort = function(event) {
    const target = event.target.closest('.sorter');
    let sortParam = target.getAttribute('data-sort'); //берем ключ по которому будем сортировать из аттрибута data-sort в тэге th

    sortBy(sortParam);
    refreshTable(data, '.my-table__body');
};

//показываем блок-редактор
const showEditPanel = function() {
    editor.classList.add('active');
};

//заносим начальные данные в инпуты редактора. Вешаем обработчики кликов на кнопки
const prepareEditor = function(event) {
    const rowIndex = tableRows.indexOf(event.target.closest('.my-table__body tr')); //находим индекс записи которую будем редактировать
    showEditPanel();
    editor.querySelector('.edit__first-name').value = data[rowIndex].firstName;
    editor.querySelector('.edit__last-name').value = data[rowIndex].lastName;
    editor.querySelector('.edit__about').value = data[rowIndex].about;
    editor.querySelector('.edit__eye-color').value = data[rowIndex].eyeColor;

    //подтверждаем редактирование записи. получает индекс по которому записывает новый объект в data
    const completeEdition = function() {
        const newData = {
            firstName: editor.querySelector('.edit__first-name').value,
            lastName: editor.querySelector('.edit__last-name').value,
            about: editor.querySelector('.edit__about').value,
            eyeColor: editor.querySelector('.edit__eye-color').value
        };

        data.splice(rowIndex, 1, newData);
        editor.classList.remove('active');
        refreshTable(data, '.my-table__body');
        document.querySelector('.edit .ok').removeEventListener('click', completeEdition, false);
    };

    document.querySelector('.edit .ok').addEventListener('click', completeEdition, false);

    document.querySelector('.edit .cancel').addEventListener('click', (event) => { 
        event.target.closest('.edit').classList.remove('active');
    }, false);
};

//скрываем столбец таблицы по ключу
const hideCol = function(key) {
    const tdForHiding = table.querySelectorAll(`[data-type=${key}]`); //находим все ячейки таблицы со значением key в data-type
    tdForHiding.forEach(item => {
        item.style.display = 'none';
    });
};

//показываем столбец таблицы по ключу
const showCol = function(key) {
    const tdForHiding = table.querySelectorAll(`[data-type=${key}]`); //находим все ячейки таблицы со значением key в data-type
    tdForHiding.forEach(item => {
        if (key === 'about' && item.tagName === 'TD') //для ячеек с описанием нужно особое значение свойства display
            item.style.display = '-webkit-box';
        else
            item.style.display = 'table-cell';
    });
};

//инициализация таблицы при загрузке страницы
(function() {
    setInitialData();
    drawTable(data, '.my-table__body');
    drawPagination();

    //вешаем обработчик на чекбоксы, контроллирующие видимость столбцов
    [...visibilityController.getElementsByTagName('input')].forEach(item => {
        item.addEventListener('change', (event) => {
            const target = event.target;
            const type = target.getAttribute('data-type');console.log(type);
            if (!target.checked) hideCol(type);
            else showCol(type);
        }, false);
    });
}());
