import { create } from 'zustand';
import {Product} from '../types/navigation';


type CartItem = Product & {quantity: number};
type CartStore = {
    cart:CartItem[];
    addToCart: (product: Product) => void,
    removeFromCart:(productId: string) => void,
    clearCart:() => void
}
export const useCartStore = create<CartStore>((set) => ({
    cart:[],
    

    addToCart:(product) => set((state) => {
        const existingItem = state.cart.find((item) => item.title === product.title);
        if(existingItem){
            return{
                cart:state.cart.map((item) => item.title === product.title ? {...item, quantity:item.quantity + 1}:item)
            }
        }
        return{
            cart:[...state.cart, {...product, quantity:1}]
        };
    }),

    removeFromCart:(productId) => set((state) => {
        return({
        cart: state.cart.filter((item) => item.title !== productId)
    })}),
    clearCart: () => set({cart:[]})
}))