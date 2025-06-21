function processCSVData(headers, columns) {
    // Example: Convert headers to uppercase and trim whitespace from data
    const processedHeaders = headers.map(header => header.toUpperCase());
    const processedData = columns.map(row => {
        const processedRow = {};    
    for (const key in row) {
        processedRow[key.trim()] = row[key].trim();
        const keys = key.split('.'); 
        let current = processedRow;
        keys.forEach((k, index) => {
            if (index === keys.length - 1) {
                current[k] = row[key].trim();
            } else {
                current[k] = current[k] || {};
                current = current[k];
            }
        });
        if(keys.length > 1) {  
            delete processedRow[key.trim()];   
        }
    }   
    return processedRow;
});
return { processedHeaders, processedData };
}


function userJsonMapper(user) {
    return {
        id: user.id,
        name: user.name.firstName+user.name.lastName,
        age:user.age,
        gender:user.gender,
        address: user.address,  
        additional_info: user.additional_info,
      
    };
}


module.exports= {  
     userJsonMapper,
    processCSVData
}