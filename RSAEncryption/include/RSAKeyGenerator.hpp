#ifndef RSA_KEY_GENERATOR_HPP
#define RSA_KEY_GENERATOR_HPP

#include <utility>
#include <string>

template <typename T>
class RSAKeyGenerator {
public:
    using PublicKey = std::pair<T, T>;
    using PrivateKey = std::pair<T, T>;

    static std::pair<PublicKey, PrivateKey> generateKeys(T minPrime, T maxPrime);
    static PublicKey importPublicKeyFromJSON(const std::string& json);
    static PrivateKey importPrivateKeyFromJSON(const std::string& json);

};

#include "RSAKeyGenerator.tpp"

#endif // RSA_KEY_GENERATOR_HPP