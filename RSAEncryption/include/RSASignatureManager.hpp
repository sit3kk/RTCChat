#ifndef RSA_SIGNATURE_MANAGER_HPP
#define RSA_SIGNATURE_MANAGER_HPP

#include <string>
#include <sstream>
#include <utility>
#include <vector>
#include "Base64.hpp"
#include "PGPFormatter.hpp"

template <typename T>
class RSASignatureManager {
public:
    template <typename Format>
    static std::string exportSignature(const T& signature, const std::string& message);

    template <typename Format>
    static std::pair<T, std::string> importSignature(const std::string& encodedSignature);
};

#include "RSASignatureManager.tpp"

#endif // RSA_SIGNATURE_MANAGER_HPP