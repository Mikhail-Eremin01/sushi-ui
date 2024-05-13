import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useReactiveVar } from "@apollo/client"
import { userVar, errorsVar, successVar } from './cache/cache'
import { useUserInfoQuery } from './types/graphql'
import usePrevious from './hooks/usePrevious'
import { Layout } from "./pages/Layout/Layout";

const Auth = React.lazy(() => import("./pages/Auth"))

const Popup = React.lazy(() => import("./components/common/Popup"))

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
            default: return ''
        }
    }
    if ([
          '#manage-user'
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
