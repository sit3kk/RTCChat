#ifndef RSA_CERTIFICATE_MANAGER_HPP
#define RSA_CERTIFICATE_MANAGER_HPP

#include <string>
#include <utility>
#include <vector>
#include "RSAEncryptor.hpp"
#include "RSAKeyExporter.hpp"
#include "Base64.hpp"
#include "PGPFormatter.hpp"

template <typename T>
class RSACertificate {
private:
    std::string ownerName;
    std::pair<T, T> publicKey;
    T signature;

public:
    RSACertificate(const std::string& ownerName, const std::pair<T, T>& publicKey, const T& privateKey, const T& n);

    const std::string& getOwnerName() const;
    const std::pair<T, T>& getPublicKey() const;
    const T& getSignature() const;

    template <typename Format>
    std::string exportCertificate() const;

    template <typename Format>
    static RSACertificate<T> importCertificate(const std::string& data);

    void display() const;
};

#include "RSACertificateManager.tpp"

#endif // RSA_CERTIFICATE_MANAGER_HPP