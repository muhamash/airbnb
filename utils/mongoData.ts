/* eslint-disable @typescript-eslint/no-unused-vars */

export const replaceMongoIdInArray = <T extends { _id: string }> ( array: T[] ): ( Omit<T, "_id"> & { id: string } )[] =>
{
    const mappedArray = array.map( item =>
    {
        return {
            id: item._id.toString(),
            ...item
        };
    } ).map( ( { _id, ...rest } ) => rest );

    return mappedArray;
};

export const replaceMongoIdInObject = <T extends { _id: string }> ( obj: T ): Omit<T, "_id"> & { id: string } =>
{
    const { _id, ...updatedObj } = { ...obj, id: obj._id.toString() };
    return updatedObj;
};