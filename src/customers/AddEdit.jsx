import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRecoilValue } from 'recoil';

import { customerAtom } from '_state';
import { useCustomerActions, useAlertActions } from '_actions';

export { AddEdit };

function AddEdit({ history, match }) {
    const { id } = match.params;
    const mode = { add: !id, edit: !!id };
    const customerActions = useCustomerActions();
    const alertActions = useAlertActions();
    const customer = useRecoilValue(customerAtom);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        domainName: Yup.string()
            .required('Domain Name is required'),
        projectName: Yup.string()
            .required('Project Name is required'),
        solutionName: Yup.string()
            .required('Solution Name is required'),
        publishProfile: Yup.string()
            .required('Publish Profile is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        // fetch user details into recoil state in edit mode
        if (mode.edit) {
            customerActions.getById(id);
        }

        return customerActions.resetCustomer;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // set default form values after user set in recoil state (in edit mode)
        // if (mode.edit && customer) {
        //     reset(customer);
        // }
        reset(customer)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer])

    function onSubmit(data) {
        return mode.add
            ? createCustomer(data)
            : updateCustomer(customer.id, data);
    }

    async function createCustomer(data) {
        try {
            await customerActions.create(data)
            history.push('/customers');
            alertActions.success('Customer added');
        } catch (error) {
            alertActions.error('Customer creation failed');
        }
    }

    async function updateCustomer(id, data) {
        try {
            await customerActions.update(id, data);

            if (customer.archiveName) {
                if (customer.domainName !== data.domainName || customer.projectName !== data.projectName || customer.solutionName !== data.solutionName || customer.publishProfile !== data.publishProfile) {
                    await customerActions.publishOnUpdate(data)
                }
            }

            history.push('/customers');
            alertActions.success('Customer updated');
        } catch (error) {
            alertActions.error('Customer update failed');
        }
    }

    const loading = mode.edit && !customer;
    return (
        <>
            <h1>{mode.add ? 'Add Customer' : 'Edit Customer'}</h1>
            {!loading &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-row">
                        <div className="form-group col">
                            <label>Domain Name</label>
                            <input name="domainName" type="text" {...register('domainName')} className={`form-control ${errors.domainName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.domainName?.message}</div>
                        </div>
                        <div className="form-group col">
                            <label>Project Name</label>
                            <input name="projectName" type="text" {...register('projectName')} className={`form-control ${errors.projectName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.projectName?.message}</div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col">
                            <label>Solution Name</label>
                            <input name="solutionName" type="text" {...register('solutionName')} className={`form-control ${errors.solutionName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.solutionName?.message}</div>
                        </div>
                        <div className="form-group col">
                            <label>Publish Profile</label>
                            <input name="publishProfile" type="text" {...register('publishProfile')} className={`form-control ${errors.publishProfile ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.publishProfile?.message}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Save
                        </button>
                        <button onClick={() => reset(customer)} type="button" disabled={isSubmitting} className="btn btn-secondary">Reset</button>
                        <Link to="/customers" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            }
            {loading &&
                <div className="text-center p-3">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
        </>
    );
}
