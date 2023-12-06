import React from 'react'

const CreateAvgData = (resJson, category) => {
    try {
       
        const groupedData = resJson.reduce((acc, entry) => {
            const yearMonthKey = `${entry.year}-${entry.month}`;
            if (!acc[yearMonthKey]) {
              acc[yearMonthKey] = { sum: 0, count: 0 };
            }
    
            if (category === 'Avg Home Price')  {
                acc[yearMonthKey].sum += entry.median_sale_price;
                acc[yearMonthKey].count += 1;
            } else if (category === 'Avg Rent Price') {
                acc[yearMonthKey].sum += entry.rental_price;
                acc[yearMonthKey].count += 1;
            }
            return acc;
    
          }, {});
         
          const averagedData = Object.keys(groupedData).map((yearMonthKey) => {
            const [year, month] = yearMonthKey.split('-');
    
    
            if (category === 'Avg Home Price')  {
                return {
                    year: parseInt(year),
                    month: parseInt(month),
                    avg_median_sale_price: groupedData[yearMonthKey].sum / groupedData[yearMonthKey].count,
                  };
            } else if (category === 'Avg Rent Price') {
                return {
                    year: parseInt(year),
                    month: parseInt(month),
                    avg_rental_price: groupedData[yearMonthKey].sum / groupedData[yearMonthKey].count,
                  };
            }
          });
          
       

        // Check if averagedData is undefined or has unexpected value
        if (!averagedData) {
            console.error('CreateAvgData returned undefined or unexpected value.');
            return [];
        }

        return averagedData;
    } catch (error) {
        console.error('Error creating average data:', error);
        return [];
    }
    
}


export default CreateAvgData