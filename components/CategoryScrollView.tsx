import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ProductImageScrollView from "./ProductImageScrollView";

type CategoryScrollViewProps={
    onCategorySelect: (Category: string) => void;
}

export default function CategoryScrollView({onCategorySelect}: CategoryScrollViewProps){
    const[clickedIndex, setClickedIndex] = useState(0);

    const handleClicked = (category:string,index:number) => {
        setClickedIndex(index);
        onCategorySelect(category);
    }

   
    const categories = ['All', 'Shirts', 'Pants','Tees','Jackets','Robes'];

    return(
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((el, index) => {
                const isSelected = (clickedIndex === index);
                return(
                <View onTouchEnd={() => handleClicked(el, index)} key={index} className={`mx-1 mt-5   p-3 ml-2 rounded-xl   ${isSelected ? 'bg-[#7F00FF] ' : 'bg-white border-2 border-gray-300 '}`}>
                    <Text className={`font-extrabold text-md ${isSelected ? 'text-white' : 'text-black'}`}>{el}
                        </Text>
                        </View>    
                )
            })}
        </ScrollView>
    )
}