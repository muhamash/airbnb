// contexts/FormContext.tsx
'use client';

import { createContext, ReactNode, useContext, useReducer } from 'react';

interface Stock {
  roomsMax: string;
  guestsMax: string;
  bedMax: string;
}

interface FormState {
  propertyName: string;
  propertyLocation: string;
  overview: string;
  price: string;
  rooms: string;
  gallery: string[];
  amenities: string[];
  stocks: Stock[];
  errors: Record<string, string>;
  editFields: Record<string, boolean>;
}

type FormAction =
  | { type: 'UPDATE_FIELD'; field: string; value: never }
  | { type: 'TOGGLE_EDIT'; field: string }
  | { type: 'RESET_FIELD'; field: string }
  | { type: 'TOGGLE_AMENITY'; amenity: string }
  | { type: 'ADD_STOCK' }
  | { type: 'REMOVE_STOCK'; index: number }
  | { type: 'VALIDATE_FIELD'; field: string; value: never };

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | undefined>(undefined);

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      if ( action.field.startsWith( 'stocks.' ) )
      {
        const pathParts = action.field.split( '.' );
        const stockIndex = parseInt( pathParts[ 1 ] );
        const fieldName = pathParts[ 2 ] as keyof Stock;
    
        const updatedStocks = [ ...state.stocks ];
        updatedStocks[ stockIndex ] = {
          ...updatedStocks[ stockIndex ],
          [ fieldName ]: action.value
        };

        // Create temporary state for validation
        const tempState = {
          ...state,
          stocks: updatedStocks,
          errors: {
            ...state.errors,
            [ action.field ]: validateField( action.field, action.value, state )
          }
        };

        // If roomsMax changes, re-validate bedMax
        if ( fieldName === 'roomsMax' )
        {
          const bedMaxField = `stocks.${ stockIndex }.bedMax`;
          const bedMaxValue = updatedStocks[ stockIndex ].bedMax;
          tempState.errors[ bedMaxField ] = validateField(
            bedMaxField,
            bedMaxValue,
            tempState
          );
        }

        return tempState;
      }
      
      if ( action.field.startsWith( 'gallery.' ) )
      {
        const pathParts = action.field.split( '.' );
        const galleryIndex = parseInt( pathParts[ 1 ] );
        const updatedGallery = [ ...state.gallery ];
        updatedGallery[ galleryIndex ] = action.value;

        return {
          ...state,
          gallery: updatedGallery,
          errors: {
            ...state.errors,
            [ action.field ]: validateField( action.field, action.value, state )
          }
        };
      }
      
      return {
        ...state,
        [ action.field ]: action.value,
        errors: {
          ...state.errors,
          [ action.field ]: validateField( action.field, action.value, state )
        }
      };
    };
      
    case 'TOGGLE_EDIT':
      return {
        ...state,
        editFields: {
          ...state.editFields,
          [action.field]: !state.editFields[action.field],
        },
      };

    case 'RESET_FIELD':
      return {
        ...state,
        [action.field]: initialState[action.field as keyof FormState],
        editFields: {
          ...state.editFields,
          [action.field]: false,
        },
      };

    case 'TOGGLE_AMENITY': {
      const amenities = state.amenities.includes(action.amenity)
        ? state.amenities.filter(item => item !== action.amenity)
        : [...state.amenities, action.amenity];
      return { ...state, amenities };
    }

    case 'ADD_STOCK':
      return {
        ...state,
        stocks: [...state.stocks, { roomsMax: '', guestsMax: '', bedMax: '' }],
      };

    case 'REMOVE_STOCK':
      return {
        ...state,
        stocks: state.stocks.filter((_, i) => i !== action.index),
      };

    case 'VALIDATE_FIELD':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: validateField(action.field, action.value, state),
        },
      };

    default:
      return state;
  }
};

const validateField = ( field: string, value: never, state: FormState ): string =>
{
  if ( !value && field !== 'amenities' ) return 'This field is required';

  if (field.startsWith('gallery.')) {
    if (!value.trim()) return 'Image URL is required';
    try {
      new URL( value );
    } catch {
      return 'Invalid URL format';
    }
  }
  
  if( field.startsWith( 'stocks.' ) ) {
    const pathParts = field.split( '.' );
    const stockIndex = parseInt( pathParts[ 1 ] );
    const fieldName = pathParts[ 2 ];
    const stock = state.stocks[ stockIndex ];

    if ( fieldName === 'bedMax' && stock.roomsMax )
    {
      const minBeds = parseInt( stock.roomsMax ) * 3;
      if ( parseInt( value ) < minBeds ) return `Minimum ${ minBeds } beds required`;
    }

    if ( parseInt( value ) < 0 ) return 'Cannot be negative';
  }

  return '';
};

const initialState: FormState = {
    propertyName: '',
    propertyLocation: '',
    overview: '',
    price: '',
    gallery: Array( 5 ).fill( '' ),
    amenities: [],
    stocks: [ { roomsMax: '', guestsMax: '', bedMax: '' } ],
    errors: {},
    editFields: {},
};

export const FormProvider = ( { children }: { children: ReactNode } ) =>
{
    const [ state, dispatch ] = useReducer( formReducer, initialState );

    console.log( state );
    return (
        <FormContext.Provider value={{ state, dispatch }}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};