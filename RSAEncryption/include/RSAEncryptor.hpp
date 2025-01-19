#ifndef RSA_ENCRYPTOR_HPP
#define RSA_ENCRYPTOR_HPP

#include <concepts>
#include <vector>
#include <string>
#include "BigIntUtils.hpp"

// Concept for encryptable types
template <typename T>
concept Encryptable = requires(T a, T b, T c) {
    { BigIntUtils<T>::modExp(a, b, c) } -> std::convertible_to<T>;
};

template <Encryptable T>
class RSAEncryptor {
public:
    static T encryptNumber(T data, T e, T n);
    static T decryptNumber(T data, T d, T n);

    static std::vector<T> encryptMessage(const std::string& message, T e, T n);
    static std::string decryptMessage(const std::vector<T>& encryptedBlocks, T d, T n);

    static T generateSignature(const std::string& message, T privateKey, T n);
    static bool verifySignature(T signature, const std::string& message, T publicKey, T n);
};

#include "RSAEncryptor.tpp"

#endif // RSA_ENCRYPTOR_HPP