export const replaceMongoIdInArray = <T extends { _id: any }> (
    array: T[]
): ( Omit<T, "_id"> & { id: string } )[] =>
{
    return array.map( ( item ) =>
    {
        const { _id, ...rest } = item;
        return {
            id: _id.toString(),
            ...rest,
        };
    } );
};

export const replaceMongoIdInObject = <T extends { _id: string }> ( obj: T ): Omit<T, "_id"> & { id: string } =>
{
    const { _id, ...updatedObj } = { ...obj, id: obj._id.toString() };
    return updatedObj;
};