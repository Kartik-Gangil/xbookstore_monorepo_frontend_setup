import api from './axiosConfig';


// this function fetches the list of books from the backend
const fetchBooks = () => {
    return api.get('/api/books');
}

// this function fetches the details of a book from the backend using the book id
const fetchBookDetail = (id) => {
    return api.get(`/api/books/${id}`);
}

const fetchAuthors = (pageNumber) => {
    return api.get(`/api/authors?page=${pageNumber}`);
}

const fetchPublications = () => {
    return api.get('/api/publications');
}

export { fetchBooks, fetchBookDetail, fetchAuthors, fetchPublications    };