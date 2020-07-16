// constants
const storageKeyDateSuffix = '_date';

// helpers
export interface IStorage {
  getItem(key:string):any;
  setItem(key:string, data:any):void;
}
const getStorage = (useSessionStorage?: boolean):IStorage => !useSessionStorage ? localStorage : sessionStorage;
const getDateKey = (storageKey: string):string => `${storageKey}${storageKeyDateSuffix}`;

// exported methods
export const clear = (
  storageKey: string,
  useSessionStorage?: boolean
) => {
  const storage = getStorage(useSessionStorage);

  // delete the data and the storage date
  delete storage[storageKey];
  delete storage[getDateKey(storageKey)];
};

export const stash = (
  storageKey:string,
  data: any,
  useSessionStorage?: boolean
) => {
  const storage = getStorage(useSessionStorage);
  const time = Math.floor(new Date().getTime() / 1000);

  // store data as json string
  storage.setItem(storageKey, JSON.stringify(data));

  // store unix date string for expiration check
  storage.setItem(getDateKey(storageKey), time.toString());
};

export const retrieve = (
  storageKey: string,
  minutesToExpiration: number,
  useSessionStorage?: boolean
) => {
  const storage = getStorage(useSessionStorage);
  const storageDate = +storage.getItem(getDateKey(storageKey));
  let data = storage.getItem(storageKey);

  // discard if date is missing
  if (!!data) {

    // check if expired
    const expires = minutesToExpiration > 0;
    let expired;
    if (expires && !!storageDate) {
      const nowMs = +(new Date());
      const storageMs = +(new Date(storageDate)) * 1000;
      const minutesOld = Math.ceil(
        nowMs - storageMs / 1000 / 60
      );
      expired = minutesOld > minutesToExpiration;
    }

    if (expires && (!storageDate || expired)) {

      // discard if expired or missing date
      clear(storageKey, useSessionStorage);
      data = null;
    } else {

      // parse json
      try {
        data = JSON.parse(data);
      } catch (e) {
        // raw data will be retrieved if problem parsing
      }
    }
  }
  return data;
};
