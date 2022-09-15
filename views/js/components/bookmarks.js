import { layout, pageContainer } from "./layout.js"
import { renderResults } from "./search.js"

export const renderBookmarks = () => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    layout.bookmarks();
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'results';
    pageContainer.appendChild(resultsContainer);
    axios.get(`/user/bookmarks/all/${userId}`)
        .then(response => {
            const results = renderResults(response, username, 'bookmarks');
            resultsContainer.appendChild(results);
    })
}

const checkBookmarkExistsForUser = (tripId, loggedInUserId) => {
    axios.get(`/user/bookmarks/${tripId}/${loggedInUserId}`)
    .then(dbRes => {
        return dbRes;
    })
    .catch(err => console.log(err));
}

export const createBookmarkIcon = async (tripId) => {
    const loggedInUserId = localStorage.getItem('userId');
    const bookmarkSpan = document.createElement('span');
    bookmarkSpan.className = 'bookmark';
    bookmarkSpan.id = `bookmark-trip${tripId}`;
    const bookmarkOffIcon = document.createElement('i');
    bookmarkOffIcon.className = 'fa-light fa-star bookmark-off';
    const bookmarkOnIcon = document.createElement('i');
    bookmarkOnIcon.className = 'fa-solid fa-star bookmark-on';
    bookmarkSpan.addEventListener('click', (e) => {
        console.log('toggle Bookmark');
        toggleBookmark(tripId);
    });
    const response = await checkBookmarkExistsForUser(tripId, loggedInUserId);
    // const response = {
    //     rowCount: 0
    // }
    console.log(`async response: ${response}`)
    if (response.length === 0) {
        bookmarkOffIcon.style.display = 'inline';
        bookmarkOnIcon.style.display = 'none';
    } else {
        bookmarkOffIcon.style.display = 'none';
        bookmarkOnIcon.style.display = 'inline';
    }
    bookmarkSpan.appendChild(bookmarkOffIcon);
    bookmarkSpan.appendChild(bookmarkOnIcon);
    return bookmarkSpan;
}

const toggleBookmark = (tripId) => {
    const targetedBookmarkSpan = document.getElementById(`bookmark-trip${tripId}`);
    const bookmarkOff = targetedBookmarkSpan.querySelector('.bookmark-off');
    const bookmarkOn = targetedBookmarkSpan.querySelector('.bookmark-on');
    if (bookmarkOn.style.display === 'none') {
        bookmarkOn.style.display = 'inline';
        bookmarkOff.style.display = 'none';
        createBookmark(tripId);
    } else {
        bookmarkOn.style.display = 'none';
        bookmarkOff.style.display = 'inline';
        deleteBookmark(tripId);
    }

}

const createBookmark = (tripId) => {
    const userId = localStorage.getItem('userId');
    const form = document.createElement('form');
    form.innerHTML = `<input type='hidden' name='user-id' value='${userId}'>
    <input type='hidden' name='trip-id' value='${tripId}'>`
    const formData = new FormData(form);
    const data = {
        tripId: formData.get('trip-id'),
        userId: formData.get('user-id')
      };
    axios.post('/user/bookmarks', data)
    .then(response => {
        console.log('bookmark created');
        console.log(response);
    })
    .catch((err) => {
        console.log(err)
    })
}

const deleteBookmark = (tripId) => {
    const userId = localStorage.getItem('userId');
    const form = document.createElement('form');
    form.innerHTML = `<input type='hidden' name='user-id' value='${userId}'>
    <input type='hidden' name='trip-id' value='${tripId}'>`
    const formData = new FormData(form);
    const data = {
        tripId: formData.get('trip-id'),
        userId: formData.get('user-id')
      };
    axios.delete('/user/bookmarks', data)
    .then(response => {
        console.log('bookmark deleted');
        console.log(response);
    })
    .catch((err) => {
        console.log(err)
    })
}
