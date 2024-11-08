import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList, Product } from '../types/navigation'; 



type AllProductProps = {
    productDetails: Product[],
    selectedCat: string
};

const ProductImageScrollView: React.FC<AllProductProps> = ({ productDetails, selectedCat }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [currentCat, setCurrentCat] = useState<string>('');

    const catMapper: { [key: string]: string } = {
        'Shirts': "men's clothing",
        'Pants': "jewelery"
    }
    useEffect(() => {
        setCurrentCat(catMapper[selectedCat] || '')
    }, [selectedCat]);

    const currentProds = currentCat ? productDetails.filter((product: Product) => (product.category === currentCat)) : productDetails;
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {currentProds.map((product: Product, index: number) => {
                return (
                   
                    
                        <View key={index} className="flex flex-col h-max mb-4   rounded-xl space-y-4 p-2  mt-5 mx-2" style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            shadowColor: '#7F00FF',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 5,
                        }} >
                            <TouchableOpacity activeOpacity={0.6}  onPress={() =>  { navigation.navigate('productDetails', product)}}>
                            <Image
                                source={{ uri: product.image }}
                                className="w-40 h-40   rounded-xl"
                                resizeMode="contain"
                            />
                          
                            <View className="flex  rounded-xl py-0    flex-col space-y-1">
                                <Text className="text-md w-40 h-max text-center font-bold text-black">{product.title}</Text>
                                <Text className="w-40 h-max text-md  font-extrabold text-center text-gray-700">{`$${product.price}`}</Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                    
                 
                )
            })}

        </ScrollView>
    );
};

export default ProductImageScrollView;
