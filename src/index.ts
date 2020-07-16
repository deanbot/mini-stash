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
export const stash = (
	storageKey:string, 
	data: any,
	useSessionStorage?: boolean
) => {
	const storage = getStorage(useSessionStorage);
	const time = Math.floor(new Date().getTime() / 1000);
	storage.setItem(storageKey, JSON.stringify(data));
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
	if (!!data && !!storageDate) {
		try {
			const nowMs = +(new Date());
			const storageMs = +(new Date(storageDate)) * 1000;
			const minutesOld = Math.ceil(
				nowMs - storageMs / 1000 / 60
			);
			if (minutesOld > minutesToExpiration) {
				clear(storageKey, useSessionStorage);
				data = null;
			} else {
				data = JSON.parse(data);
			}
		} catch (e) {}
	}
	return data;
};

export const clear = (
	storageKey: string,
	useSessionStorage?: boolean
) => {
	const storage = getStorage(useSessionStorage);
	delete storage[storageKey];
	delete storage[getDateKey(storageKey)];
};
