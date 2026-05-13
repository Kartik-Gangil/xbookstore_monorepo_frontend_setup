import { useState, createContext, useContext } from "react";
import { fetchBookDetail, fetchBooks, fetchAuthors, fetchPublications } from "../api/apiService";


// expose the context so consumers call useContext(ApiContext)
export const ApiContext = createContext();

// optional convenience hook, mirrors useAuth pattern
export const useApi = () => useContext(ApiContext);

/* { 
id: 1,
title: 'The Silent Observer', 
category: 'Mystery', 
author: 'Jane Doe', 
rating: 4.5, 
reviews: 120,
price: 599, 
publisher: 'Starlight Press', 
description: 'A thrilling mystery...', 
imageUrl: 'https://via.placeholder.com/300x400.png?text=Mystery' 
}*/

export function ApiProvider({ children }) {
    const [books, setBooks] = useState([]);
    const [bookData, setBookData] = useState()
    const [Authors, setAuthors] = useState([]);
    const [AuthorsCount, setAuthorsCount] = useState(0);
    const [publication , setPublication] = useState([]);


    const fetchAllBooks = async () => {
        try {
            const response = await fetchBooks();
            // setBooks(response.data.results);
            const books = response?.data?.results?.map((book) => ({
                id: book.id,
                title: book.title,
                category: 'Mystry',
                author: book.participants[0].author.user.username,
                rating: 4.5,
                reviews: 120,
                price: book.formats[0].mrp,
                publisher: book.publication.name,
                description: book.description,
                imageUrl: book.cover_image,
            }));
            setBooks(books);
            // console.log(response.data.results)
            // return response.results
        } catch (error) {
            console.error(error)
        }
    }

    const fetchBookbyID = async (id) => {
        try {
            const response = await fetchBookDetail(id);
            setBookData(
                {
                    id: response.data.id,
                    title: response.data.title,
                    isbn: response.data.isbn,
                    publication_date: response.data.publication_date,
                    description: response.data.description,
                    participants: response.data?.participants?.map(p => (
                        {
                            role: p.role.charAt(0).toUpperCase() + p.role.slice(1),
                            author: {
                                id: p.author.id,
                                firstName: p.author.user.first_name,
                                lastName: p.author.user.last_name,
                                designation: p.author.user.role,
                                imageUrl: p.author.image
                            }
                        }
                    ))

                        /*[
                        { role: 'Editor', author: { id: 1, firstName: 'Elena', lastName: 'Rodriguez', designation: 'Lead Editor', imageUrl: 'https://placehold.co/150/FFC300/808080?text=E.R' } },
                    ]
                        */,
                    chapters:
                        response.data?.chapters?.map(ch => ({
                            id: ch.id,
                            title: ch.title,
                            contributors: ch?.contributions?.map(c => ({
                                author: {
                                    id: c.contributor.author_id,
                                    firstName: c.contributor.user.first_name,
                                    lastName: c.contributor.user.last_name
                                }
                            })) || []
                        })) || []
                    /*    [
                        { id: 201, title: 'Chapter 1: The First Clue', contributors: [{ author: { id: 3, firstName: 'Aisha', lastName: 'Khan' } }] },
                    ]*/,
                    rating: response.data.average_rating,
                    reviews: response.data.total_reviews,
                    images:
                        response.data?.images?.map(img => (
                            { id: img.id, image: img.image }
                        ))
                    /*    [
                        { id: 1, image: 'https://placehold.co/400x600/162735/BDC1C8?text=Front+Cover' },
                        { id: 2, image: 'https://placehold.co/400x600/BDC1C8/162735?text=Back+Cover' },
                    ]
                        */,
                    formats:

                        response.data?.formats?.map(fmt => ({
                            id: fmt.id, binding_type: fmt.binding_type, quality: 'Standard', language: fmt.language, mrp: fmt.mrp, stock: fmt.stock, pages: response.data.pages || 0, paper_quality: fmt.format_name || 0, length_mm: fmt.length_mm, width_mm: fmt.width_mm, weight_grams: fmt.weight_grams, sale_type: fmt.sale_type || "", sale_value: fmt.sale_value || 0, affiliate_discount_percentage: fmt.affiliate_discount_percentage || '0'
                        }))
                        /*[
                        { id: 101, binding_type: 'Paperback', quality: 'Standard', language: 'English', mrp: '599.00', stock: 50, pages: 320, paper_quality: '70GSM', length_mm: 210, width_mm: 148, weight_grams: 350, sale_type: 'percentage', sale_value: '15', affiliate_discount_percentage: '10' },
                    ]
                        */,
                }
            );
            // return response
        } catch (error) {
            console.error(error)
        }
    }

    // { id: 1, firstName: 'Elena', lastName: 'Rodriguez', designation: 'Novelist', role: ['Author'], gender: 'Female', country: 'Spain', imageUrl: 'https://placehold.co/150/FFC300/808080?text=E.R' }

    const FetchAuthors = async (pageNumber = 1) => {
        try {
            const response = await fetchAuthors(pageNumber);
            const author = response?.data?.results?.map((a) => ({
                id: a.id,
                firstName: a.user.first_name,
                lastName: a.user.last_name,
                designation: a.user.role,
                role: Array.isArray(a.user.role) ? a.user.role : [a.user.role], // Ensure role is always an array
                gender: "male",
                country: "india",
                imageUrl: a.image
            }));
            setAuthors(author);
            setAuthorsCount(response?.data?.count || 0);
            // console.log(response.data)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }

    /*
     { id: 1, name: 'Starlight Press', logoUrl: 'https://via.placeholder.com/200x100/162735/FFFFFF?text=Starlight+Press' },
    */
    
    const fetchAllPublication = async () => {
        try {
            const response = await fetchPublications(); 
            const publication = response?.data?.results?.map((p) => ({
                id: p.id,
                name: p.name,
                logoUrl: p.logo
            }))
            setPublication(publication);
            return publication
        } catch (error) {
            console.error(error)
        }
    }
            

    const value = {
        books,
        bookData,
        fetchAllBooks,
        fetchBookbyID,
        Authors,
        AuthorsCount,
        FetchAuthors,
        publication,
        fetchAllPublication
    }
    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}