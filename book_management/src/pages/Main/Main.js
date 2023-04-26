/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import BookCard from '../../components/UI/BookCard/BookCard';
import { useQuery } from 'react-query';
import { BsMenuDown } from 'react-icons/bs';
import QueryString from 'qs';

const mainContainer = css`
    padding: 10px;
`;

const header = css`
    display: flex;
    justify-content: space-between;
    height: 100px;
    padding: 40px;
`;

const title = css`
    font-size: 35px;
    font-weight: 600;
`;

const searchItems = css`
    display: flex;
    justify-content: space-between;
    padding: 10px;
`;

const categoryButton = css`
    position: relative;
    border: 1px solid #dbdbdb;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    background-color: white;
    cursor: pointer;
`;

const categoryGroup = (isOpen) => css`
    position: absolute;
    top: 30px;
    right: -151px;
    display: ${isOpen ? "flex" : "none"};
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    padding: 5px;
    width: 180px;
    max-height: 100px;
    background-color: white;
    overflow: auto;
`;

const searchInput = css`
    border: 1px solid #dbdbdb;
    border-radius: 7px;
    padding: 5px;
    width: 150px;
    height: 30px;
`;

const main = css`
    display: flex;
    flex-wrap: wrap;
    height: 750px;
    overflow-y: auto;
    `;

const Main = () => {
    const [ searchParam, setSearchParam ] = useState({page: 1, searchValue: "", categoryIds: []});
    const [ refresh, setRefresh ] = useState(false);
    const [ categoryRefresh, setCategoryRefresh ] = useState(true);     // 첫 로드 때 들고와야 함
    const [ isOpen, setIsOpen ] = useState(false);
    const [ books, setBooks ] = useState([]);
    const [ lastPage, setLastPage ] = useState(1);
    const lastBookRef = useRef();
    const categoryButtonRef = useRef();

    useEffect(() => {
        const observerService = (entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    setRefresh(true);
                }
            })
        }

        // 화면을 내리다 lastBookRef를 만나면 callback 함수인 observerService를 실행하라.(dom 객체만 들어올 수 있음)
        // IntersectionObserver에 callback 함수를 넣으면 알아서 매개 변수를 전달해줌.(문법)
        const observer = new IntersectionObserver(observerService, {threshold: 1});
        observer.observe(lastBookRef.current); 
    }, []);

    const option = {
        params: searchParam,
        headers: {
            Authorization: localStorage.getItem("accessToken")
        },
        paramsSerializer: params => QueryString.stringify(params, {arrayFormat: 'repeat'})
    }
    const searchBooks = useQuery(["seachBooks"], async () => {
        const response = await axios.get("http://localhost:8080/books", option);
        return response;
    }, {
        onSuccess: (response) => {
            if(refresh){
                setRefresh(false);
            }
            console.log(response);
            const totalCount = response.data.totalCount
            setLastPage(totalCount % 20 === 0 ? totalCount / 20 : Math.ceil(totalCount / 20));      // Math.ceil = 올림(totalCount / 20 값을 올림)
            setBooks([...books, ...response.data.bookList]);
            setSearchParam({...searchParam, page: searchParam.page + 1});
        },
        enabled: refresh && (searchParam.page < lastPage + 1 || lastPage === 0)
    });

    const categories = useQuery(["categories"], async () => {
        const option = {
            headers : {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        const response = await axios.get("http://localhost:8080/categories", option)
        return response;
    },{
        enabled: categoryRefresh,
        onSuccess: () => {
            if(categoryRefresh) {
                setCategoryRefresh(false);
            }
        }
    })

    const categoryClickHandle = (e) => {
        e.stopPropagation();
        if (isOpen && (e.target === categoryButtonRef.current)) {
            setIsOpen(!isOpen);
        } else {
            setIsOpen(true);
        }
    }

    const categoryCheckHandle = (e) => {
        if(e.target.checked) {
            setSearchParam({...searchParam, page: 1, categoryIds: [...searchParam.categoryIds, e.target.value]});
        }else {
            setSearchParam({...searchParam, page: 1, categoryIds: [...searchParam.categoryIds.filter(id => id !== e.target.value)]})
        }
        setBooks([]);
        setRefresh(true);
    }

    const searchInputHandle = (e) => {
        setSearchParam({...searchParam, searchValue: e.target.value});
    }

    const searchSubmitHandle = (e) => {
        if(e.keyCode === 13) {
            setSearchParam({...searchParam, page: 1});
            setBooks([]);
            setRefresh(true);
        }
    }

    return (
        <div css={mainContainer}>
            <Sidebar></Sidebar>
            <header css={header}>
                <div css={title}>도서검색</div>
                <div css={searchItems}>
                    <button css={categoryButton} onClick={categoryClickHandle} ref={categoryButtonRef}>
                        <BsMenuDown />
                        <div css={categoryGroup(isOpen)}>
                            {categories.data !== undefined
                            ? categories.data.data.map(category => 
                                (<div key={category.categoryId}>
                                    <input type="checkbox" onChange={categoryCheckHandle} id={"ct-" + category.categoryId} value={category.categoryId}/>
                                    <label htmlFor={"ct-" + category.categoryId}>{category.categoryName}</label>
                                </div>))
                            : ""}
                        </div>
                    </button>
                    <input css={searchInput} type="search" onKeyUp={searchSubmitHandle} onChange={searchInputHandle} />
                </div>
            </header>
            <main css={main}>
                {/* 데이터가 있을 때만 사용한다. */}
                {books.length > 0 ? books.map(book => (<BookCard key={book.bookId} book={book}></BookCard>)) : ""}
                <div ref={lastBookRef}></div>
            </main>
        </div>
    );
};

export default Main;