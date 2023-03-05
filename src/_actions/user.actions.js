import { useRecoilState, useResetRecoilState } from 'recoil';

import { history, useFetchWrapper } from '_helpers';
import { authAtom, userAtom, usersAtom } from '_state';

export { useUserActions };

function useUserActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/auth`;
    const fetchWrapper = useFetchWrapper();
    const [auth, setAuth] = useRecoilState(authAtom);

    return {
        login,
        logout,
        register,
        resetUsers: useResetRecoilState(usersAtom),
        resetUser: useResetRecoilState(userAtom)
    }

    function login({ username, password }) {
        return fetchWrapper.post(`${baseUrl}/login`, { username, password })
            .then(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                setAuth(user);

                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/' } };
                history.push(from);
            });
    }

    function logout() {
        // remove user from local storage, set auth state to null and redirect to login page
        localStorage.removeItem('user');
        setAuth(null);
        history.push('/account/login');
    }

    function register(user) {
        return fetchWrapper.post(`${baseUrl}/register`, user);
    }
}
