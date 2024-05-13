import { useReactiveVar } from "@apollo/client";
import { Link, Outlet } from "react-router-dom";
import { userVar } from "../../cache/cache";
import Head from "../../components/common/Head";
import Wrapper from "../../components/common/Wrapper";

const Layout = () => {
    const user = useReactiveVar(userVar)

    return(
        <>
        {
            user && <Head />
        }
            <Outlet />
        </>
    )
}

export {Layout}