const extractValuesFromArrObjects = (arr) => {
    const valueArr = [];
    for (const entry of arr) {
        for (const key of Object.keys(entry)) {
            valueArr.push(entry[key]);
        }
    }
    return valueArr;
};

module.exports = extractValuesFromArrObjects;