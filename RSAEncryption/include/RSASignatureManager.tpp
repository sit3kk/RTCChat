#ifndef RSA_SIGNATURE_MANAGER_TPP
#define RSA_SIGNATURE_MANAGER_TPP

#include "RSASignatureManager.hpp"
#include <stdexcept>
#include <nlohmann/json.hpp> 
using json = nlohmann::json;

template <typename T>
template <typename Format>
std::string RSASignatureManager<T>::exportSignature(const T& signature, const std::string& message) {
    std::ostringstream oss;

    if constexpr (std::is_same_v<Format, PGPFormat>) {
        std::string signatureData = "Message: " + message + "\nSignature: " + signature.get_str();
        return exportPGPMessage(signatureData);
    } else if constexpr (std::is_same_v<Format, JSONFormat>) {
        json j;
        j["message"] = message;
        j["signature"] = signature.get_str();
        return j.dump(4); // Formatowanie z wcięciami
    } else {
        throw std::invalid_argument("Unsupported format for signature export.");
    }
}

template <typename T>
template <typename Format>
std::pair<T, std::string> RSASignatureManager<T>::importSignature(const std::string& encodedSignature) {
    if constexpr (std::is_same_v<Format, PGPFormat>) {
        std::string decoded = importPGPMessage(encodedSignature);
        std::istringstream iss(decoded);

        std::string messageLine, signatureLine;
        std::getline(iss, messageLine);
        std::getline(iss, signatureLine);

        if (messageLine.rfind("Message: ", 0) != 0 || signatureLine.rfind("Signature: ", 0) != 0) {
            throw std::invalid_argument("Invalid PGP signature format.");
        }

        std::string message = messageLine.substr(9); 
        T signature(signatureLine.substr(11));    
        return {signature, message};
    } else if constexpr (std::is_same_v<Format, JSONFormat>) {
        json j = json::parse(encodedSignature);
        std::string message = j.at("message").get<std::string>();
        T signature(j.at("signature").get<std::string>());
        return {signature, message};
    } else {
        throw std::invalid_argument("Unsupported format for signature import.");
    }
}

#endif // RSA_SIGNATURE_MANAGER_TPP