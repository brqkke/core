const isoToDate = (iso: string): Date => {
  return new Date(iso);
};

const dateToDDMMYYYYHHMMSS = (date: Date): string => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
};

export const isoToDDMMYYYYHHMMSS = (iso: string): string => {
  return dateToDDMMYYYYHHMMSS(isoToDate(iso));
};
