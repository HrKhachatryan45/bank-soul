import React from 'react';
import {FaHome} from "react-icons/fa";
import {MdAccountBalanceWallet} from "react-icons/md";
import {GrTransaction} from "react-icons/gr";
import {LuWalletCards} from "react-icons/lu";
import {RiMoneyDollarCircleFill} from "react-icons/ri";
import {IoMdSettings} from "react-icons/io";
import {useLocation} from "react-router-dom";

function LeftNavbar(props) {
    const location = useLocation();
    const endPoint = location.pathname;
    return (
        <div className={'left-bar'}>
            <ul>
                <li className={endPoint === '/dashboard' ? 'active' : ''}>
                    <a href={'/dashboard'}><FaHome/>Dashboard</a>
                </li>
                <li className={endPoint === '/balance' ? 'active' : ''}>
                    <a href={'/balance'}><MdAccountBalanceWallet/>Balance</a>
                </li>
                <li className={endPoint === '/transactions' ? 'active' : ''}>
                    <a href={'/transactions'}><GrTransaction/>Transactions</a>
                </li>
                <li className={endPoint === '/myCards' ? 'active' : ''}>
                    <a href={'/myCards'}><LuWalletCards/>Cards</a>
                </li>
                <li className={endPoint === '/myLoans' ? 'active' : ''}>
                    <a href={'/myLoans'}><RiMoneyDollarCircleFill/>Loans</a>
                </li>
            </ul>
        </div>
    );
}

export default LeftNavbar;