export const dateExtractor = {
    formatDate: (fullDate) => {
        const timeStamp = new Date(fullDate);
        const beautifiedStartDate = `${timeStamp.getDate()}/${timeStamp.getMonth() + 1}/${timeStamp.getFullYear()}`;
        return beautifiedStartDate;
    },
    htmlInputDate: (fullDate) => {
        const timeStamp = new Date(fullDate);
        const month = timeStamp.getMonth() + 1 < 10 ? '0' + (timeStamp.getMonth() + 1) : timeStamp.getMonth() + 1;
        const day = timeStamp.getDate() < 10 ? '0' + timeStamp.getDate() : timeStamp.getDate();
        const htmlInputFormattedDate = `${timeStamp.getFullYear()}-${month}-${day}`;
        return htmlInputFormattedDate;
    }
};