import React from 'react'
import { Navigate } from 'react-router-dom';

export default function Private_route({children}) {
    const isauthenticated=localStorage.getItem('user');
  
    return isauthenticated?children:<Navigate to='/'/>;
}
