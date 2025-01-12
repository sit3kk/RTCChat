#pragma once

#include "BigIntUtils.hpp"
#include <sstream>
#include <stdexcept>
#include <vector>

template <typename T>
T RSAEncryptor<T>::encryptNumber(T data, T e, T n) {
    return BigIntUtils<T>::modExp(data, e, n);
}

template <typename T>
T RSAEncryptor<T>::decryptNumber(T data, T d, T n) {
    return BigIntUtils<T>::modExp(data, d, n);
}

template <typename T>
std::vector<T> RSAEncryptor<T>::encryptMessage(const std::string& message, T e, T n) {
    std::vector<T> encryptedBlocks;
    for (char c : message) {
        T encryptedChar = encryptNumber(static_cast<T>(c), e, n);
        encryptedBlocks.push_back(encryptedChar);
    }
    return encryptedBlocks;
}

template <typename T>
std::string RSAEncryptor<T>::decryptMessage(const std::vector<T>& encryptedBlocks, T d, T n) {
    std::ostringstream oss;
    for (T block : encryptedBlocks) {
        char decryptedChar = static_cast<char>(decryptNumber(block, d, n).get_si());
        oss << decryptedChar;
    }
    return oss.str();
}

template <typename T>
T RSAEncryptor<T>::generateSignature(const std::string& message, T privateKey, T n) {
    T hash = static_cast<T>(std::hash<std::string>{}(message));
    return BigIntUtils<T>::modExp(hash, privateKey, n);
}

template <typename T>
bool RSAEncryptor<T>::verifySignature(T signature, const std::string& message, T publicKey, T n) {
    T hash = static_cast<T>(std::hash<std::string>{}(message));
    T decryptedHash = BigIntUtils<T>::modExp(signature, publicKey, n);
    return hash == decryptedHash;
}