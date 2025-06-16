export const formatFileName = (fileName: string): string => {
  const parts = fileName.split('_');
  if (parts.length > 1) {
    return parts.slice(1).join('_');
  }
  return fileName;
}; 