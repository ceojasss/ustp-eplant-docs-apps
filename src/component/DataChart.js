import axios from 'axios'
import eplant from "../apis/eplant";

export const Data = [
    {
      id: 1,
      testUp: 14300,
      testDown: 134
    }
  ];
//
// export const testData = () => axios({
//   url: 'http://localhost:3000/api/chart',
//   method: 'get',
//   headers: {
//     'Accept': 'application/json',
//     'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJHQ00gQURNSU4iLCJzaXRlIjoiR0NNIiwibG9jYXRpb24iOiJITyIsInVzZXJzaXRlIjpudWxsLCJkZXBhcnRtZW50IjoiR1MiLCJpYXQiOjE2NzAyMTIxNDYsIm9wZW5wZXJpb2QiOiIyMDIyLTEwLTMxVDE3OjAwOjAwLjAwMFoiLCJleHAiOjE2NzAyOTg1NDZ9.o5nzxKkYJuNlytUEiWybQQBNVpa-3kRv86INSNqyM-s'
//   },
// }).then(function (response) {
//
//     console.log(response);
//     return response.json()
// }).then(data => {
//   const dataa = [
//     {
//       dataChart: data
//     }
//   ]
//   return dataa
// }).catch(function (error) {
//   return error
//         // handle error
//         console.log(error);
//     })
//
// const fetchData = () => {
//   const dataa = []
//   fetch('http://localhost:3000/api/chart', {
//     Method: 'GET',
//     Headers: {
//       'Access-Control-Allow-Origin':'*',
//       'Accept': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJHQ00gQURNSU4iLCJzaXRlIjoiR0NNIiwibG9jYXRpb24iOiJITyIsInVzZXJzaXRlIjpudWxsLCJkZXBhcnRtZW50IjoiR1MiLCJpYXQiOjE2NzAyMzMwODAsIm9wZW5wZXJpb2QiOiIyMDIyLTEwLTMxVDE3OjAwOjAwLjAwMFoiLCJleHAiOjE2NzAzMTk0ODB9.JnR0Qn4aA4BQhVEIOL86Et_68QUTKaEnLwV-_SlRLx0',
//       'Content-Type': 'application/json'
//     },
//   })
//   .then(response => {
//     console.log(response);
//     return response
//
//     // return response
//   })
//   .then(data => {
//     console.log(data);
//     return data
//     // return dataa
//   })
//   .catch(error => {
//     console.log(error)
//   });
// }
