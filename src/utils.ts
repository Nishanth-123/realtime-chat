// Compression: Turn image URL into short string (<50 chars)
export const compressUrl = (url: string) => {
    // Create a hash using URL + timestamp
    const timestamp = Date.now().toString(36).slice(-4);
    const hash = Array.from(url)
      .reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
      .toString(36).slice(-6);
    
    // Store mapping in localStorage
    const key = `img_${timestamp}${hash}`;
    localStorage.setItem(key, url);
    
    return key; // Returns identifier ~15 chars
  };
  
  // Decompression: Get original URL from short string
  export const decompressUrl = (shortId: string) => {
    // Retrieve from localStorage
    return localStorage.getItem(shortId);
  };