import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function formatDate ( dateString: string ): Promise<string>
{
    const date = new Date(dateString);

    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();

    const getOrdinalSuffix = (day: number): string => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const dayWithSuffix = day + getOrdinalSuffix(day);
    return `${dayWithSuffix} ${month} ${year}`;
}

export const calculateDaysBetween = async ( checkIn: string, checkOut: string ): number =>
{
    const checkInDate = new Date( checkIn );
    const checkOutDate = new Date( checkOut );
    const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
    
    return differenceInTime / ( 1000 * 60 * 60 * 24 );
};

export const updateSearchParams = async ( updates: Record<string, string | null>, searchParams:URLSearchParams, router: AppRouterInstance ) =>
  {
    const currentParams = new URLSearchParams( searchParams.toString() );
    for ( const key in updates )
    {
      if ( updates[ key ] !== null )
      {
        currentParams.set( key, updates[ key ]! );
      } else
      {
        currentParams.delete( key );
      }
    }
    router.replace( `?${ currentParams.toString() }` );
};