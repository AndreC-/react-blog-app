import { createSlice } from "@reduxjs/toolkit";
import { Models } from "appwrite";

interface state {
    status: boolean,
    userData: Models.User<Models.Preferences> | null
}

const initialState: state = {
    status: false,
    userData: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData
        },
        logout: (state) => {
            state.status = false;
            state.userData = null
        }
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer