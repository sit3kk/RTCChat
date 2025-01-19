#include <iostream>
#include <gmpxx.h>
#include "RSAKeyGenerator.hpp"
#include "RSAKeyExporter.hpp"
#include "RSAEncryptor.hpp"
#include "Base64.hpp"

int main() {
    using MyType = mpz_class;

    std::cout << "Generating RSA keys...\n";

    // For a real RSA, you'd choose far larger ranges; this is just a quick demo.
    MyType min = mpz_class(1) << 7;     // 128
    MyType max = (mpz_class(1) << 8) - 1;  // 255

    // Generate (publicKey, privateKey)
    auto [publicKey, privateKey] = RSAKeyGenerator<MyType>::generateKeys(min, max);

    MyType e = publicKey.first;
    MyType n = publicKey.second;
    MyType d = privateKey.first;

    std::cout << "Public Key: (e=" << e << ", n=" << n << ")\n";
    std::cout << "Private Key: (d=" << d << ", n=" << n << ")\n\n";

    // Export keys in PGP and JSON formats
    std::string publicKeyPGP =
        RSAKeyExporter<MyType, PGPFormat>::exportPublicKey(publicKey);
    std::string privateKeyPGP =
        RSAKeyExporter<MyType, PGPFormat>::exportPrivateKey(privateKey);

    std::cout << "Exported Public Key (PGP):\n" << publicKeyPGP << "\n\n";
    std::cout << "Exported Private Key (PGP):\n" << privateKeyPGP << "\n\n";

    std::string publicKeyJSON =
        RSAKeyExporter<MyType, JSONFormat>::exportPublicKey(publicKey);
    std::string privateKeyJSON =
        RSAKeyExporter<MyType, JSONFormat>::exportPrivateKey(privateKey);

    std::cout << "Exported Public Key (JSON):\n" << publicKeyJSON << "\n\n";
    std::cout << "Exported Private Key (JSON):\n" << privateKeyJSON << "\n\n";

    // Import keys from JSON
    auto importedPublicKey =
        RSAKeyGenerator<MyType>::importPublicKeyFromJSON(publicKeyJSON);
    auto importedPrivateKey =
        RSAKeyGenerator<MyType>::importPrivateKeyFromJSON(privateKeyJSON);

    std::cout << "Imported Public Key: (e=" << importedPublicKey.first
              << ", n=" << importedPublicKey.second << ")\n";
    std::cout << "Imported Private Key: (d=" << importedPrivateKey.first
              << ", n=" << importedPrivateKey.second << ")\n\n";

    // Message encryption/decryption
    std::string message = "Hello, RSA!";
    std::cout << "Original Message: " << message << "\n";

    auto encryptedMessage = RSAEncryptor<MyType>::encryptMessage(message, e, n);
    std::cout << "Encrypted Message (Base64): ";
    for (const auto& block : encryptedMessage) {
        std::string blockStr = block.get_str();
        std::string encoded = Base64::encode(
            std::vector<uint8_t>(blockStr.begin(), blockStr.end())
        );
        std::cout << encoded << " ";
    }
    std::cout << "\n\n";

    std::string decryptedMessage =
        RSAEncryptor<MyType>::decryptMessage(encryptedMessage, d, n);
    std::cout << "Decrypted Message: " << decryptedMessage << "\n\n";

    // Digital signature
    std::cout << "Generating digital signature...\n";
    MyType signature = RSAEncryptor<MyType>::generateSignature(message, d, n);
    std::cout << "Signature: " << signature << "\n";

    std::cout << "Verifying signature...\n";
    bool isValid =
        RSAEncryptor<MyType>::verifySignature(signature, message, e, n);
    std::cout << "Signature Valid: " << (isValid ? "Yes" : "No") << "\n";

    return 0;
}