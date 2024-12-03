import { CID } from 'multiformats/cid';
import { encode as encodeBase64 } from 'uint8-to-base64';
import init, {
  init_native,
  mkdir_native,
  ls_native,
  write_file_native,
  load_with_wnfs_key_native,
  read_file_native,
} from '@functionland/wnfslib-web';

export class FulaDatastore {
  private store: Map<string, Uint8Array> = new Map();
  private totalBytesPut = 0;
  private totalBytesGet = 0;
  private readonly ipfsGatewayUrl: string = 'https://ipfs.cloud.fx.land/gateway';

  async put(cid: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    const cidString = this.cidToString(cid);
    this.store.set(cidString, data);
    this.totalBytesPut += data.length;

    // Also store in localStorage
    try {
      localStorage.setItem(`wnfs_data_${cidString}`, this.encodeToBase64(data));
    } catch (error) {
      console.warn('Failed to store data in localStorage:', error);
    }

    console.log('put', { cid: cid, data: data });
    return cid;
  }

  async get(cid: Uint8Array): Promise<Uint8Array> {
    const cidString = this.cidToString(cid);

    // First check in-memory store
    const memoryData = this.store.get(cidString);
    if (memoryData) {
      console.log('get from memory', { cid: cid, base64Data: this.encodeToBase64(memoryData) });
      return memoryData;
    }

    // Then check localStorage
    const localData = localStorage.getItem(`wnfs_data_${cidString}`);
    if (localData) {
      const decodedData = this.base64ToUint8Array(localData);
      this.store.set(cidString, decodedData); // Cache in memory
      console.log('get from localStorage', { cid: cid, base64Data: localData });
      return decodedData;
    }

    // Finally, fetch from remote
    try {
      const response = await fetch(`${this.ipfsGatewayUrl}/${cidString}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data for CID: ${cidString}`);
      }
      const data = new Uint8Array(await response.arrayBuffer());
      this.totalBytesGet += data.length;

      // Cache the fetched data
      this.store.set(cidString, data);
      try {
        localStorage.setItem(`wnfs_data_${cidString}`, this.encodeToBase64(data));
      } catch (error) {
        console.warn('Failed to cache data in localStorage:', error);
      }

      console.log('get from remote', { cid: cid, base64Data: this.encodeToBase64(data) });
      return data;
    } catch (error) {
      console.error(`Error fetching data for CID: ${cidString}`, error);
      throw new Error(`No data found for CID: ${cidString}`);
    }
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private encodeToBase64(bytes: Uint8Array): string {
    return encodeBase64(bytes);
  }

  public cidToString(bytes: Uint8Array): string {
    const cid = CID.decode(bytes);
    return cid.toString();
  }

  public stringToCid(str: string): Uint8Array {
    const cid = CID.parse(str);
    return cid.bytes;
  }

  getTotalBytesPut(): number {
    return this.totalBytesPut;
  }

  getTotalBytesGet(): number {
    return this.totalBytesGet;
  }
}


export class FileManager {
  constructor(private jsClient: any, private wnfsKey: Uint8Array) {}

  // Initialize the WebAssembly module and setup datastore
  async init() {
    console.log('Initializing WebAssembly module...');
    await init();
    console.log('WebAssembly module initialized.');
    
    try {
      const rootCid = await init_native(this.jsClient, this.wnfsKey);
      console.log('Initialization successful.');
      return rootCid;
    } catch (error) {
      console.error('Error during initialization:', error);
      throw error;
    }
  }

  // Generate folder data from a given root CID and path
  async generateFolderData(rootCid: Uint8Array, path: string) {
    const folderData = {};
    
    try {
      const files = await ls_native(this.jsClient, rootCid, path);
      
      for (const [name, metadata] of files) {
        const id = this.generateId(name);
        const isFolder = !name.includes('.'); // Determine if it's a folder based on the name
  
        folderData[id] = {
          type: isFolder ? '__folder__' : '__file__',
          name,
          creatorName: 'Shubham Singh', // Example creator name
          size: isFolder ? 0 : metadata.get('size') || 0,
          created: this.formatDate(metadata.get('created')),
          modified: this.formatDate(metadata.get('modified')),
          parentID: null, // Set appropriately if needed
          parentPath: path,
          path: `${path}/${name}`,
          children: isFolder ? [] : undefined
        };
        
        if (isFolder) {
          folderData[id].children = []; // Initialize children array for folders
        }
      }
      
    } catch (error) {
      if ((error instanceof Error && error.message.includes('Cannot find file or directory')) || error.includes('Cannot find file or directory')) {
        console.warn(`Directory not found: ${path}. Returning empty array.`);
        return {};
      }
      console.error('Error generating folder data:', error);
      throw error;
    }
  
    return folderData;
  }

  // Helper method to generate a unique ID for each file/folder
  generateId(name) {
    return name.split('').reduce((acc, char) => acc + char.charCodeAt(0).toString(16), '');
  }

  // Helper method to format date from bigint timestamp
  formatDate(timestamp) {
    if (!timestamp) return null;
    const date = new Date(Number(timestamp) * 1000);
    return date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  }
}