import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { authAtom, customersAtom } from '_state';
import { useCustomerActions } from '_actions';
import moment from 'moment'

export { List };

function List({ match }) {
    const { path } = match;
    const customers = useRecoilValue(customersAtom);
    const customerActions = useCustomerActions();
    const auth = useRecoilValue(authAtom)

    useEffect(() => {
        customerActions.getAll();

        return customerActions.resetCustomers;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h1>Customers</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Customer</Link>
            <table className="table table-striped customer-table">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Domain Name</th>
                        {/* <th style={{ width: '30%' }}>Project Name</th> */}
                        {/* <th style={{ width: '30%' }}>Solution Name</th> */}
                        {/* <th style={{ width: '30%' }}>Publish Profile</th> */}
                        <th style={{ width: '15%' }}>Creator</th>
                        <th style={{ width: '25%' }}>CreatedAt</th>
                        <th style={{ width: '20%' }}>Download</th>
                        <th style={{ width: '20%' }}>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {customers?.map(customer =>
                        <tr key={customer.id}>
                            <td>{customer.domainName}</td>
                            {/* <td>{customer.projectName}</td> */}
                            {/* <td>{customer.solutionName}</td> */}
                            {/* <td>{customer.publishProfile}</td> */}
                            <td>{customer.creator?.username}</td>
                            <td>{moment(customer.createdAt).format("MM/DD/YYYY HH:mm")}</td>
                            <td>{customer.archiveName ? <a href={`${process.env.REACT_APP_API_URL}/publish/download/${customer.domainName}?accessToken=${auth?.accessToken}`} target="_blank" rel="noreferrer" download>{customer.archiveName}</a> : "Build project first"}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${customer.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => customerActions.delete(customer.id)} className="btn btn-sm btn-danger mr-1" style={{ width: '60px' }} disabled={customer.isDeleting}>
                                    {customer.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                                <button onClick={() => customerActions.publish(customer)} className="btn btn-sm btn-info" style={{ width: '52px' }} disabled={customers.some(item => item.isBuilding)}>
                                    {customer.isBuilding
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Build</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!customers &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}
