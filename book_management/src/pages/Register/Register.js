/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';    // router 안에서 이동할 때 사용됨.
import { FiLock, FiUser, } from 'react-icons/fi';
import { BiRename } from 'react-icons/bi';
import LoginInput from '../../components/UI/Login/LoginInput/LoginInput';
import axios from 'axios';

const container = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 30px;
`;

const logo = css`
    margin: 50px 0px;
    font-size: 34px;
    font-weight: 600;
`;

const mainContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 40px 20px;
    width: 400px;
`;

const authform = css`
    width: 100%;
`;

const inputLable = css`
    margin-left: 5px;
    font-size: 12px;
    font-weight: 600;
`;

const loginButton = css`
    margin: 10px 0px;
    border: 1px solid #dbdbdb;
    border-radius: 7px;
    width: 100%;
    height: 50px;
    background-color: white;
    font-weight: 900;
    cursor: pointer;
    &:hover {
        background-color: #fafafa;
    }
    &:active {
        background-color: #eee;
    }
    `;


const signupMessage = css`
    margin-top: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #777;
    `;

const register = css`
    margin-top: 10px;
    font-weight: 600;
`;

const Register = () => {
    const [registerUser, setRegisterUser] = useState({email:"", password:"", name:""});

    const onChangeHandle = (e) => {
        const {name, value} = e.target;
        setRegisterUser({...registerUser, [name]: value})
    }

    const registeSubmit = () => {
        const data = {
            ...registerUser
        }
        const option = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        // 동기는 요청을 날려놓고 응답이 올 때까지 가만히 기다린다.
        // 비동기는 요청 날려놓고 다른 할 일을 하는 것. 이유는 싱글 쓰레드이기 때문에
        // 웹 페이지에서는 오래걸리는 데이터는 나중에 띄우는 것이 비동기, 위에서부터 순서대로 띄우는 것이 동기
        axios
        .post("http://localhost:8080/auth/signup", JSON.stringify(data), option)
        .then(response => {
            console.log("성공");
            console.log(response);
        })
        .catch(error => {
            console.log("에러");
            console.log(error.response.data.errorData);
            console.log("test");
        });
        console.log("비동기 테스트");
    }

    return (
        <div css={container}>
            <header>
                <h1 css={logo}>SIGN UP</h1>
            </header>
            <main css={mainContainer}>
                <div css={authform}>
                    <label css={inputLable}>Email</label>
                    <LoginInput type="email" placeholder="Type your email" onChange={onChangeHandle} name="email">
                        <FiUser />
                    </LoginInput>

                    <label css={inputLable}>Password</label>
                    <LoginInput type="password" placeholder="Type your password" onChange={onChangeHandle} name="password">
                        <FiLock />
                    </LoginInput>

                    <label css={inputLable}>Name</label>
                    <LoginInput type="text" placeholder="Type your name" onChange={onChangeHandle} name="name">
                        <BiRename />
                    </LoginInput>


                    <button css={loginButton} onClick={registeSubmit}>REGISTER</button>
                </div>
            </main>
            
            <div css={signupMessage}>Already a user?</div>

            <footer>
                <div css={register}><Link to="/login">LOGIN</Link></div>
            </footer>
        </div>
    );
};

export default Register;