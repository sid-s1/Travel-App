// Log user out and remove session data
export const logout = () => {
    axios.delete('/user/session/')
    .then(() => {
        localStorage.clear();
        location.href = '/'; 
        })
    .catch(err => {
        if (err.response.status === 500) {
            alert('An unknown error occured. Please try again')
        } else {
            alert(err.message)
        }
    });
}