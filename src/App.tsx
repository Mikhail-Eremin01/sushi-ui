import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useReactiveVar } from "@apollo/client"
import { userVar, errorsVar, successVar } from './cache/cache'
import { useUserInfoQuery } from './types/graphql'
import usePrevious from './hooks/usePrevious'
import Address from "./pages/Settings/SubPages/Address";
import Users from "./pages/Settings/SubPages/Users/index";
import Funds from "./pages/Settings/SubPages/Funds";
import Permissions from "./pages/Settings/SubPages/Permissions";
import AboutUs from "./pages/Settings/SubPages/AboutUs";
import ManageAddress from "./popup/ManageAddress";
import { Layout } from "./pages/Layout/Layout";
import Company from "./pages/Settings/SubPages/Company";
import DeleteAddress from "./popup/DeleteAddress";
import BetaFeature from "./popup/BetaFeature/BetaFeature";
import ManageBox from "./popup/ManageBox/ManageBox";
import SendOperationInfo from "./popup/SendOperationInfo";


const Auth = React.lazy(() => import("./pages/Auth"))
const Register = React.lazy(() => import("./pages/Register"))
const Schedule = React.lazy(() => import("./pages/Schedule"))
const Statistics = React.lazy(() => import("./pages/Statistics"))
const Charities = React.lazy(() => import("./pages/Charities"))
const Settings = React.lazy(() => import("./pages/Settings"))
const RoutePage = React.lazy(() => import("./pages/Route"))
const NotFound = React.lazy(() => import("./pages/NotFound"))
const CompanyStatistics = React.lazy(() => import("./pages/CompanyStatistics"))
const Companies = React.lazy(() => import("./pages/Companies"))

const Popup = React.lazy(() => import("./components/common/Popup"))
const ManageUser = React.lazy(() => import("./popup/ManageUser"))
const ManageOperation = React.lazy(() => import("./popup/ManageOperation"))
const ManageFund = React.lazy(() => import("./popup/ManageFund"))
const TransferMoney = React.lazy(() => import("./popup/TransferMoney"))
const ManageEvent = React.lazy(() => import("./popup/ManageEvent"))
const ManageDayEvents = React.lazy(() => import("./popup/ManageDayEvents"))
const SuggestOrganization = React.lazy(() => import("./popup/SuggestOrganization"))
const DeleteEvent = React.lazy(() => import("./popup/DeleteEvent"))
const EditEvent = React.lazy(() => import("./popup/EditEvent"))

const App: React.FC = () => {
  let user = useReactiveVar(userVar)

  const { loading } = useUserInfoQuery({
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
      onCompleted: data => {
          userVar(data?.userInfo)
      },
      onError: err => {
          console.log('OnError', err)
      },
      errorPolicy: 'ignore'
  })

  if (loading && user === undefined) return <div className="preloader"></div>

  return (
    <div className="App">
      <BrowserRouter>
        <React.Suspense fallback={<div className="preloader"></div>}>
          <Routes>
            <Route path={`/`} element={<Layout />}>
              <Route index element={<Auth />} />
              <Route path={`/register`} element={<Register />} />
              <Route path={`/qr/:companyId/add-event`} element={<CompanyStatistics view="add-event" />} />
              <Route path={`/qr/:companyId/`} element={<CompanyStatistics view="stats" />} />
              <Route path={`/cabinet/schedule/:date`} element={<Schedule />} />
              <Route path={`/cabinet/statistics`} element={<Statistics />} />
              <Route path={`/cabinet/charities`} element={<Charities />} />
              <Route path={`/cabinet/companies`} element={<Companies />} />
              <Route path={`cabinet/settings/`} element={<Settings />}>
                <Route index element={<Company />} />
                <Route path={`address`} element={<Address />} />
                <Route path={`users`} element={<Users />} />
                <Route path={`funds`} element={<Funds />} />
                <Route path={`permissions`} element={<Permissions />} />
                <Route path={`about_us`} element={<AboutUs />} />
              </Route>
              <Route path={`/cabinet/route`} element={<RoutePage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </React.Suspense>
        <Location />
      </BrowserRouter>
    </div>
  )
}

const Location: React.FC = () => {
    const location = useLocation()
    const errors = useReactiveVar(errorsVar)
    const success = useReactiveVar(successVar)
    const prevPageKey = usePrevious(location.key)

    //Delete errors and successes
    React.useEffect(() => {
        if (location.key !== prevPageKey && prevPageKey !== undefined) {
            if (errors.length > 0) errorsVar([])
            if (success !== null) successVar(null)
        }
    }, [prevPageKey, location, errors, success])

    const renderPopup = (hash: string) => {
        switch(hash) {
            case '#manage-user': return <ManageUser/>
            case '#manage-operation': return <ManageOperation/>
            case '#manage-fund': return <ManageFund/>
            case '#transfer-money': return <TransferMoney/>
            case '#manage-event': return <ManageEvent/>
            case '#manage-day-events': return <ManageDayEvents/>
            case '#suggest-organization': return <SuggestOrganization/>
            case '#delete-event': return <DeleteEvent/>
            case '#edit-event': return <EditEvent/>
            case '#manage-address': return <ManageAddress/>
            case '#delete-address': return <DeleteAddress/>
            case '#suggests-feature': return <BetaFeature />
            case '#order-box': return <ManageBox />
            case '#send-operation-info': return <SendOperationInfo />
            default: return ''
        }
    }
    if ([
          '#manage-user',
          '#manage-operation',
          '#manage-fund',
          "#transfer-money",
          '#manage-event',
          '#suggest-organization',
          '#delete-event',
          '#edit-event',
          '#manage-day-events',
          '#manage-address',
          '#delete-address',
          '#suggests-feature',
          '#order-box',
          '#send-operation-info'
        ].includes(location.hash))
        return (
            <React.Suspense fallback={''}>
                <Popup>
                    { renderPopup(location.hash) }
                </Popup>
            </React.Suspense>
        )


    return <></>
}

export default App
