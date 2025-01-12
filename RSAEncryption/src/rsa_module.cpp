#include <string>
#include <vector>
#include <sstream>
#include "RSAKeyGenerator.hpp"
#include "RSAEncryptor.hpp"
#include "RSAKeyExporter.hpp"
#include <gmpxx.h>

extern "C" {

const char* generateKeys(int minPrimeBits) {
    using MyType = mpz_class;
    MyType min = MyType(1) << (minPrimeBits - 1);
    MyType max = (MyType(1) << minPrimeBits) - 1;

    auto [publicKey, privateKey] = RSAKeyGenerator<MyType>::generateKeys(min, max);
    std::string publicKeyJSON = RSAKeyExporter<MyType>::exportPublicKeyToJSON(publicKey);
    std::string privateKeyJSON = RSAKeyExporter<MyType>::exportPrivateKeyToJSON(privateKey);

    std::string result = "{\"publicKey\": " + publicKeyJSON + ", \"privateKey\": " + privateKeyJSON + "}";
    return strdup(result.c_str());
}

const char* encryptMessage(const char* message, const char* publicKeyJSON) {
    using MyType = mpz_class;

    auto publicKey = RSAKeyGenerator<MyType>::importPublicKeyFromJSON(publicKeyJSON);
    MyType e = publicKey.first;
    MyType n = publicKey.second;

    auto encryptedBlocks = RSAEncryptor<MyType>::encryptMessage(std::string(message), e, n);

    std::string encrypted;
    for (const auto& block : encryptedBlocks) {
        encrypted += block.get_str() + ",";
    }

    return strdup(encrypted.c_str());
}

const char* decryptMessage(const char* encryptedMessage, const char* privateKeyJSON) {
    using MyType = mpz_class;

    auto privateKey = RSAKeyGenerator<MyType>::importPrivateKeyFromJSON(privateKeyJSON);
    MyType d = privateKey.first;
    MyType n = privateKey.second;

    std::vector<MyType> encryptedBlocks;
    std::istringstream iss(std::string(encryptedMessage));
    std::string block;
    while (std::getline(iss, block, ',')) {
        encryptedBlocks.emplace_back(block);
    }

    std::string decryptedMessage = RSAEncryptor<MyType>::decryptMessage(encryptedBlocks, d, n);
    return strdup(decryptedMessage.c_str());
}

const char* generateSignature(const char* message, const char* privateKeyJSON) {
    using MyType = mpz_class;

    auto privateKey = RSAKeyGenerator<MyType>::importPrivateKeyFromJSON(privateKeyJSON);
    MyType d = privateKey.first;
    MyType n = privateKey.second;

    MyType signature = RSAEncryptor<MyType>::generateSignature(std::string(message), d, n);
    return strdup(signature.get_str().c_str());
}

bool verifySignature(const char* signatureStr, const char* message, const char* publicKeyJSON) {
    using MyType = mpz_class;

    auto publicKey = RSAKeyGenerator<MyType>::importPublicKeyFromJSON(publicKeyJSON);
    MyType e = publicKey.first;
    MyType n = publicKey.second;

    MyType signature(signatureStr);
    return RSAEncryptor<MyType>::verifySignature(signature, std::string(message), e, n);
}
}