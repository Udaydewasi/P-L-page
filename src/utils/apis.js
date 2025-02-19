const BASE_URL = process.env.REACT_APP_BASE_URL;
// console.log(`BASE url ${BASE_URL}`)
export const endpoints = {
    BROKER_FORM_SUBMIT_API: BASE_URL + "/addBrokerForm",
    CREATE_USER_API: BASE_URL + "/createUserForm",
    USER_DETAIL_API: BASE_URL + "/get_user_detail",
    BROKER_FORM_DETAIL_API: BASE_URL + "/get_broker_form",
    BROKER_DATA_API: BASE_URL + "/get_trade_history?gmail=",
    CREDENTIAL_API: BASE_URL + "/checkUserCredential",
    ALL_TRADE_HISTORY_API: BASE_URL + "/get_all_trade_history?gmail=",
    DELETE_BROKER_API: BASE_URL + "/deleteBroker",
    EDIT_BROKER_API: BASE_URL + "/editBroker",
    BROKER_DETAIL_API: BASE_URL + "/get_broker_details"
}