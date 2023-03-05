import { atom } from 'recoil';

const customersAtom = atom({
    key: 'customers',
    default: null
});

const customerAtom = atom({
    key: 'customer',
    default: {
        projectName: 'luxopp-app',
        solutionName: 'MVC5License.sln',
        publishProfile: 'MVC5License-Publish-Profile.pubxml'
    }
});

export {
    customersAtom,
    customerAtom
};