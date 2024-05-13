export const getShortName = (name:string, length: number) => {
    return name.length <= length + 7
        ?  name
        : `${name.slice(0, length)}...${name.slice(name.lastIndexOf('.')-2)}`
}