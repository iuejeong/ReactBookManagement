import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQueries, useQuery } from 'react-query';
import axios from 'axios';
import { refreshState } from '../../../atoms/Auth/AuthAtoms';
import { useRecoilState } from 'recoil';

const AuthRouteReactQuery = ({ path, element }) => {
    const [ refresh, setRefresh ] = useRecoilState(refreshState);

    const { data, isLoading } = useQuery(["authenticated"], async () => {
     const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:8080/auth/authenticated", {params: {accessToken}});
        return response;
    }, {
        enabled: refresh
    });

    const principal = useQuery(["principal"], async () => {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:8080/auth/principal", {params: {accessToken}})
        return response;
        },{
            enabled: data.data    // 값이 true일 때만 data에 넣는다. !!는 not에 not
    });
    
    useEffect(() => {
        if(!refresh) {
            setRefresh(true);
        }
    }, [refresh]);
    
    if(isLoading) {
        console.log("test")
        return (<div>로딩중...</div>);
    }

    
    if(principal !== undefined) {
        const roles = principal.data.data.authorities.split(",");
        // const hasAdminPath = path.substr(0, 6) === "/admin";        // path에서 0부터 6까지 잘랐을 때 /admin이 들어가있는지 확인
        if(path.startsWith("/admin") && !roles.includes("ROLE_ADMIN")) {
            alert("접근 권한이 없습니다.");
            return <Navigate to="/" />
        }
    }
    
    if(!isLoading) {
        const permitAll = ["/login", "/register", "/password/forgot"];

        if(!data.data) {
            if(permitAll.includes(path)){
                return element;
            }
            return <Navigate to="/login" />;
        }

        if(permitAll.includes(path)){
            return <Navigate to="/" />;
        }
    return element;
    }
};

export default AuthRouteReactQuery;