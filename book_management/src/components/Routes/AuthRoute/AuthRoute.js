import React from 'react';
import { Navigate } from 'react-router-dom';
import { authenticatedState } from '../../../atoms/Auth/AuthAtoms';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { useQuery } from 'react-query';
import { getAuthenticated } from '../../../api/auth/AuthApi';

const validateToken = async (accessToken) => {       // async를 달면 return이 promise임
    const response = await axios.get("http://localhost:8080/auth/authenticated", {params: {accessToken}})       // params는 get 요청 때만. 그러면 queryParam이 들어감
    return response.data;       // 서버에서 토큰 유효 상태를 들고옴.
}

const AuthRoute = ({ path, element }) => {
    const [ authenticated, setAuthenticated ] = useRecoilState(authenticatedState);
    // accessToken가 get요청으로 간다. 그 후에 data에 들어감
    setAuthenticated(data);
    // 인증이 됐는지 확인.  true = 로그인 성공, false = 로그인 실패. 새로고침하면 해당 recoil이 재렌더링으로 초기화가 되기 때문에 authenticated가 초기 값인 false로 된다. 
    const permitAll = ["/login", "/register", "/password/forgot"];
    
    // 로그인 이후 렌더링 상태(재렌더링을 하지 않으면 실행이 안 되는 부분)
    if(!authenticated) {
        const accessToken = localStorage.getItem("accessToken");
        if(accessToken !== null) {
            validateToken(accessToken).then((flag) => {     // 서버에서 localstorage에 있는 토큰이 유효한지 확인
                setAuthenticated(flag);     // token이 true이고, authenticatedState를 true로 걸어줌으로써 로그인이 유지가 된다.
                });
                if(authenticated){
                    return element;
                }
                console.log("페이지 이동 테스트");
                return <Navigate to={path} />
            }
            if(permitAll.includes(path)) {
                return element;
            }

            return <Navigate to="/login" />;
        }

    if(permitAll.includes(path)) {
        return <Navigate to="/" />;
    }

 
    return element;
};

export default AuthRoute;