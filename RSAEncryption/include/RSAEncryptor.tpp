#ifndef RSA_ENCRYPTOR_TPP
#define RSA_ENCRYPTOR_TPP

#include "RSAEncryptor.hpp"
#include "BigIntUtils.hpp"
#include <sstream>

// Implementation of RSAEncryptor methods

template <Encryptable T>
T RSAEncryptor<T>::encryptNumber(T data, T e, T n) {
    return BigIntUtils<T>::modExp(data, e, n);
}

template <Encryptable T>
T RSAEncryptor<T>::decryptNumber(T data, T d, T n) {
    return BigIntUtils<T>::modExp(data, d, n);
}

template <Encryptable T>
std::vector<T> RSAEncryptor<T>::encryptMessage(const std::string& message, T e, T n) {
    std::vector<T> encryptedBlocks;
    for (char ch : message) {
        T block = static_cast<T>(ch);
        encryptedBlocks.push_back(encryptNumber(block, e, n));
    }
    return encryptedBlocks;
}

template <Encryptable T>
std::string RSAEncryptor<T>::decryptMessage(const std::vector<T>& encryptedBlocks, T d, T n) {
    std::ostringstream oss;
    for (const T& block : encryptedBlocks) {
        char decryptedChar = static_cast<char>(decryptNumber(block, d, n).get_ui());
        oss << decryptedChar;
    }
    return oss.str();
}

template <Encryptable T>
T RSAEncryptor<T>::generateSignature(const std::string& message, T privateKey, T n) {
    T hash = 0;
    for (char ch : message) {
        hash = (hash * 31 + ch) % n;
    }
    return BigIntUtils<T>::modExp(hash, privateKey, n);
}

template <Encryptable T>
bool RSAEncryptor<T>::verifySignature(T signature, const std::string& message, T publicKey, T n) {
    T hash = 0;
    for (char ch : message) {
        hash = (hash * 31 + ch) % n; // Prosty hash
    }
    T decryptedHash = BigIntUtils<T>::modExp(signature, publicKey, n);
    return hash == decryptedHash;
}

#endif // RSA_ENCRYPTOR_TPP