import { createContext, useEffect, useReducer } from "react";
import axios from "axios";


export const AuthContext = createContext();

const initialvalue = {
    user: null
};
const reducer = (state, action) => {
    switch (action.type) {
        case "Login": {
            return {
                ...state, user: action.payload
            }
        }
        case "Logout": {
            return {
                ...state, user: null
            }
        }
        default: return state
    }
}
const Auth = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialvalue);

    useEffect(() => {
        async function getCurrentUser() {
            let token = JSON.parse(localStorage.getItem('token'))
            if (token) {
                try {
                    let response = await axios.post('http://localhost:5000/currentUser', { token })
                    if (response?.data?.success) {
                        dispatch({
                            type: "Login",
                            payload: response?.data?.user
                        })

                    }
                } catch (error) {
                    console.log(error.message)
                }
            }

        }
        getCurrentUser();
    }, [])

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}
export default Auth