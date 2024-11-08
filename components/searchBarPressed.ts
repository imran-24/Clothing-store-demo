import { create } from "zustand";

type searchBarPressed = {
    pressed: boolean,
    setPressed: () => void;
}
const useSearchBarPressed = create<searchBarPressed>((set) => ({
    pressed:false,
    setPressed: () => set((state) => {
        return{
            pressed: !state.pressed
        }
    })
}))

export   {useSearchBarPressed};