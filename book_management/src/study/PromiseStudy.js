import React from 'react';

const PromiseStudy = () => {
    
    const a = new Promise((resolve, reject) => {
        console.log("프로미스 호출");
        if(1 !== 1) {
            resolve();
        } else {
            reject(new Error("오류입니다."))   // 에러를 처리함. reject 대신에 throw를 써도 됨
        }
        // resolve();  // 정상적으로 리턴 됐을 때 실행하는 함수
    });
    
    const clickHandler = () => {
        a.
        then(() => {
            console.log("1번 then 호출");
            return new Promise((resolve, reject) => {
                resolve("리턴!!!");
            });
        })
        .catch((error) => {
            console.log(error);
        })
        .then(b);        // then일 때 Promise 전체를 실행, 매개변수로 resolve의 return 값이 들어간다.
    }

    const b = (str)=> {
        console.log(str);
    }

    return (
        <div>
            <button onClick={clickHandler}>버튼</button>
        </div>
    );
};

export default PromiseStudy;