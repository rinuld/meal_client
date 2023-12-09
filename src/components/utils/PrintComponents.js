import React, { useRef } from 'react';

function PrintComponent({ content }) {
  const printContent = useRef();

  const handlePrint = () => {
    const contentToPrint = printContent.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
        </head>
        <body>
          ${contentToPrint}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };

  return (
    <div>
      <button onClick={handlePrint}>Print</button>
      <div style={{ display: 'none' }}>
        <div ref={printContent}>{content}</div>
      </div>
    </div>
  );
}

export default PrintComponent;
