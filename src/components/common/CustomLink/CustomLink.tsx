import { Link, useMatch } from "react-router-dom";

const CustomLink: React.FC<any> = ({ children, to }: any) => {
    const match = useMatch({
        path: to,
        end: to.length === 1,
    });
    return (
        <Link
            to={to}
            style={{
                color: match ? 'red' : 'black'
            }}
        >
            {children}
        </Link>
    )
}

export {CustomLink}