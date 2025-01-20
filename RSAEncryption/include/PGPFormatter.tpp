#pragma once

#include "PGPFormatter.hpp"
#include "Base64.hpp" 
#include <sstream>
#include <vector>
#include <cstdint>

static std::string wrap64(const std::string &data) {
    constexpr size_t wrapAt = 64;
    std::ostringstream oss;
    for (size_t i = 0; i < data.size(); i += wrapAt) {
        oss << data.substr(i, wrapAt) << "\n";
    }
    return oss.str();
}

inline std::string exportPGPMessage(const std::string &message) {
    std::vector<uint8_t> rawBytes(message.begin(), message.end());
    std::string encoded = Base64::encode(rawBytes);

    std::ostringstream oss;
    oss << "-----BEGIN PGP MESSAGE-----\n"
        << wrap64(encoded)
        << "-----END PGP MESSAGE-----";
    return oss.str();
}

inline std::string importPGPMessage(const std::string &pgpMessage) {
    size_t beginPos = pgpMessage.find("-----BEGIN PGP MESSAGE-----");
    size_t endPos = pgpMessage.find("-----END PGP MESSAGE-----");
    if (beginPos == std::string::npos || endPos == std::string::npos) {
        throw std::invalid_argument("Invalid PGP message format");
    }

    beginPos += std::string("-----BEGIN PGP MESSAGE-----").length();
    std::string base64Content = pgpMessage.substr(beginPos, endPos - beginPos);
    base64Content.erase(remove(base64Content.begin(), base64Content.end(), '\n'), base64Content.end());

    std::vector<uint8_t> decoded = Base64::decode(base64Content);
    return std::string(decoded.begin(), decoded.end());
}

template <typename T>
std::string exportPGPPublicKey(const std::pair<T, T> &publicKey) {
    std::string text = "e=" + publicKey.first.get_str() 
                     + ",n=" + publicKey.second.get_str();

    std::vector<uint8_t> rawBytes(text.begin(), text.end());
    std::string encoded = Base64::encode(rawBytes);

    std::ostringstream oss;
    oss << "-----BEGIN PGP PUBLIC KEY-----\n"
        << wrap64(encoded)
        << "-----END PGP PUBLIC KEY-----";
    return oss.str();
}

template <typename T>
std::string exportPGPPrivateKey(const std::pair<T, T> &privateKey) {
    std::string text = "d=" + privateKey.first.get_str()
                     + ",n=" + privateKey.second.get_str();

    std::vector<uint8_t> rawBytes(text.begin(), text.end());
    std::string encoded = Base64::encode(rawBytes);

    std::ostringstream oss;
    oss << "-----BEGIN PGP PRIVATE KEY-----\n"
        << wrap64(encoded)
        << "-----END PGP PRIVATE KEY-----";
    return oss.str();
}