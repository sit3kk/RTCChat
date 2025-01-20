#include <iostream>
#include <gmpxx.h>
#include "RSAKeyGenerator.hpp"
#include "RSAEncryptor.hpp"
#include "RSAKeyExporter.hpp"
#include "PGPFormatter.hpp"

int main() {
    using MyType = mpz_class;

    // Generowanie kluczy RSA
    std::cout << "Generating RSA keys...\n";
    MyType min = mpz_class(1) << 4095;
    MyType max = (mpz_class(1) << 4096) - 1;
    auto [publicKey, privateKey] = RSAKeyGenerator<MyType>::generateKeys(min, max);

    MyType e = publicKey.first;
    MyType n = publicKey.second;
    MyType d = privateKey.first;

    std::cout << "Public Key: (e=" << e << ", n=" << n << ")\n";
    std::cout << "Private Key: (d=" << d << ", n=" << n << ")\n\n";

    // Eksport kluczy w formacie PGP
    std::string publicKeyPGP = RSAKeyExporter<MyType, PGPFormat>::exportPublicKey(publicKey);
    std::string privateKeyPGP = RSAKeyExporter<MyType, PGPFormat>::exportPrivateKey(privateKey);
    std::cout << "Exported Public Key (PGP):\n" << publicKeyPGP << "\n\n";
    std::cout << "Exported Private Key (PGP):\n" << privateKeyPGP << "\n\n";

    // Eksport kluczy w formacie JSON
    std::string publicKeyJSON = RSAKeyExporter<MyType, JSONFormat>::exportPublicKey(publicKey);
    std::string privateKeyJSON = RSAKeyExporter<MyType, JSONFormat>::exportPrivateKey(privateKey);
    std::cout << "Exported Public Key (JSON):\n" << publicKeyJSON << "\n\n";
    std::cout << "Exported Private Key (JSON):\n" << privateKeyJSON << "\n\n";

    // Import kluczy z JSON
    auto importedPublicKey = RSAKeyGenerator<MyType>::importPublicKeyFromJSON(publicKeyJSON);
    auto importedPrivateKey = RSAKeyGenerator<MyType>::importPrivateKeyFromJSON(privateKeyJSON);
    std::cout << "Imported Public Key: (e=" << importedPublicKey.first
              << ", n=" << importedPublicKey.second << ")\n";
    std::cout << "Imported Private Key: (d=" << importedPrivateKey.first
              << ", n=" << importedPrivateKey.second << ")\n\n";

    // Wiadomość do zaszyfrowania
    std::string message = "Hello, RSA!";
    std::cout << "Original Message: " << message << "\n";

    // Szyfrowanie wiadomości
    auto encryptedMessage = RSAEncryptor<MyType>::encryptMessage(message, e, n);

    // Eksport wiadomości w formacie PGP
    std::string encryptedPGP = exportEncryptedMessage<PGPFormat>(encryptedMessage);
    std::cout << "Encrypted Message (PGP):\n" << encryptedPGP << "\n\n";

    // Eksport wiadomości w formacie JSON
    std::string encryptedJSON = exportEncryptedMessage<JSONFormat>(encryptedMessage);
    std::cout << "Encrypted Message (JSON):\n" << encryptedJSON << "\n\n";

    // Import i deszyfrowanie wiadomości z PGP
    auto importedPGPBlocks = importEncryptedMessage<PGPFormat, MyType>(encryptedPGP);
    std::string decryptedFromPGP = RSAEncryptor<MyType>::decryptMessage(importedPGPBlocks, d, n);
    std::cout << "Decrypted Message (from PGP): " << decryptedFromPGP << "\n\n";

    // Import i deszyfrowanie wiadomości z JSON
    auto importedJSONBlocks = importEncryptedMessage<JSONFormat, MyType>(encryptedJSON);
    std::string decryptedFromJSON = RSAEncryptor<MyType>::decryptMessage(importedJSONBlocks, d, n);
    std::cout << "Decrypted Message (from JSON): " << decryptedFromJSON << "\n\n";

    // Generowanie podpisu cyfrowego
    std::cout << "Generating digital signature...\n";
    MyType signature = RSAEncryptor<MyType>::generateSignature(message, d, n);
    std::cout << "Signature: " << signature << "\n";

    // Weryfikacja podpisu
    std::cout << "Verifying signature...\n";
    bool isValid = RSAEncryptor<MyType>::verifySignature(signature, message, e, n);
    std::cout << "Signature Valid: " << (isValid ? "Yes" : "No") << "\n";

    return 0;
}