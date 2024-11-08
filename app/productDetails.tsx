import { useRoute } from "@react-navigation/native"
import { Image, Pressable, ProcessedColorValue, ScrollView, Text, View } from "react-native"
import { RootStackParamList, Product } from '../types/navigation';
import { Collapsible } from "@/components/Collapsible";
import { useCartStore } from "@/components/cartStore";



const productDetails:React.FC = () => {
    const route = useRoute();
    const {image, title, price, description,category} = route.params as Product;
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAdd = () => {
        addToCart({image,title,price,description,category});
    }
    return(
        <>
    <ScrollView contentContainerStyle={{paddingBottom:100}}>
        <View className="container flex flex-col w-[100vw] h-[100vh] ">
            <View className="w-1/2 h-1/2 self-center  " style={{elevation:5, backgroundColor:'white', shadowOpacity:0.4, shadowOffset:{width:0.4, height:5},shadowColor: '#7F00FF'}}>
            <Image source={{uri:image}} resizeMode="contain" style={{width:'100%', height:'100%'}}/>
            </View>
            <View className="flex flex-col border-t-2 border-purple-500  space-y-2 p-3">
            <Text className="text-3xl  font-extrabold  ">{title}</Text>
            <Text className="text-xl text-[#5f02a7] font-semibold">{`$${price}`}</Text>
            </View>
            <View className="mt-5 p-3 w-11/12  self-center   border-2 rounded-xl border-[#5f02a7]">
            <Collapsible  title="Description" >
            <Text className="text-lg font-normal">{description}</Text>
            </Collapsible>
            </View>
            
     
        </View>
        
        
    </ScrollView>
    <Pressable onPress={handleAdd} className="bg-[#5f02a7]  p-3">
    <Text className="text-xl text-center font-bold text-white">Add to Cart</Text>
    </Pressable>
   </>
    )
    
}

export default productDetails;