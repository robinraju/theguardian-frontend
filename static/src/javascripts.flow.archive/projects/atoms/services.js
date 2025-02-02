/**
 * DO NOT EDIT THIS FILE
 *
 * It is not used to to build anything.
 *
 * It's just a record of the old flow types.
 *
 * Use it as a guide when converting
 * - static/src/javascripts/projects/atoms/services.js
 * to .ts, then delete it.
 */

// @flow

// expose some frontend modules to atoms
// managed by the atoms team

import ophan from 'ophan/ng';
import fastdom from 'fastdom';
import { isAdFreeUser } from 'common/modules/commercial/user-features';
import {
    onConsentChange,
    getConsentFor,
} from '@guardian/consent-management-platform';
import { viewport } from './services/viewport';

// Need to pass in the API to native services, something that looks
// like this:
// {
//    ophan:    { record: function(obj) { ... } },
//    identity: { ... },
//    ...
// }

type FastdomAction = Function => void;

const promisify = (fdaction: FastdomAction) => (
    thunk: Function
): Promise<any> =>
    new Promise(resolve => {
        fdaction.call(fastdom, () => {
            resolve(thunk());
        });
    });

const onAcastConsentChange = (callback: boolean => void): void => {
    onConsentChange(state => {
        const consented = getConsentFor('acast', state);
        callback(consented);
    });
};

const services: Services = {
    ophan,
    dom: {
        write: promisify(fastdom.mutate),
        read: promisify(fastdom.measure),
    },
    viewport,
    consent: {
        onAcastConsentChange,
    },
    commercial: {
        isAdFree: isAdFreeUser(),
    },
};

export { services };
