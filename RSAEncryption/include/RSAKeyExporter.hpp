#ifndef RSA_KEY_EXPORTER_HPP
#define RSA_KEY_EXPORTER_HPP

#include "Base64.hpp"
#include <string>
#include <vector>
#include <sstream>

template <typename T>
class RSAKeyExporter {
public:
    static std::string exportPublicKeyPGP(const std::pair<T, T>& publicKey);
    static std::string exportPrivateKeyPGP(const std::pair<T, T>& privateKey);
    static std::string exportPublicKeyToJSON(const std::pair<T, T>& publicKey);
    static std::string exportPrivateKeyToJSON(const std::pair<T, T>& privateKey);
};

#include "RSAKeyExporter.tpp"

#endif // RSA_KEY_EXPORTER_HPP