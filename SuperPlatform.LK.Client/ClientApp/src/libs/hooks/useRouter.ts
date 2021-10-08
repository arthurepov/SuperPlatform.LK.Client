import { useMemo } from 'react';
import {
    useHistory,
    useLocation,
    useParams,
    useRouteMatch,
} from 'react-router-dom';
import queryString from 'query-string';

type TUseRouter = {
    push: (path: string, state?: any) => void,
    replace: (path: string, state?: any) => void,
    pathname: string,
    query: {
        [x: string]: any,
    },
    match: {
        isExact: boolean,
        params: any,
        path: string,
        url: string,
    },
    location: {
        hash: string,
        pathname: string,
        search: string,
        state: any,
    },
    history: {
        [x: string]: any,
    },
};

export function useRouter(): TUseRouter {
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();

    return useMemo(() => ({
        push: history.push,
        replace: history.replace,
        pathname: location.pathname,
        query: {
            ...queryString.parse(location.search),
            ...params,
        },
        match,
        location,
        history,
    }), [
        params,
        match,
        location,
        history,
    ]);
}
