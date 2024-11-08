export type Product = {
    image: string;
    title: string;
    price: string;
    description: string;
    category: string;
};

export type RootStackParamList = {
    "(tabs)": undefined;           
    productDetails: Product;
    cartScreen:undefined;      
    searchResults: Product[]
    "+not-found": undefined;      
};