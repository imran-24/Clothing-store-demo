import { useCartStore } from "@/components/cartStore"
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const cartScreen:React.FC =() => {
    const{cart, removeFromCart, clearCart} = useCartStore();
    if(cart.length === 0){
        return <Text>Cart is empty currently</Text>
    }
    return(
        <ScrollView>
            {cart.map((item, index) =>(
                <View key={index} className="flex flex-col">
                    <Image  style={{ width: 100, height: 100 }} resizeMode="contain" source={{uri:item.image}}></Image>
                    <Text>{item.title}</Text>
                    <Text>{`$${item.price}`}</Text>
                    <Pressable onPress={() => removeFromCart(item.title)}>
                    <Text>Remove from cart</Text>
                    </Pressable>
                </View> 
            ))}

            <Pressable onPress={clearCart}>
                <Text >
                    Clear Cart
                </Text>
            </Pressable>
        </ScrollView>
    )
}

export default cartScreen;