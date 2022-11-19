const getFileName = (path) => {
    const lastIndex = path.path.split("/").pop();
    const fileName = lastIndex.split("_").pop();
    return fileName ;
}


export { getFileName };