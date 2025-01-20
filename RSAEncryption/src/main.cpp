#include <iostream>
#include <gmpxx.h>
#include "RSAKeyGenerator.hpp"
#include "RSAKeyExporter.hpp"
#include "RSAEncryptor.hpp"
#include "Base64.hpp"
#include "RSACertificateManager.hpp"
#include "RSASignatureManager.hpp"

int main() {
    using MyType = mpz_class;

    std::cout << "Generating RSA keys...\n";
    MyType min = mpz_class(1) << 2023;
    MyType max = (mpz_class(1) << 2024) - 1;
    auto [publicKey, privateKey] = RSAKeyGenerator<MyType>::generateKeys(min, max);

    MyType e = publicKey.first;
    MyType n = publicKey.second;
    MyType d = privateKey.first;

    std::cout << "Public Key: (e=" << e << ", n=" << n << ")\n";
    std::cout << "Private Key: (d=" << d << ", n=" << n << ")\n\n";

    std::string publicKeyPGP = RSAKeyExporter<MyType, PGPFormat>::exportPublicKey(publicKey);
    std::string privateKeyPGP = RSAKeyExporter<MyType, PGPFormat>::exportPrivateKey(privateKey);
    std::cout << "Exported Public Key (PGP):\n" << publicKeyPGP << "\n\n";
    std::cout << "Exported Private Key (PGP):\n" << privateKeyPGP << "\n\n";

    std::string publicKeyJSON = RSAKeyExporter<MyType, JSONFormat>::exportPublicKey(publicKey);
    std::string privateKeyJSON = RSAKeyExporter<MyType, JSONFormat>::exportPrivateKey(privateKey);
    std::cout << "Exported Public Key (JSON):\n" << publicKeyJSON << "\n\n";
    std::cout << "Exported Private Key (JSON):\n" << privateKeyJSON << "\n\n";

    auto importedPublicKey = RSAKeyGenerator<MyType>::importPublicKeyFromJSON(publicKeyJSON);
    auto importedPrivateKey = RSAKeyGenerator<MyType>::importPrivateKeyFromJSON(privateKeyJSON);
    std::cout << "Imported Public Key: (e=" << importedPublicKey.first
              << ", n=" << importedPublicKey.second << ")\n";
    std::cout << "Imported Private Key: (d=" << importedPrivateKey.first
              << ", n=" << importedPrivateKey.second << ")\n\n";

    RSACertificate<MyType> certificate("John Doe", publicKey, d, n);

    std::string certificatePGP = certificate.exportCertificate<PGPFormat>();
    std::cout << "Exported Certificate (PGP):\n" << certificatePGP << "\n\n";

    std::string certificateJSON = certificate.exportCertificate<JSONFormat>();
    std::cout << "Exported Certificate (JSON):\n" << certificateJSON << "\n\n";

    auto importedCertificatePGP = RSACertificate<MyType>::importCertificate<PGPFormat>(certificatePGP);
    std::cout << "Imported Certificate (PGP):\n";
    importedCertificatePGP.display();


    auto importedCertificateJSON = RSACertificate<MyType>::importCertificate<JSONFormat>(certificateJSON);
    std::cout << "\nImported Certificate (JSON):\n";
    importedCertificateJSON.display();

    std::string message = "Hello, RSA!";
    auto signature = RSAEncryptor<MyType>::generateSignature(message, d, n);
    std::cout << "\nGenerated Signature for message: " << message << "\n" << signature << "\n\n";

    bool isValidSignature = RSAEncryptor<MyType>::verifySignature(signature, message, e, n);
    std::cout << "Signature Valid: " << (isValidSignature ? "Yes" : "No") << "\n\n";

    std::string signaturePGP = RSASignatureManager<MyType>::exportSignature<PGPFormat>(signature, message);
    std::cout << "Exported Signature (PGP):\n" << signaturePGP << "\n\n";

    std::string signatureJSON = RSASignatureManager<MyType>::exportSignature<JSONFormat>(signature, message);
    std::cout << "Exported Signature (JSON):\n" << signatureJSON << "\n\n";


    auto [importedSignaturePGP, importedMessagePGP] =
        RSASignatureManager<MyType>::importSignature<PGPFormat>(signaturePGP);
    bool isImportedPGPValid = RSAEncryptor<MyType>::verifySignature(importedSignaturePGP, importedMessagePGP, e, n);
    std::cout << "Imported Signature (PGP) Valid: " << (isImportedPGPValid ? "Yes" : "No") << "\n\n";

    auto [importedSignatureJSON, importedMessageJSON] =
        RSASignatureManager<MyType>::importSignature<JSONFormat>(signatureJSON);
    bool isImportedJSONValid = RSAEncryptor<MyType>::verifySignature(importedSignatureJSON, importedMessageJSON, e, n);
    std::cout << "Imported Signature (JSON) Valid: " << (isImportedJSONValid ? "Yes" : "No") << "\n";

    return 0;
}