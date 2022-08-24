const libs: any = window as any;
const loaders: { [name: string]: Promise<any> } = {};

export async function loadLibrary<T>(url: string, name: string, onLoad?: (lib: T) => void): Promise<T> {
  if (libs[name] == null) {
    if (loaders[name] == null) {
      loaders[name] = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = event => {
          if (onLoad != null)
            onLoad(libs[name]);
          if (libs[name] == null)
            reject(event);
          else
            resolve(libs[name]);
        };
        script.onerror = event => {
          delete loaders[name];
          document.head.removeChild(script);
          reject(event);
        };
        document.head.appendChild(script);
      });
    }
    return await loaders[name];
  }
  return libs[name];
}
