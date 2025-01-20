#ifndef RSA_ENCRYPTOR_TPP
#define RSA_ENCRYPTOR_TPP

#include "RSAEncryptor.hpp"
#include "BigIntUtils.hpp"
#include "PaddingUtils.hpp"
#include <openssl/sha.h>
#include <sstream>
#include <vector>
#include <random>

static std::vector<uint8_t> generateRandomBytes(size_t length) {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<unsigned char> dist(1, 255);

    std::vector<uint8_t> randomBytes(length);
    for (auto &byte : randomBytes) {
        byte = dist(gen);
    }
    return randomBytes;
}

std::vector<uint8_t> sha256(const std::string& message) {
    std::vector<uint8_t> hash(SHA256_DIGEST_LENGTH);
    SHA256(reinterpret_cast<const uint8_t*>(message.data()), message.size(), hash.data());
    return hash;
}

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
    size_t bitSize = mpz_sizeinbase(n.get_mpz_t(), 2);
    size_t k = (bitSize + 7) / 8; 

    if (k < 11) {
        throw std::runtime_error("encryptMessage: Key size too small for PKCS#1 v1.5");
    }

    size_t maxDataPerBlock = k - 11; 
    std::vector<std::string> chunks;

    std::string paddedMessage = addPadding(message, k - 11);

    for (size_t i = 0; i < paddedMessage.size(); i += maxDataPerBlock) {
    chunks.push_back(paddedMessage.substr(i, maxDataPerBlock));
    }

    std::vector<T> encryptedBlocks;

    for (const auto& chunk : chunks) {
        std::vector<uint8_t> block(k, 0x00);
        block[1] = 0x02;

        auto padding = generateRandomBytes(k - 3 - chunk.size());
        std::copy(padding.begin(), padding.end(), block.begin() + 2);

        block[2 + padding.size()] = 0x00;

        std::copy(chunk.begin(), chunk.end(), block.begin() + 3 + padding.size());

        T m = 0;
        for (auto byte : block) {
            m = (m << 8) | byte;
        }

        encryptedBlocks.push_back(encryptNumber(m, e, n));
    }

    return encryptedBlocks;
}

template <Encryptable T>
std::string RSAEncryptor<T>::decryptMessage(const std::vector<T>& encryptedBlocks, T d, T n) {
    size_t bitSize = mpz_sizeinbase(n.get_mpz_t(), 2);
    size_t k = (bitSize + 7) / 8;

    std::ostringstream oss;

    for (const T& block : encryptedBlocks) {
        T m = decryptNumber(block, d, n);

        std::vector<uint8_t> data(k, 0x00);
        for (int i = k - 1; i >= 0 && m > 0; --i) {
            data[i] = static_cast<uint8_t>(m.get_ui() & 0xFF);
            m >>= 8;
        }

        if (data.size() < 11 || data[0] != 0x00 || data[1] != 0x02) {
            throw std::runtime_error("decryptMessage: Invalid PKCS#1 v1.5 padding");
        }

        size_t sepPos = 0;
        for (size_t i = 2; i < data.size(); ++i) {
            if (data[i] == 0x00) {
                sepPos = i;
                break;
            }
        }
        if (sepPos == 0 || sepPos < 10) {
            throw std::runtime_error("decryptMessage: Invalid PKCS#1 v1.5 padding (separator not found)");
        }

        oss.write(reinterpret_cast<const char*>(&data[sepPos + 1]), data.size() - sepPos - 1);
    }

    std::string decryptedMessage = oss.str();
    return removePadding(decryptedMessage);
}

template <Encryptable T>
T RSAEncryptor<T>::generateSignature(const std::string& message, T privateKey, T n) {
    auto hash = sha256(message);

    T hashInt = 0;
    for (uint8_t byte : hash) {
        hashInt = (hashInt << 8) | byte; 
        hashInt %= n; 
    }

    return BigIntUtils<T>::modExp(hashInt, privateKey, n);
}

template <Encryptable T>
bool RSAEncryptor<T>::verifySignature(T signature, const std::string& message, T publicKey, T n) {
    auto hash = sha256(message);

    T hashInt = 0;
    for (uint8_t byte : hash) {
        hashInt = (hashInt << 8) | byte;
        hashInt %= n;
    }

    T decryptedHash = BigIntUtils<T>::modExp(signature, publicKey, n);

    return hashInt == decryptedHash;
}

template <typename Format, typename T>
std::string exportEncryptedMessage(const std::vector<T> &encryptedBlocks) {
    std::ostringstream oss;
    if constexpr (std::is_same_v<Format, PGPFormat>) {
        std::string concatenatedBlocks;
        for (const auto &block : encryptedBlocks) {
            concatenatedBlocks += block.get_str();
        }
        return exportPGPMessage(concatenatedBlocks);
    } else if constexpr (std::is_same_v<Format, JSONFormat>) {
        oss << "[";
        for (size_t i = 0; i < encryptedBlocks.size(); ++i) {
            oss << "\"" << encryptedBlocks[i].get_str() << "\"";
            if (i != encryptedBlocks.size() - 1) oss << ",";
        }
        oss << "]";
        return oss.str();
    }
    throw std::invalid_argument("Unsupported format for encrypted message export");
}

template <typename Format, typename T>
std::vector<T> importEncryptedMessage(const std::string &message) {
    std::vector<T> encryptedBlocks;
    if constexpr (std::is_same_v<Format, PGPFormat>) {
        std::string decodedMessage = importPGPMessage(message);
        encryptedBlocks.push_back(T(decodedMessage));
    } else if constexpr (std::is_same_v<Format, JSONFormat>) {
        size_t start = message.find('[');
        size_t end = message.find(']');
        if (start == std::string::npos || end == std::string::npos) {
            throw std::invalid_argument("Invalid JSON message format");
        }
        std::string content = message.substr(start + 1, end - start - 1);
        size_t pos = 0;
        while ((pos = content.find(',')) != std::string::npos) {
            std::string block = content.substr(0, pos);
            encryptedBlocks.push_back(T(block.substr(1, block.size() - 2)));
            content.erase(0, pos + 1);
        }
        if (!content.empty()) {
            encryptedBlocks.push_back(T(content.substr(1, content.size() - 2)));
        }
    } else {
        throw std::invalid_argument("Unsupported format for encrypted message import");
    }
    return encryptedBlocks;
}

#endif // RSA_ENCRYPTOR_TPP