const { memo } = require("react");

const HistoryTableIndicator = memo(({ data }) => {

  console.log("Render History Table");
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Target</th>
            <th>Actuals</th>
            <th>Percentage (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr className="row-theme-1" key={index}>
              <td>{item.targetReach}</td>
              <td>{item.actualReach}</td>
              <td>
                {((Number(item.actualReach) / Number(item.targetReach)) * 100).toFixed(2)} %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
});

export default HistoryTableIndicator;