type State = {
    query: string | undefined;
    results: never[] | undefined;
    isLoading: boolean | null;
    error: string | null;
    isDropdownVisible: boolean | null;
};

type Action =
    | { type: "START_SEARCH" }
    | { type: "SEARCH_SUCCESS"; payload: never[] }
    | { type: "SEARCH_ERROR"; payload: string }
    | { type: "SET_QUERY"; payload: string }
    | { type: "TOGGLE_DROPDOWN"; payload: boolean }
    | { type: "CLEAR_QUERY" };

export const initialState: State = {
    query: "",
    results: [],
    isLoading: false,
    error: null,
    isDropdownVisible: false,
};

export const searchReducer = ( state: State, action: Action ): State =>
{
    // console.log( "Action dispatched:", action );
    switch ( action.type )
    {
        case "START_SEARCH":
            return { ...state, isLoading: true, error: null, results: [] };
        case "SEARCH_SUCCESS":
            return { ...state, isLoading: false, results: action.payload };
        case "SEARCH_ERROR":
            return { ...state, isLoading: false, error: action.payload };
        case "SET_QUERY":
            return { ...state, query: action.payload };
        case "TOGGLE_DROPDOWN":
            return { ...state, isDropdownVisible: action.payload };
        case "CLEAR_QUERY":
            return { ...state, query: "", isDropdownVisible: false };
        default:
            return state;
    }
};