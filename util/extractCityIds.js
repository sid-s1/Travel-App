const cityIds = (arr) => {
    const cityIdsArr = [];
    for (const entry of arr) {
        cityIdsArr.push(parseInt(entry.city_id));
    }
    return cityIdsArr;
};

module.exports = cityIds;