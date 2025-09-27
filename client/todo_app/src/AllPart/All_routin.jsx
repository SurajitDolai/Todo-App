import axios from 'axios';

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function All_routin() {
    const navigator = useNavigate();
    const [items, setItems] = useState([])
    const auth = localStorage.getItem('user');

    const dlt = (id, index) => {
        console.log(id)
        axios.delete(`http://localhost:5000/delete/${id}`)
            .then((res) => {
                console.log(res.data)
                fetchData();
            })
            .catch((err) => console.log(err));

        setItems((prev) => {
            const newItems = [...prev];
            newItems[index].animate = true;
            return newItems;
        });

    }
    const fetchData = () => {
        axios.get('http://localhost:5000/get-work', {
            headers: { authorization: localStorage.getItem('user') }
        })
            .then((res) => {
                console.log(res.data)
                if (res.status === 201) {
                    localStorage.removeItem("user");
                    navigator('/');
                }
                setItems(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => console.log(err));
    }
    useEffect(() => {
        fetchData();
    }, [])


    return (
        <div className='p-0 md:p-1 overflow-x-auto h-screen bg-blue-950 text-white  detail-page'>
            <h1 className=' text-2xl md:text-3xl text-gray-500 text-center font-bold italic sticky top-0 z-10'>Your All Task</h1>
            <table className='table-fixed mt-1  w-full '>
                <thead className='bg-blue-900 text-white bg-op opacity-60 sticky top-8 z-10'>
                    <tr className='text-[14px]'>
                        <th className='w-[5%] font-semibold text-center italic bg-linear-to-r to-yellow-300 from-blue-100 bg-clip-text text-transparent text-[10px] md:text-[18px]'>No</th>
                        <th className='w-[10%] md:w-[13%]  font-semibold text-center italic bg-linear-to-r to-yellow-300 from-blue-100 bg-clip-text text-transparent text-[10px] md:text-[22px] '>Task</th>
                        <th className='w-[17%] md:w-[25%] font-semibold text-center italic bg-linear-to-r to-yellow-300 from-blue-100 bg-clip-text text-transparent text-[10px] md:text-[22px] '>Description</th>
                        <th className='w-[13%] font-semibold text-center italic bg-linear-to-r to-yellow-300 from-blue-100 bg-clip-text text-transparent text-[10px] md:text-[22px] '>Start Time</th>
                        <th className='w-[12%] font-semibold text-center italic bg-linear-to-r to-yellow-300 from-blue-100 bg-clip-text text-transparent text-[10px] md:text-[22px] '>End Time</th>
                        <th className='w-[8%] font-semibold text-center italic bg-linear-to-r to-yellow-300 from-blue-100 bg-clip-text text-transparent text-[10px] md:text-[22px] '>Action</th>
                        <th className='w-[18%] md:w-[15%] font-semibold text-center italic bg-linear-to-r to-yellow-300 from-blue-100 bg-clip-text text-transparent text-[10px] md:text-[22px] '>Status</th>
                    </tr>
                </thead>
                <tbody className='overflow-y-hidden'>

                    {
                        items.map((item, index) => (
                            <tr
                                key={index}
                                className={`text-center relative transition-all duration-700 ease-in-out ${item.animate ? "opacity-0 -translate-x-20" : "opacity-100 translate-x-0"
                                    }`}>

                                <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-white">{index + 1}</td>
                                <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-white">{item.name}</td>
                                <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-white">{item.description}</td>
                                <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-white">{item.starttime}</td>
                                <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-white">{item.endtime}</td>
                                <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-white cursor-pointer"><span onClick={(e) => dlt(item._id, index)} className='hover:bg-green-600 hover:p-1 rounded-3xl hover:text-white duration-500 ease-in-out'>✕</span></td>
                                <td>
                                    {item.status == 0 ? <span className='md:bg-gray-600 text-[10px] md:text-[15px] font-bold text-yellow-500 p-[0.5px] md:p-1 rounded-2xl'>Pending</span> : item.status == 1 ? <span className='md:bg-gray-600 text-[10px] md:text-[15px] font-bold text-green-600 p-[0.5px] md:p-1 rounded-2xl'>Completed</span> : <span className='md:bg-gray-600 text-[10px] md:text-[15px] font-bold text-red-700 p-[0.5px] md:p-1 rounded-2xl'>Incomplete</span>}
                                    {/* <div>
                                        <form action="" onSubmit={(e) => status_handle(e, item._id)}>
                                            <div>
                                                <label htmlFor="">P</label>
                                                <input type="radio" name='radio' className="accent-amber-300 border-0" id="" value={0} checked={item.status == 0} disabled={item.status == 1 || item.status == 2} onChange={(e) => e.target.form.requestSubmit()} />
                                                <label htmlFor="">C</label>
                                                <input type="radio" name='radio' className="accent-green-400" id="" value={1} checked={item.status == 1} disabled={item.status == 2} onChange={(e) => e.target.form.requestSubmit()} />
                                                <label htmlFor="">IC</label>
                                                <input type="radio" name='radio' className='accent-red-500' id="" value={2} checked={item.status == 1 ? false : item.endtime <= new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })} disabled={item.status == 1}
                                                    onChange={(e) => e.target.form.requestSubmit()} />
                                            </div>
                                        </form>
                                    </div> */}
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>

            </table>
        </div>
    )
}
