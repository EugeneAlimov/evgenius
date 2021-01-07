let excelFileSubmitButton = document.getElementById('excelFileSubmitButton'); // отключение по умолчанию кнопки отправки
excelFileSubmitButton.disabled=true; // excel афйла на распарсивание

let excelFileInput = document.getElementById('excelFileInput'); // получение объекта input-a отправки на распарсивание
let excelFileInputValue = excelFileInput.value; // excel файла и длины строки содержимого объекта

excelFileInput.addEventListener('change', disableExcelFileSubmitButton); // как произойдет изменение в форме вызов функции
// включение кнопки
// Включение кнопки отправки excel файла если содержимое инпута изменится и будет > 0
function disableExcelFileSubmitButton() {
    excelFileInputValue = excelFileInput.value;
    if(excelFileInputValue.length > 0) {
        excelFileSubmitButton.disabled=false
    }
}






let excelToCSVFileInput = document.getElementById('excelToCSVFileInput')

function handleFile(e) {
    let files = e.target.files
    let f = files[0]
    let reader = new FileReader()
    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result)
        let workbook = XLSX.read(data, {type: 'array'})
        let CSV_book = XLSX.utils.book_new()                                    // Create new book
        CSV_book.Props = {                                                      // Set properties book
            Title: 'Node-red TagsList'
        }
        let first_sheet_name = workbook.SheetNames[0]                           // Get Sheet name

        let address_of_cell = ''
        let worksheet = workbook.Sheets[first_sheet_name]                       // Get worksheet
        let desired_cell = worksheet[address_of_cell]                           // Find desired cell

        let desired_value = (worksheet[desired_cell] ? worksheet[desired_cell].v : undefined)   // Get the value
        let range = XLSX.utils.decode_range(worksheet['!ref'])                                  // Get the range
        let listRange = (Object.values(range)[1]).r
        let i = 1
        let sheetArr = []
            const D2cell = (worksheet['D2'] ? worksheet['D2'].v : undefined)
            if (D2cell.includes('%')) {
                while (i <= listRange) {
                    let cellArr = []
                    let D_X_Cell = worksheet[`D${i}`]
                    let A_X_Cell = worksheet[`A${i}`]
                    let D_X_Value = (D_X_Cell ? D_X_Cell.v : undefined)
                    let A_X_Value = (A_X_Cell ? A_X_Cell.v : undefined)
                    let A_Cell_CSV = D_X_Value.slice(1)
                    let B_Cell_CSV = A_X_Value
                    cellArr.push(A_Cell_CSV, B_Cell_CSV)
                    sheetArr.push(cellArr)
                    ++i
                }
                let CSV_sheet = XLSX.utils.aoa_to_sheet(sheetArr)
                XLSX.utils.sheet_to_csv(CSV_sheet)
                XLSX.utils.book_append_sheet(CSV_book, CSV_sheet)
                XLSX.writeFile(CSV_book, 'workbook.csv', {bookType:"csv", FS:"\t"})
            } else {
                toStart: for (i; i < listRange; i++) {
                    let cellArr = []
                    let cell = (worksheet[`A${i}`] ? worksheet[`A${i}`].v : undefined)
                    // console.log(cell)
                    const arrException = ['InOut', 'Output', 'Static']
                    if (arrException.includes(cell)) {
                        console.log( i, cell)
                        continue toStart
                        } else {
                            let A_X_Cell = worksheet[`A${i}`]
                            let B_X_Cell = worksheet[`B${i}`]
                            let C_X_Cell = worksheet[`C${i}`]
                            let D_X_Cell = worksheet[`D${i}`]
                            let A_X_Value = (A_X_Cell ? A_X_Cell.v : undefined)
                            let B_X_Value = (B_X_Cell ? B_X_Cell.v : undefined)
                            let C_X_Value = (C_X_Cell ? C_X_Cell.v : undefined)
                            C_X_Value = String(C_X_Value)
                            let D_X_Value = (D_X_Cell ? D_X_Cell.v : undefined)
                            let dataType = ''
                            if (B_X_Value === 'Bool') {
                            dataType = 'X'
                            if (C_X_Value.includes('.')) {
                                C_X_Value = C_X_Value + '.0'
                                }
                            } else  if (B_X_Value === 'Int') {
                                dataType = 'DI'
                            } else  if (B_X_Value === 'Real') {
                                dataType = 'R'
                            } else  if (B_X_Value === 'IEC_TIMER' || 'TON_TIME' || 'TOF_TIME') {
                                dataType = 'DW'
                            }

                        let A_Cell_CSV = `${D_X_Value},${dataType}${C_X_Value}`
                        let B_Cell_CSV = A_X_Value

                        cellArr.push(A_Cell_CSV, B_Cell_CSV)
                        sheetArr.push(cellArr)

                    }
                }

                let CSV_sheet = XLSX.utils.aoa_to_sheet(sheetArr)
                XLSX.utils.sheet_to_csv(CSV_sheet)
                XLSX.utils.book_append_sheet(CSV_book, CSV_sheet)
                XLSX.writeFile(CSV_book, 'workbook.csv', {bookType:"csv", FS:"\t"})

            }

        };
            reader.readAsArrayBuffer(f)
    }
excelToCSVFileInput.addEventListener('change', handleFile, false)
