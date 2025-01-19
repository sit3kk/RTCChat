#ifndef RSA_KEY_EXPORTER_HPP
#define RSA_KEY_EXPORTER_HPP

#include <string>
#include <utility>
#include <sstream>

// Traits for serialization formats
template <typename Format>
struct KeyFormatTraits;

struct PGPFormat {};
struct JSONFormat {};

// Specialization for PGP format
template <>
struct KeyFormatTraits<PGPFormat> {
    static constexpr const char* begin = "-----BEGIN PGP KEY BLOCK-----";
    static constexpr const char* end = "-----END PGP KEY BLOCK-----";
};

// Specialization for JSON format
template <>
struct KeyFormatTraits<JSONFormat> {
    static constexpr const char* begin = "{";
    static constexpr const char* end = "}";
};

// Template class for exporting keys
template <typename T, typename Format>
class RSAKeyExporter {
public:
    static std::string exportKey(const std::pair<T, T>& key);
    static std::string exportPublicKey(const std::pair<T, T>& publicKey);
    static std::string exportPrivateKey(const std::pair<T, T>& privateKey);
};

#include "RSAKeyExporter.tpp"

#endif // RSA_KEY_EXPORTER_HPP

