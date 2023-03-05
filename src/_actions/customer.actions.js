import { useSetRecoilState, useResetRecoilState } from 'recoil';

import { useFetchWrapper } from '_helpers';
import { customersAtom, customerAtom } from '_state';

export { useCustomerActions };

function useCustomerActions() {
    const baseUrl = `${process.env.REACT_APP_API_URL}/customers`;
    const publishBaseUrl = `${process.env.REACT_APP_API_URL}/publish`;
    const fetchWrapper = useFetchWrapper();
    const setCustomers = useSetRecoilState(customersAtom);
    const setCustomer = useSetRecoilState(customerAtom);

    return {
        getAll,
        getById,
        create,
        update,
        publish,
        publishOnUpdate,
        delete: _delete,
        resetCustomers: useResetRecoilState(customersAtom),
        resetCustomer: useResetRecoilState(customerAtom)
    }

    function getAll() {
        return fetchWrapper.get(baseUrl).then(result => setCustomers(result.customers));
    }

    function getById(id) {
        return fetchWrapper.get(`${baseUrl}/${id}`).then(result => setCustomer(result.customer));
    }

    function create(customer) {
        return fetchWrapper.post(baseUrl, customer);
    }

    function update(id, params) {
        return fetchWrapper.put(`${baseUrl}/${id}`, params);
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function _delete(id) {
        setCustomers(customers => customers.map(x => {
            // add isDeleting prop to user being deleted
            if (x.id === id)
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/${id}`)
            .then(() => {
                // remove user from list after deleting
                setCustomers(customers => customers.filter(x => x.id !== id));
            });
    }

    function publish(customer) {
        setCustomers(customers => customers.map(x => {
            // add isDeleting prop to user being deleted
            if (x.id === customer.id)
                return { ...x, isBuilding: true };

            return x;
        }));

        return fetchWrapper.post(publishBaseUrl, customer).then(() => getAll());
    }

    function publishOnUpdate(customer) {
        return fetchWrapper.post(publishBaseUrl, customer);
    }
}
