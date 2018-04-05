import * as paymentStatusTypes from '../payment/payment-status-types';

export default class OrderSelector {
    /**
     * @constructor
     * @param {OrderState} order
     * @param {PaymentState} payment
     * @param {CustomerState} customer
     * @param {CartState} cart
     */
    constructor(order = {}, payment = {}, customer = {}, cart = {}) {
        this._order = order;
        this._payment = payment;
        this._customer = customer;
        this._cart = cart;
    }

    /**
     * @return {Order}
     */
    getOrder() {
        return this._order.data;
    }

    /**
     * @return {Object}
     */
    getOrderMeta() {
        return {
            deviceFingerprint: this._order.meta && this._order.meta.deviceFingerprint,
        };
    }

    /**
     * @return {?string}
     */
    getPaymentAuthToken() {
        return this._order.meta && this._order.meta.token;
    }

    /**
     * @param {boolean} useStoreCredit
     * @return {boolean}
     */
    isPaymentDataRequired(useStoreCredit) {
        const grandTotal = this._cart.data && this._cart.data.grandTotal && this._cart.data.grandTotal.amount || 0;
        const storeCredit = this._customer.data && this._customer.data.storeCredit || 0;

        return (useStoreCredit ? grandTotal - storeCredit : grandTotal) > 0;
    }

    /**
     * @param {PaymentMethod} paymentMethod
     * @return {boolean}
     */
    isPaymentDataSubmitted(paymentMethod = {}) {
        const { payment = {} } = this.getOrder() || {};

        return !!paymentMethod.nonce ||
            payment.status === paymentStatusTypes.ACKNOWLEDGE ||
            payment.status === paymentStatusTypes.FINALIZE;
    }

    /**
     * @return {?ErrorResponse}
     */
    getLoadError() {
        return this._order.errors && this._order.errors.loadError;
    }

    /**
     * @return {boolean}
     */
    isLoading() {
        return !!(this._order.statuses && this._order.statuses.isLoading);
    }
}
