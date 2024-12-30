/* eslint-disable @typescript-eslint/no-explicit-any */
export const authConfig: { 
    session: { 
        strategy: string; 
    }; 
    providers: any[]; 
} = {
    session: {
        strategy: 'jwt',
    },
    providers: [],
};