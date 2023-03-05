import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { authAtom } from '_state';
import { useUserActions } from '_actions';

export { Nav };

function Nav() {
    const auth = useRecoilValue(authAtom);
    const userActions = useUserActions();

    // only show nav when logged in
    if (!auth) return null;

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                <NavLink to="/customers" className="nav-item nav-link">Customers</NavLink>
                <a onClick={userActions.logout} className="nav-item nav-link">Logout</a>
            </div>
        </nav>
    );
}
