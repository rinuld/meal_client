import { useState } from "react";
import VoucherTable from "./VoucherTable";
import CreateVoucherForm from "./CreateVoucherForm";

function VoucherMenu() {
    const [activeTab, setActiveTab] = useState('payment');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="card-menu my-0 voucher-menu">
                <ul>
                    <li className={`tab-header ${activeTab === 'payment' ? 'active-menu' : ''}`} onClick={() => handleTabClick('payment')}>
                        <div className="menu-item">
                            <i className="fas fa-money-bill-wave"></i>&nbsp;
                            <span>Payments</span>
                        </div>
                    </li>
                    <li className={`tab-header ${activeTab === 'records' ? 'active-menu' : ''}`} onClick={() => handleTabClick('records')}>
                        <div className="menu-item">
                            <i className="fas fa-list"></i>&nbsp;
                            <span>Records</span>
                        </div>
                    </li>
                </ul>
            </div>



            <div className="contents">
                <div
                    className={`${activeTab === 'payment' ? 'display-content' : 'tab-content '}`}
                    id="contentpayment"
                >
                    <div id="sub-details">
                        <CreateVoucherForm />
                    </div>
                </div>

                <div
                    className={`${activeTab === 'records' ? 'display-content' : 'tab-content '}`}
                    id="contentrecords"
                >
                    <div id="sub-details">
                        <VoucherTable />
                    </div>
                </div>
            </div>
        </>
    )
}

export default VoucherMenu;