import { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'
import { Product, RootStackParamList } from "@/types/navigation";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSearchBarPressed } from "./searchBarPressed";

const SearchBar:React.FC = () => {
    const[allProducts, setAllProducts] = useState<Product[]>([]);
    const searchPressed = useSearchBarPressed();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        fetch('https://fakestoreapi.com/products?limit=10')
        .then(result => result.json())
        .then(data => {
            const newProducts: Product[] = data.map((product:Product) => {
                return(  {
                    image: product.image,
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    category: product.category
                    }
                )
            })
            setAllProducts(newProducts);
        })
    },[]);

    const[searchItem, setSearchItem] = useState('');
    const handleSearch = (input:string) => {
        setSearchItem(input);
    }
   const pressSearch = () => {
    searchPressed.setPressed();
   }
    const filteredArray: Product[] = allProducts.filter((prod: Product) => prod.title.toLowerCase().includes(searchItem.toLowerCase()) );
    return(
        <View onTouchEnd={pressSearch} className="border-b-4 flex  border-[#7F00FF] flex-row absolute p-4   z-50 justify-between top-[30vh] self-center rounded-xl   bg-white w-[95vw]">
            <TextInput value={searchItem} onChangeText={handleSearch}  className="font-bold w-max text-lg text-black" placeholder="Search any item"/>
            <Pressable onPress={() => navigation.navigate('searchResults', filteredArray)}><Icon name="search" color='#7F00FF'  size={25}/></Pressable>
        </View>
    )
}
export default SearchBar;