import React from 'react'

const CreateAvgData = (resJson) => {
    const groupedData = resJson.reduce((acc, entry) => {
        const yearMonthKey = `${entry.year}-${entry.month}`;
        if (!acc[yearMonthKey]) {
          acc[yearMonthKey] = { sum: 0, count: 0 };
        }
        acc[yearMonthKey].sum += entry.median_sale_price;
        acc[yearMonthKey].count += 1;
        console.log('acc', acc)
        return acc;

      }, {});
     
      const averagedData = Object.keys(groupedData).map((yearMonthKey) => {
        const [year, month] = yearMonthKey.split('-');
        return {
          year: parseInt(year),
          month: parseInt(month),
          avg_median_sale_price: groupedData[yearMonthKey].sum / groupedData[yearMonthKey].count,
        };
      });
      console.log('averagedData', averagedData)
      return averagedData;
}

export default CreateAvgData