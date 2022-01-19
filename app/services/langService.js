const numbers = {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
}

exports.toPersianNumber = (input) => {
    return String(input).split('').map(number => numbers[number] ? numbers[number] : number).join('')
}