import React from "react"
import {
    addAnchoredPoints, addBirthday, addCompanies,
    addCompany, addDetailed, addEmail,
    addFirstLogin, addFirstName, addOrganizations,
    addId, addInn, addLastName, addOrganization,
    addPatronymic, addPhone, addPhoto,
    addPIN, addPosition, addProducts,
    addRegion, addStaff, addTitle,
    changeLocation, minimizedMenu, switchAuth,
    switchLoader, addCustomer, addCustomers
} from "../actions/actionCreator";

export default function MClearStore(dispatch) {

    dispatch(addId(null));
    dispatch(addPatronymic(""));
    dispatch(addFirstLogin(false));
    dispatch(addPhone(""));
    dispatch(addPhoto(""));
    dispatch(addEmail(""));
    dispatch(addBirthday(""));
    dispatch(addRegion(""));
    dispatch(addPIN(""));
    dispatch(addInn(""));
    dispatch(addCompany({}));
    dispatch(addCompanies([]));
    dispatch(addOrganizations([]));
    dispatch(addOrganization({}));
    dispatch(addFirstName(""));
    dispatch(addLastName(""));
    dispatch(addPosition(null));
    dispatch(addStaff([]));
    dispatch(addTitle(""));
    dispatch(changeLocation("/"));
    dispatch(switchLoader(false));
    dispatch(switchAuth(false));
    dispatch(minimizedMenu(false));
    dispatch(addAnchoredPoints([]));
    dispatch(addProducts({count: 0, next: null, previous: null, results: []}))
    dispatch(addDetailed([]))
    dispatch(addCustomer({}))
    dispatch(addCustomers([]))

    return null;
}
