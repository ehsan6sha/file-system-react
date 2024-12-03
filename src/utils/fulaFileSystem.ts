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

class FulaDatastore {
  private store: Map<string, Uint8Array> = new Map();
  private totalBytesPut = 0;
  private totalBytesGet = 0;
  private readonly ipfsGatewayUrl: string = 'https://ipfs.cloud.fx.land/gateway';

  // Simulates storing data and returns the CID
  async put(cid: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    const cidString = this.cidToString(cid); // Convert CID Uint8Array to string
    this.store.set(cidString, data);
    this.totalBytesPut += data.length;

    console.log('put', { cid: cid, data: data });

    return cid; // Return the original CID as confirmation
  }

  // Retrieves data by CID using an external IPFS gateway
  async get(cid: Uint8Array): Promise<Uint8Array> {
    const cidString = this.cidToString(cid); // Convert CID Uint8Array to string

    try {
      const response = await fetch(`${this.ipfsGatewayUrl}/${cidString}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data for CID: ${cidString}`);
      }
      const data = new Uint8Array(await response.arrayBuffer());
      this.totalBytesGet += data.length;

      console.log('get', { cid: cid, base64Data: this.encodeToBase64(data) });

      return data;
    } catch (error) {
      console.error(`Error fetching data for CID: ${cidString}`, error);
      throw new Error(`No data found for CID: ${cidString}`);
    }
  }

  // Helper method to encode Uint8Array to Base64
  // Helper method to encode Uint8Array to Base64
  private encodeToBase64(bytes: Uint8Array): string {
    return encodeBase64(bytes);
  }

  // Helper method to convert a Uint8Array (binary CID) to a string representation (CIDv1)
  public cidToString(bytes: Uint8Array): string {
    const cid = CID.decode(bytes); // Decode binary CID into a CID object
    return cid.toString(); // Convert CID object to its string representation (default is CIDv1)
  }

  // Helper method to convert a string representation (CIDv1) back to a Uint8Array
  public stringToCid(str: string): Uint8Array {
    const cid = CID.parse(str); // Parse the string into a CID object
    return cid.bytes; // Get the binary representation of the CID as Uint8Array
  }

  getTotalBytesPut(): number {
    return this.totalBytesPut;
  }

  getTotalBytesGet(): number {
    return this.totalBytesGet;
  }
}


class FileManager {
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