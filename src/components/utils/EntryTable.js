import React, { useEffect, useState } from "react";
import Select from 'react-select';

const customStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: state.isFocused ? '0 0 0 0' : provided.boxShadow,
      borderColor: state.isFocused ? '#aaa' : provided.borderColor,
      '&:hover': {
        borderColor: state.isFocused ? '#aaa' : provided.borderColor,
      },
    }),
  };

export default function EntryTable({ entryData, handleEntryChange, budgetLineData }) {
    const [totaldebit, setTotalDebit] = useState(0);
    const [totalcredit, setTotalCredit] = useState(0);
    const [balanceError, setBalanceError] = useState(false);

    useEffect(() => {
        let debitTotal = 0;
        let creditTotal = 0;

        entryData.forEach((entry) => {
            const debitValue = parseFloat(entry.debit) || 0;
            const creditValue = parseFloat(entry.credit) || 0;

            debitTotal += debitValue;
            creditTotal += creditValue;
        });

        setTotalDebit(debitTotal);
        setTotalCredit(creditTotal);

        const balance = debitTotal - creditTotal;
        setBalanceError(balance !== 0);
    }, [entryData]);

    // console.log(budgetLineData);

    return (
        <>
            <table className="entry-table">
                <thead>
                    <tr>
                        <th width="10%">ACCOUNT CODE</th>
                        <th width="50%">ACCOUNT TITLE</th>
                        <th width="20%">DEBIT</th>
                        <th width="20%">CREDIT</th>
                    </tr>
                </thead>
                <tbody>
                    {entryData.map((entry, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    className="input-cell"
                                    value={entry.accountCode}
                                    readOnly
                                />
                            </td>
                            <td>
                                <Select
                                    className="input-cell"
                                    options={budgetLineData}
                                    value={budgetLineData.find((option) => option.value === entry.accountTitle)}
                                    onChange={(selectedOption) => {
                                        const regexValues = selectedOption.value.split("/");
                                        const firstRegexValue = regexValues[0];
                                        const remainingValues = regexValues.slice(1).join("/");

                                        handleEntryChange(index, "accountTitle", remainingValues);
                                        handleEntryChange(index, "accountCode", firstRegexValue);
                                    }
                                    }
                                    styles={customStyles}
                                />
                            </td>
                            <td>
                                <input
                                    className="input-cell"
                                    type="number"
                                    value={entry.debit}
                                    onChange={(e) => handleEntryChange(index, "debit", e.target.value)}
                                    disabled={entry.credit !== ''}
                                />
                            </td>
                            <td>
                                <input
                                    className="input-cell"
                                    type="number"
                                    value={entry.credit}
                                    onChange={(e) => handleEntryChange(index, "credit", e.target.value)}
                                    disabled={entry.debit !== ''}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {balanceError && <p className="balance-error">~</p>}

            <table className="total-entry-amount">
                <thead>
                    <tr>
                        <th width="60%">TOTAL</th>
                        <th width="20%">{totaldebit}</th>
                        <th width="20%">{totalcredit}</th>
                    </tr>
                </thead>
            </table>
        </>
    );
}
