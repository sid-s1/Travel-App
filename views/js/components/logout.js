// Log user out and remove session data
export const logout = () => {
    axios.delete('/user/session/')
    .then(() => {
        console.log('SESSION DELETED')
        location.href = '/'; 
        })
    .catch(err => {
        if (err.response.status === 500) {
            alert('An unknown error occured. Please try again')
        } else {
            console.log(err)
            alert(err.message)
        }
    });
}