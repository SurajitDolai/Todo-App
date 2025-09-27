import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ off, login }) {
    const navigator = useNavigate();
    const [menu, setMenu] = useState(false);
    const [nav, setNav] = useState(false);




    let token = localStorage.getItem('user');

    let u_id = null;
    if (token) {
        try {
            u_id = jwtDecode(token);
            // console.log(u_id);
        } catch (err) {
            console.error("Intoken token:", err);
            console.log("Token Expire LogOut Now");
            localStorage.removeItem("user");
            navigator('/');
        }
    }
    useEffect(() => {
        axios.get('http://localhost:5000/get-work', {
            headers: { authorization: localStorage.getItem('user') }
        }).then((res) => {
            if (res.data.status === 201) {
                localStorage.removeItem("user");
                navigator('/');
                setNav(false);
            }
        }
        ).catch((err) => {
            setNav(true);
            console.log("done")
        }
        );
    }, []);

    return (
        <div>
            <nav className='flex justify-between bg-blue-900'>
                <div className='p-3'>
                    {/*  */}
                    <p className='mx-3 font-bold italic cursor-pointer font-serif text-gray-400 text-[12px] md:text-2xl line-clamp-4'>MyToDo</p>
                </div>
                <div>
                    <ul className='flex justify-center p-3 md:w-[100%]'>
                        {
                            token ?
                                <>
                                    <li className='mx-3 font-bold italic cursor-pointer font-serif text-gray-400 line-clamp-4 text-[9px] md:text-[20px]' onClick={() => off()}>Add your Work</li>
                                    <li className='mx-3 font-bold italic cursor-pointer font-serif text-gray-400 line-clamp-4 text-[9px] md:text-[20px]' onClick={() => { localStorage.removeItem("user"); navigator('/') }}>LogOut</li>
                                    <li>{token ? <p className='mx-3 font-bold italic cursor-pointer font-serif text-gray-700 bg-blue-200 px-2 p rounded-full line-clamp-4 text-[9px] md:text-[20px]'>{u_id.username.charAt(0)}</p> : ''} </li>
                                    <li className='mx-3 font-bold italic cursor-pointer font-serif text-gray-400 line-clamp-4 text-[10px] md:text-[20px]'><i className="fa-solid fa-ellipsis-vertical" onClick={() => setMenu(!menu)}></i></li>
                                    <div className={`absolute right-8 top-10 bg-white w-[20%] md:w-[10%] text-center  ${menu ? 'block' : 'hidden'}`}>

                                        <p className='font-serif'><Link to={'/all-work'}>All Work</Link></p>
                                    </div>
                                </>
                                :
                                <li className='mx-3 font-bold italic cursor-pointer font-serif text-gray-400 text-2xl line-clamp-4' onClick={() => login()}>Login</li>
                        }
                    </ul>
                </div>
            </nav>
        </div>
    )
}
