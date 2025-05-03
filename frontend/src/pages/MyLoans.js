import React, {useEffect, useState} from 'react';
import Navbar from "../components/Navbar";
import LeftNavbar from "../components/leftNavbar";
import {useAuthContext} from "../context/useAuthContext";
import Carousel from "react-bootstrap/Carousel";
import useGetALoan from "../hooks/useGetALoan";
import usePayLoan from "../hooks/usePayLoan";

function MyLoans(props) {
    const [selectedLoan,setSelectedLoan] = useState({});
    const loanTypes = [
        {
            id:1,
            title: 'Personal Loan',
            data: {
                interestRate: 10,
                deadline: '10 years',
                amount: '1000-100000'
            }
        },
        {
            id:2,
            title: 'Auto Loan',
            data: {
                interestRate: 5,
                deadline: '7 years',
                amount: '5000-100000'
            }
        },
        {
            id:3,
            title: 'Mortgage Loan',
            data: {
                interestRate: 4,
                deadline: '30 years',
                amount: '100000–1000000'
            }
        },
        {
            id:4,
            title: 'Student Loan',
            data: {
                interestRate: 6,
                deadline: '25 years',
                amount: '5000-100000'
            }
        }
    ];


    const {authUser} = useAuthContext();

   const {getLoan,errorM} = useGetALoan();

    const handleSubmit =async (ev) => {
        ev.preventDefault();
        await getLoan(amount,selectedLoan);
        setAmount(0)
        setSelectedLoan(loanTypes[0])
    }

    useEffect(() => {
        setSelectedLoan(loanTypes[0])
    }, []);

    const [amount,setAmount] = useState(0);


    const getNextRepaymentDate = (loan) => {
        const [day, month, year] = loan.deadline.split(':').map(Number);

        const deadlineDate = new Date(year, month - 1, day);

        deadlineDate.setMonth(deadlineDate.getMonth() + 1);

        const nextDay = deadlineDate.getDate().toString().padStart(2, '0');
        const nextMonth = (deadlineDate.getMonth() + 1).toString().padStart(2, '0');
        const nextYear = deadlineDate.getFullYear();

        return `${nextDay}:${nextMonth}:${nextYear}`;
    }

    const {payLoan,error} = usePayLoan()

    const handlePay =async (loanId) => {
        await payLoan(loanId);
    }


    return (
        <div>
            <Navbar/>
            <div className={'cont'}>
                <LeftNavbar/>
                <div className={'right-bar'}>
                    <h1>My Loans</h1>
                    <div className={'top-bar tp-l mm '}>
                        {authUser.bankData.loans.length > 0 ?
                            <Carousel className={'cardK add addUp fery'}>
                                {authUser.bankData.loans.map((loan, index) => (
                                    <Carousel.Item key={index}>
                                        <section className={'cardX'}>
                                            <h4>{loan.loanType}</h4> {/* Correct field name loanType */}

                                            <div className={'loanInfo'}>
                                                <h2>Borrower: {loan.fullName}</h2>
                                                <h3>Amount: ${loan.money.toLocaleString()}</h3>
                                                <h3>Returned: ${loan.returnedMoney.toLocaleString()}</h3>
                                                <h3>Interest Rate: {loan.percentage}%</h3>
                                                <h3>Monthly Payment: ${loan.monthlyFee.toFixed(2)}</h3>
                                                <h3>Deadline: {loan.deadline}</h3>
                                            </div>

                                        </section>
                                        <section className={'cardY'}>
                                            <h2>Repayment of the loan</h2>
                                            <h4>Monthly Fee: ${loan.monthlyFee.toString().substr(0,5)}</h4>
                                            {error && <section className={'err'}>
                                                <p>{error}</p>
                                            </section>}
                                            <button onClick={() => handlePay(loan._id)} disabled={getNextRepaymentDate(loan) === (new Date())}>Pay loan</button>
                                        </section>
                                    </Carousel.Item>
                                ))}
                            </Carousel>

                            : <section className={'fd cardK'}>
                                <p>No Loans Yet</p>
                            </section>
                        }
                        {authUser.bankData.loans.length === 0?<section className={'cardK add addUp'}>
                            <h3>Get A Loan </h3>

                                <form onSubmit={handleSubmit}>
                                    <div className={'tr'}>
                                        <h4>Choose loan type:</h4>

                                    </div>
                                    <div className="loanTypes">
                                        {loanTypes.map((loan, index) => (
                                            <section className={selectedLoan.id === loan.id?'sel':''} key={index} onClick={() => setSelectedLoan(loan)}>
                                                <h4>{loan.title}</h4>
                                                <table>
                                                    <tr>
                                                        <td>%{loan.data.interestRate}</td>
                                                        <td>{loan.data.deadline}</td>
                                                        <td>${loan.data.amount}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Interest Rate</td>
                                                        <td>Deadline</td>
                                                        <td>Amount</td>
                                                    </tr>
                                                </table>
                                            </section>
                                        ))}
                                    </div>

                                        <input  type={'text'} value={amount}
                                               onChange={(ev) => setAmount(ev.target.value)}
                                               placeholder={'Loan Amount'}/>
                                    {errorM && <section className={'err'}>
                                        <p>{errorM}</p>
                                    </section>}

                                    <button type={'submit'}>Confirm</button>
                                </form>
                            </section> :
                        null}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyLoans;