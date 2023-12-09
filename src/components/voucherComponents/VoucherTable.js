import { useEffect, useState } from "react";
import { Document, Image, PDFViewer, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import logo from '../../assets/images/logo.png';
import Axios from "axios";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: '0pt 20pt 20pt 20pt'
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
  mainHeader: {
    flexDirection: 'row',
    margin: 0
  },
  upperRightLogo: {
    flexDirection: 'column',
    marginLeft: 'auto',
    marginTop: 30
  },
  mainLogo: {
    width: 150,
    height: 'auto'
  },
  titleHeader1: {
    fontSize: 16,
    fontWeight: 'bolder'
  },
  mainDetails: {
    flexDirection: 'column',
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
  },
  columnLeft: {
    flexDirection: 'column',
    width: '50%',
    paddingRight: 10
  },
  columnRight: {
    flexDirection: 'column',
    width: '50%',
    paddingLeft: 10
  },
  spaceBetTextBox: {
    flexDirection: 'row',
    padding: '8px 0 8px 0'
  },
  textbox: {
    border: '1px solid #2b2a2a',
    fontSize: 12,
    color: '#2b2a2a',
    padding: '5px 10px',
    width: '250'
  },
  label: {
    fontSize: 12,
    width: '70'
  },
  payee: {
    lineHeight: 2.5
  },
  tableContainer: {
    border: '1px solid #000'
  },
  table: {
    display: 'table',
    width: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000'
  },
  tableCellHeader: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000'
  },
  tableCell: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRightWidth: 1,
    borderRightColor: '#000'
  },
  total: {
    position: 'absolute',
    top: '55%',
    padding: '20pt'
  },
  totalrow: {
    border: '1px solid #000',
    flexDirection: 'row',
    fontSize: 12,
    textAlign: 'center',
  },
  totalcell: {
    padding: '5px 10px',
    borderRight: '1px solid #000'
  },
  header2: {
    fontSize: 12,
    padding: '2px 10px',
    textAlign: 'center',
    backgroundColor: '#000',
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    fontSize: 10,
  },
});

function VoucherTable() {
  const [voucherData, setData] = useState([]);
  const [creditDebitData, setCreditDebitData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [totaldebit, setTotaldebit] = useState(0);
  const [totalcredit, setTotalcredit] = useState(0);

  useEffect(() => {
    fetchvoucher();
  }, []);

  const fetchvoucher = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/voucherrecord');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const handleselectedrow = (data) => {
    // console.log(data);
    // setSelectedRow(data);
    Axios.get(`http://localhost:3001/api/debitCredit/${data.id}`)
      .then(response => {
        console.log(response.data);
        let totalDebit = 0;
        response.data.forEach(entry => {
          if (entry.type === 'Debit' && entry.amount > 0) {
            totalDebit += parseInt(entry.amount);
          }
        });
        let totalCredit = 0;
        response.data.forEach(entry => {
          if (entry.type === 'Credit' && entry.amount > 0) {
            totalCredit += parseInt(entry.amount);
          }
        });
        setTotaldebit(totalDebit);
        setTotalcredit(totalCredit);
        setSelectedRow(data);
        setCreditDebitData(response.data);
      })
      .catch(error => {
        console.log('Error fetching project details:', error);
      });
  }

  return (
    <>
      <div className="card-table">
        <table>
          <thead>
            <tr>
              <th>Voucher Number</th>
              <th>Date</th>
              <th>Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {voucherData.map((voucher) => (
              <tr className='row-theme-1' key={voucher.id}>
                <td>{voucher.voucherNumber}</td>
                <td>
                  {(() => {
                    const dateTimeString = '7/6/2023, 7:54:00 PM';
                    const dateTime = new Date(dateTimeString);
                    const formattedDate = dateTime.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    return formattedDate;
                  })()}
                </td>
                <td>{voucher.details}</td>
                <td><button onClick={() => handleselectedrow(voucher)}>View as PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRow && (
        <PDFViewer style={{ width: '100%', height: '1000px' }}>
          <Document>
            <Page size="A4" style={styles.page}>

              <View style={styles.mainHeader}>
                <Image style={styles.mainLogo} src={logo}></Image>
                <View style={styles.upperRightLogo}>
                  <Text style={styles.titleHeader1}>CHECK VOUCHER</Text>
                  <Text style={styles.text}>No. {selectedRow.voucherNumber}</Text>
                </View>
              </View>

              <View style={styles.mainDetails}>

                <View style={styles.row}>
                  <View style={styles.columnLeft}>
                    <View style={styles.spaceBetTextBox}>
                      <Text style={styles.label}>DATE</Text>
                      <Text style={styles.textbox}>
                        {new Date(selectedRow.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                    <View style={styles.spaceBetTextBox}>
                      <Text style={styles.label}>PAYEE</Text>
                      <Text style={[styles.textbox, styles.payee]}>{selectedRow.payee}</Text>
                    </View>
                  </View>
                  <View style={styles.columnRight}>
                    <View style={styles.spaceBetTextBox}>
                      <Text style={styles.label}>CHECK DATE</Text>
                      <Text style={styles.textbox}></Text>
                    </View>
                    <View style={styles.spaceBetTextBox}>
                      <Text style={styles.label}>CHECK NUMBER</Text>
                      <Text style={styles.textbox}></Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: 12, width: 70 }}>DETAILS</Text>
                  <Text style={{
                    border: '1px solid #2b2a2a',
                    fontSize: 12,
                    color: '#2b2a2a',
                    padding: '5px 10px',
                    width: 600,
                    lineHeight: 2.5
                  }}>{selectedRow.details}</Text>
                </View>

              </View>

              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCellHeader, { width: '140' }]}>ACCOUNT CODE</Text>
                  <Text style={[styles.tableCellHeader, { width: '500' }]}>ACCOUNT TITLE</Text>
                  <Text style={[styles.tableCellHeader, { width: '140' }]}>DEBIT</Text>
                  <Text style={[styles.tableCellHeader, { width: '140', borderRightWidth: 0 }]}>CREDIT</Text>
                </View>

                {creditDebitData.map((data) => (
                  <View style={styles.tableRow} key={data.id} >
                    <Text style={[styles.tableCell, { width: '140' }]}>{data.accountcode}</Text>
                    <Text style={[styles.tableCell, { width: '500' }]}>{data.accounttitle}</Text>
                    {data.type === "Debit" ?
                      <>
                        <Text style={[styles.tableCell, { width: '140', textAlign: 'center' }]}>{data.amount}</Text>
                        <Text style={[styles.tableCell, { width: '140', borderRightWidth: 0, textAlign: 'center' }]}></Text>
                      </>
                      :
                      <>
                        <Text style={[styles.tableCell, { width: '140', textAlign: 'center' }]}></Text>
                        <Text style={[styles.tableCell, { width: '140', borderRightWidth: 0, textAlign: 'center' }]}>{data.amount}</Text>
                      </>
                    }
                  </View>
                ))}
              </View>

              <View style={[styles.total]}>
                <View style={styles.totalrow}>
                  <Text style={[styles.totalcell, { width: '385', backgroundColor: '#000', color: '#fff' }]}>TOTAL</Text>
                  <Text style={[styles.totalcell, { width: '80' }]}>{totaldebit}</Text>
                  <Text style={[styles.totalcell, { width: '80', borderRightWidth: 0 }]}>{totalcredit}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <View style={{ width: '105', marginRight: 8 }}>
                    <Text style={[styles.header2]}>PREPARED</Text>
                    <View style={{ flexDirection: 'column', border: '1px solid #000', marginTop: '6px' }}>
                      <Text style={{ height: '70px' }}></Text>
                      <Text style={{ borderTop: '1px solid #000', height: '20px' }}></Text>
                    </View>
                  </View>
                  <View style={{ width: '105', marginRight: 8 }}>
                    <Text style={[styles.header2]}>CHECKED</Text>
                    <View style={{ flexDirection: 'column', border: '1px solid #000', marginTop: '6px' }}>
                      <Text style={{ height: '70px' }}></Text>
                      <Text style={{ borderTop: '1px solid #000', height: '20px' }}></Text>
                    </View>
                  </View>
                  <View style={{ width: '105', marginRight: 8 }}>
                    <Text style={[styles.header2]}>APPROVED</Text>
                    <View style={{ flexDirection: 'column', border: '1px solid #000', marginTop: '6px' }}>
                      <Text style={{ height: '70px' }}></Text>
                      <Text style={{ borderTop: '1px solid #000', height: '20px' }}></Text>
                    </View>
                  </View>
                  <View style={{ width: '215', marginRight: 8 }}>
                    <Text style={[styles.header2]}>for transaction exceeding 50,000.00</Text>
                    <View style={{ flexDirection: 'column', border: '1px solid #000', marginTop: '6px' }}>
                      <Text style={{ height: '70px' }}></Text>
                      <Text style={{ borderTop: '1px solid #000', height: '20px' }}></Text>
                    </View>
                  </View>
                </View>
                <Text style={{ marginLeft: 20, width: '100%', textAlign: 'center', fontSize: 14, marginTop: 20 }}>PAYMENT RECEIVED</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'column', border: '1px solid #000', marginTop: '6px', marginRight: '5px', width: 170 }}>
                    <Text style={{ height: '70px' }}></Text>
                    <Text style={{ borderTop: '1px solid #000', height: '20px', fontSize: '12px', textAlign: 'center', padding: '3px' }}>Company/Organization</Text>
                  </View>
                  <View style={{ flexDirection: 'column', border: '1px solid #000', marginTop: '6px', marginRight: '5px', width: 170 }}>
                    <Text style={{ height: '70px' }}></Text>
                    <Text style={{ borderTop: '1px solid #000', height: '20px', fontSize: '12px', textAlign: 'center', padding: '3px' }}>Authorized Representative</Text>
                  </View>
                  <View style={{ flexDirection: 'column', border: '1px solid #000', marginTop: '6px', width: 170 }}>
                    <Text style={{ height: '70px' }}></Text>
                    <Text style={{ borderTop: '1px solid #000', height: '20px', fontSize: '12px', textAlign: 'center', padding: '3px' }}>Receipt Number</Text>
                  </View>
                </View>
                <Text style={{ marginLeft: 20, width: '100%', textAlign: 'center', fontSize: 14, marginTop: 20, fontWeight: 'bold' }}>Negrosanon Young Leaders Institute Inc</Text>
              </View>

            </Page>
          </Document>
        </PDFViewer>
      )}
    </>
  )
}

export default VoucherTable