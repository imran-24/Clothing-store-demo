import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Product, RootStackParamList } from "@/types/navigation"
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native"



const searchResults: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute();
    const filteredArray = route.params as Product[];
    return(
        <ScrollView>
            {(filteredArray.length === 0) &&
            (<View className="self-center align-middle  my-auto  p-2"><Text className="align-middle mt-60 text-lg text-center  font-bold mx-auto justify-center">No Results found</Text></View>) 
            }
            {filteredArray.map((product:Product,index:number) => {
                return(
                    <View key={index} className="flex flex-col h-max mb-4 self-center w-3/4  rounded-xl space-y-4 p-2  mt-5 mx-2" style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        shadowColor: '#7F00FF',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 5,
                    }} >
                      <TouchableOpacity  onPress={() => navigation.navigate('productDetails', product)}>
                        <Image
                            source={{ uri: product.image }}
                            className="w-40 h-40 self-center   rounded-xl"
                            resizeMode="contain"
                        />
                        <View className="flex  rounded-xl py-0 self-center    flex-col space-y-1">
                            <Text className="text-md w-40 h-max text-center font-bold text-black">{product.title}</Text>
                            <Text className="w-40 h-max text-md  font-extrabold text-center text-gray-700">{`$${product.price}`}</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                )
            } )}
        </ScrollView>
    )
}

export default searchResults;