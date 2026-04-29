// /**
//  * Hỗ trợ băm chuỗi (mật khẩu) bằng thuật toán SHA-256 sử dụng Web Crypto API.
//  * 
//  * @param password Mật khẩu văn bản thuần.
//  * @returns Mã băm SHA-256 dưới dạng chuỗi hex (64 ký tự).
//  */
// export const hashPassword = async (password: string): Promise<string> => {
//     const msgUint8 = new TextEncoder().encode(password);
//     const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//     return hashHex;
// };
