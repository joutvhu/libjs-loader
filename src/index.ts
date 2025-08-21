const libs: { [lib: string]: any } = window as any;
const loaders: { [name: string]: Promise<any> } = {};

interface LoadLibraryOptions<T> {
  url: string;
  name: string;
  type?: string;
  async?: boolean,
  crossOrigin?: string | null;
  integrity?: string;
  noModule?: boolean;
  referrerPolicy?: string;
  onload?: (lib: T) => void;
}

export async function loadLibrary<T>(url: string, name: string, onload?: (lib: T) => void): Promise<T>;
export async function loadLibrary<T>(options: LoadLibraryOptions<T>): Promise<T>;
export async function loadLibrary<T>(url: string | LoadLibraryOptions<T>, name?: string, onload?: (lib: T) => void): Promise<T> {
  const options: LoadLibraryOptions<T> = typeof url !== 'string'
    ? url as LoadLibraryOptions<T>
    : {url: url as string, name: name as string, onload};
  if (libs[options.name] == null) {
    if (loaders[options.name] == null) {
      loaders[options.name] = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = options.type ?? 'text/javascript';
        script.async = options.async ?? false;
        if (options.noModule)
          script.noModule = options.noModule;
        if (options.integrity)
          script.integrity = options.integrity;
        if (options.referrerPolicy)
          script.referrerPolicy = options.referrerPolicy;
        script.crossOrigin = options.crossOrigin ?? null;
        script.src = options.url;
        script.onload = event => {
          if (options.onload != null)
            options.onload(libs[options.name]);
          if (libs[options.name] == null)
            reject(event);
          else
            resolve(libs[options.name]);
        };
        script.onerror = event => {
          delete loaders[options.name];
          document.head.removeChild(script);
          reject(event);
        };
        document.head.appendChild(script);
      });
    }
    return await loaders[options.name];
  }
  return libs[options.name];
}
