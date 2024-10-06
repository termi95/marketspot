export const GetColumns = <T extends object>(data: T[], excludedColumn: string[]=[]): (keyof T)[] => {
    if (data.length === 0) return [];
  
    const firstRow = data[0];
    return Object.keys(firstRow).filter(key => ColumnNameIsNotInExludedList(key, excludedColumn)).filter((key) => {
      const value = firstRow[key as keyof T];
      return (
        IsNotObject(value) ||
        IsNotNull(value) ||
        IsNotArray(value)        
      );
    }) as (keyof T)[];
  };

  function IsNotObject(value: unknown) {
    return typeof value !== "object"
  }

  function IsNotNull(value: unknown) {
    return value === null
  }

  function IsNotArray(value: unknown) {
    return Array.isArray(value)
  }

  function ColumnNameIsNotInExludedList(key:string, columns: string[]) {
    const excludedColumn = ["id"];
    console.log(key)
    if (columns.length > 0) {
        return !columns.includes(key);        
    }else{
        return !excludedColumn.includes(key);      
    }
  }