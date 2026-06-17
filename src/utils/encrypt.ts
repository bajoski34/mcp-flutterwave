import { Buffer } from "buffer";
import { createCipheriv } from "crypto";

/**
 * Encrypt card data using the Flutterwave encryption key.
 * Uses 3DES in ECB mode with PKCS#5 padding, base64-encoded output.
 * Equivalent to the node-forge 3DES-ECB implementation.
 *
 * @param key  - FLW_ENCRYPTION_KEY (must be exactly 24 bytes; pad/truncate as needed)
 * @param text - plaintext to encrypt (typically a JSON string of card data)
 */
export function encrypt(key: string, text: string): string {
    const keyBuffer = Buffer.alloc(24);
    Buffer.from(key, "utf8").copy(keyBuffer, 0, 0, 24);

    const cipher = createCipheriv("des-ede3-ecb", keyBuffer, null);

    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);

    return encrypted.toString("base64");
}
