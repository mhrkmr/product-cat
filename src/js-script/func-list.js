export async function searchProduct(value) {
    var prod_list_srn = await match(value);
    console.log(prod_list_srn);
    return prod_list_srn;
}

async function match(value) {
    var prodjson;

    const data = await fetchJSONData("/src/products/products.json");
    if (data) {
        // console.log("Data fetched successfully:", data);
        prodjson=data;
    } else {
        console.error("Failed to fetch data.");
    }
    const result = [];

    // Convert value to string for comparison
    const searchValue = String(value).toLowerCase();

    // Iterate through each product
    // console.log(prodjson);
    prodjson.forEach(product => {
        const srnMatches = product.SRN.toString().includes(searchValue);
        const nameMatches = product["product-name"].toLowerCase().includes(searchValue);
        
        // If either matches, dd to result list
        if (srnMatches || nameMatches) {
            result.push(product);
        }
    });

    return result;
}

export async function fetchJSONData(str) {
    try {
        const response = await fetch(str);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Unable to fetch data:", error);
        return []; // Return null or handle as needed
    }
}