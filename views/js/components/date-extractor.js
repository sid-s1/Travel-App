export const dateExtractor = {
    formatDate: (fullDate) => {
        const timeStamp = new Date(fullDate);
        const beautifiedStartDate = `${timeStamp.getDate()}/${timeStamp.getMonth() + 1}/${timeStamp.getFullYear()}`;
        return beautifiedStartDate;
    }
};