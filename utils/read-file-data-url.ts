/**
 * mem-baca file gambar jadi data URL (base64) untuk disimpan lokal.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      if (typeof r.result === "string") {
        resolve(r.result);
      } else {
        reject(new Error("Bukan string"));
      }
    };
    r.onerror = () => reject(new Error("Gagal baca file"));
    r.readAsDataURL(file);
  });
}
