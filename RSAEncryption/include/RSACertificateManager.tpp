#ifndef RSA_CERTIFICATE_MANAGER_TPP
#define RSA_CERTIFICATE_MANAGER_TPP

#include "RSACertificateManager.hpp"

template <typename T>
RSACertificate<T>::RSACertificate(const std::string& ownerName, const std::pair<T, T>& publicKey, const T& privateKey, const T& n)
    : ownerName(ownerName), publicKey(publicKey) {
    std::string certificateData = ownerName + publicKey.first.get_str() + publicKey.second.get_str();
    signature = RSAEncryptor<T>::generateSignature(certificateData, privateKey, n);
}

template <typename T>
const std::string& RSACertificate<T>::getOwnerName() const {
    return ownerName;
}

template <typename T>
const std::pair<T, T>& RSACertificate<T>::getPublicKey() const {
    return publicKey;
}

template <typename T>
const T& RSACertificate<T>::getSignature() const {
    return signature;
}

template <typename T>
template <typename Format>
std::string RSACertificate<T>::exportCertificate() const {
    if constexpr (std::is_same_v<Format, PGPFormat>) {
        std::string data = ownerName + "\n" +
                           "e=" + publicKey.first.get_str() + "\n" +
                           "n=" + publicKey.second.get_str() + "\n" +
                           "signature=" + signature.get_str();
        return exportPGPMessage(data);
    } else if constexpr (std::is_same_v<Format, JSONFormat>) {
        std::ostringstream oss;
        oss << "{\n"
            << "  \"ownerName\": \"" << ownerName << "\",\n"
            << "  \"publicKey\": {\n"
            << "    \"e\": \"" << publicKey.first.get_str() << "\",\n"
            << "    \"n\": \"" << publicKey.second.get_str() << "\"\n"
            << "  },\n"
            << "  \"signature\": \"" << signature.get_str() << "\"\n"
            << "}";
        return oss.str();
    } else {
        throw std::invalid_argument("Unsupported format for certificate export");
    }
}

template <typename T>
template <typename Format>
RSACertificate<T> RSACertificate<T>::importCertificate(const std::string& data) {
    std::string ownerName;
    std::pair<T, T> publicKey;
    T signature;

    if constexpr (std::is_same_v<Format, PGPFormat>) {
        std::string decoded = importPGPMessage(data);
        size_t ownerEnd = decoded.find('\n');
        ownerName = decoded.substr(0, ownerEnd);

        size_t ePos = decoded.find("e=", ownerEnd) + 2;
        size_t nPos = decoded.find("n=", ePos);
        size_t sigPos = decoded.find("signature=", nPos);

        publicKey.first = T(decoded.substr(ePos, nPos - ePos - 1));
        publicKey.second = T(decoded.substr(nPos + 2, sigPos - nPos - 3));
        signature = T(decoded.substr(sigPos + 10));

    } else if constexpr (std::is_same_v<Format, JSONFormat>) {
        auto start = data.find("{");
        auto end = data.rfind("}");
        if (start == std::string::npos || end == std::string::npos) {
            throw std::invalid_argument("Invalid JSON certificate format");
        }

        auto ownerStart = data.find("\"ownerName\": \"", start) + 14;
        auto ownerEnd = data.find("\"", ownerStart);
        ownerName = data.substr(ownerStart, ownerEnd - ownerStart);

        auto eStart = data.find("\"e\": \"", ownerEnd) + 6;
        auto eEnd = data.find("\"", eStart);
        publicKey.first = T(data.substr(eStart, eEnd - eStart));

        auto nStart = data.find("\"n\": \"", eEnd) + 6;
        auto nEnd = data.find("\"", nStart);
        publicKey.second = T(data.substr(nStart, nEnd - nStart));

        auto sigStart = data.find("\"signature\": \"", nEnd) + 14;
        auto sigEnd = data.find("\"", sigStart);
        signature = T(data.substr(sigStart, sigEnd - sigStart));
    } else {
        throw std::invalid_argument("Unsupported format for certificate import");
    }

    return RSACertificate<T>(ownerName, publicKey, signature, publicKey.second);
}

template <typename T>
void RSACertificate<T>::display() const {
    std::cout << "Owner Name: " << ownerName << "\n"
              << "Public Key: (e=" << publicKey.first.get_str() << ", n=" << publicKey.second.get_str() << ")\n"
              << "Signature: " << signature.get_str() << "\n";
}

#endif // RSA_CERTIFICATE_MANAGER_TPP