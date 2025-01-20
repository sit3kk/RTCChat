#ifndef RSA_KEY_EXPORTER_TPP
#define RSA_KEY_EXPORTER_TPP

#include "RSAKeyExporter.hpp"
#include <sstream>

template <typename T, typename Format>
std::string RSAKeyExporter<T, Format>::exportKey(const std::pair<T, T>& key) {
    std::ostringstream oss;

    if constexpr (std::is_same_v<Format, PGPFormat>) {
        oss << KeyFormatTraits<Format>::begin << "\n";
        oss << "e: " << key.first << "\n";
        oss << "n: " << key.second << "\n";
        oss << KeyFormatTraits<Format>::end;
    } else if constexpr (std::is_same_v<Format, JSONFormat>) {
        oss << KeyFormatTraits<Format>::begin << "\n";
        oss << "  \"e\": \"" << key.first << "\",\n";
        oss << "  \"n\": \"" << key.second << "\"\n";
        oss << KeyFormatTraits<Format>::end;
    } else {
        static_assert(always_false<Format>::value, "Unsupported format specified for RSAKeyExporter.");
    }

    return oss.str();
}

template<typename T, typename Format>
std::string RSAKeyExporter<T, Format>::exportPublicKey(const std::pair<T, T>& publicKey) {
    if constexpr (std::is_same_v<Format, PGPFormat>) {
        return exportPGPPublicKey(publicKey);
    } 
    else {
        std::ostringstream oss;
        oss << "{\n";
        oss << "  \"e\": \"" << publicKey.first.get_str() << "\",\n";
        oss << "  \"n\": \"" << publicKey.second.get_str() << "\"\n";
        oss << "}\n";
        return oss.str();
    }
}

template<typename T, typename Format>
std::string RSAKeyExporter<T, Format>::exportPrivateKey(const std::pair<T, T>& privateKey) {
    if constexpr (std::is_same_v<Format, PGPFormat>) {
        return exportPGPPrivateKey(privateKey);
    }
    else {
        std::ostringstream oss;
        oss << "{\n";
        oss << "  \"d\": \"" << privateKey.first.get_str() << "\",\n";
        oss << "  \"n\": \"" << privateKey.second.get_str() << "\"\n";
        oss << "}\n";
        return oss.str();
    }
}

#endif // RSA_KEY_EXPORTER_TPP

