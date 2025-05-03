import React, {useEffect, useState} from 'react';
import Navbar from "../components/Navbar";
import {useAuthContext} from "../context/useAuthContext";
import {FaArrowCircleLeft, FaArrowCircleRight, FaEye, FaRegUser} from "react-icons/fa";
import {IoIosAddCircle} from "react-icons/io";
import {FaEyeSlash} from "react-icons/fa6";
import LeftNavbar from "../components/leftNavbar";
import {GoArrowDownLeft, GoArrowUpRight} from "react-icons/go";
import ReactPaginate from "react-paginate";
import {TiPrinter} from "react-icons/ti";
import usePrint from "../hooks/usePrint";
import {RiDeleteBin5Line} from "react-icons/ri";
import useDeleteTransactions from "../hooks/useDeleteTransactions";

function Transactions(props) {
    const {authUser} = useAuthContext();

    const [show,setShow] = useState(false);

    const [transactions,setTransactions] = useState(authUser.bankData.transactions);

    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 5;
    const [currentPage,setCurrentPage] = useState(0);

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = transactions.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(transactions.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % transactions.length;
        setItemOffset(newOffset);
        setCurrentPage(event.selected);
    };
    const {print} = usePrint()

    const handlePrint = async () => {
        await print();
    }

    const [selectedTransactions,setSelectedTransactions] = useState([]);

    useEffect(() => {
        console.log(selectedTransactions)
    },[selectedTransactions])

    const {deleteTransactions} = useDeleteTransactions();

    const handleDelete =async () => {
        await deleteTransactions(selectedTransactions)
        setSelectedTransactions([])
    }

    useEffect(() => {
        setTransactions(authUser.bankData.transactions)
    }, [authUser]);



    return (
        <div>
            <Navbar/>
            <div className={'cont'}>
                <LeftNavbar/>
                <div className={'right-bar'}>
                    <h1>Transactions</h1>

                    <div className={'bottom-bar  all-bar b2'}>
                        <button onClick={handlePrint} className={'print'}>Print <TiPrinter/></button>

                        <h3>Transaction history</h3>
                        <table>
                            <tbody className={'transactions'}>

                            <tr className={'transaction'}>
                                <td className={'plusL'}>
                                    <input
                                        type="checkbox"
                                        checked={selectedTransactions.length === transactions.length}
                                        onChange={(ev) => {
                                            if (ev.target.checked) {
                                                const allIds = transactions.map((transaction) => transaction._id);
                                                setSelectedTransactions(allIds);
                                            } else {
                                                setSelectedTransactions([]);
                                            }
                                        }}
                                    />
                                    <h5>All</h5>

                                </td>
                                <td className={'plusL'}>
                                    <span>
                                        <GoArrowDownLeft/>
                                    |
                                    <GoArrowUpRight/>
                                    </span>
                                </td>
                                <td className={'sender'}>
                                    <span>Receiver</span>
                                </td>
                                <td className={'sender'}>
                                    <span>Date</span>
                                </td>
                                <td className={'sender'}>
                                    <span>Amount</span>
                                </td>
                                <td className={'sender'}>
                                        <span>Status</span>
                                    </td>
                                    <td className={'sender'}>
                                        <span>Sender</span>
                                    </td>
                            </tr>

                            {transactions.length === 0 ? <h2  className={'fee'}>No Transactions yet</h2> :
                                currentItems.map((transaction, index) => (
                                    <tr className={'transaction'} key={index}>
                                        <section className={'fr'}>
                                            <input type={'checkbox'}
                                                   checked={selectedTransactions.includes(transaction._id)}
                                                   value={transaction._id}
                                                   onChange={(ev) => {
                                                       if (ev.target.checked){
                                                           setSelectedTransactions((prev) => [...prev,transaction._id])
                                                       }else {
                                                           setSelectedTransactions((prev) => prev.filter(id => id !== transaction._id));
                                                       }
                                                   }}
                                            />
                                        </section>
                                        {!transaction.isAdded ? <section className={'minusT'}>
                                            <GoArrowDownLeft/>
                                        </section> : <section className={'plusT'}>
                                            <GoArrowUpRight/>
                                        </section>
                                        }
                                        <td className={'sender'}>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'start',
                                                justifyContent: 'center'
                                            }}>
                                                <h2>{transaction.receiver.fname + " " + transaction.receiver.lname}</h2>
                                                <h4>@{transaction.receiver.username}</h4>
                                            </div>
                                        </td>
                                        <td className={'sender'}>
                                            <p>{transaction.date}</p>
                                        </td>
                                        <td className={'sender'}>
                                            <h2 id={'amount'}>$ {transaction.amount}</h2>
                                        </td>
                                        <td className={`sender ${transaction.status === 'completed' ? 'comp' : 'failed'}`}>
                                            <h5>{transaction.status}</h5>
                                        </td>

                                        <td className={'sender'} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'start',
                                            justifyContent: 'center'
                                        }}>
                                            <h2>{transaction.sender.fname + " " + transaction.sender.lname}</h2>
                                            <h4>@{transaction.sender.username}</h4>
                                        </td>

                                    </tr>
                                ))
                            }
                            </tbody>


                        </table>
                        <div className={'lie'}>
                            {selectedTransactions.length > 0 && <div className={'del'} onClick={handleDelete}>
                                <RiDeleteBin5Line/>
                                <h4>Delete: {selectedTransactions.length === transactions.length ? 'All' : selectedTransactions.length }</h4>
                            </div>}
                            {currentItems.length === 0 ? <p>0/0</p> :
                                <p>{currentPage + 1}/{pageCount}</p>}
                            <ReactPaginate
                                nextLabel={<FaArrowCircleRight/>}
                                previousLabel={<FaArrowCircleLeft/>}
                                className={'rig'}
                                pageRangeDisplayed={2}
                                pageCount={pageCount}
                                onPageChange={handlePageClick}/>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Transactions;