#include <sstream>

template <typename T, typename Format>
std::string RSAKeyExporter<T, Format>::exportKey(const std::pair<T, T>& key) {
    if constexpr (std::is_same_v<Format, PGPFormat>) {
        std::ostringstream oss;
        oss << KeyFormatTraits<Format>::begin << "\n";
        oss << "e: " << key.first << ", n: " << key.second << "\n";
        oss << KeyFormatTraits<Format>::end;
        return oss.str();
    } else if constexpr (std::is_same_v<Format, JSONFormat>) {
        std::ostringstream oss;
        oss << KeyFormatTraits<Format>::begin << "\n";
        oss << "  \"e\": \"" << key.first << "\",\n";
        oss << "  \"n\": \"" << key.second << "\"\n";
        oss << KeyFormatTraits<Format>::end;
        return oss.str();
    }
}

template <typename T, typename Format>
std::string RSAKeyExporter<T, Format>::exportPublicKey(const std::pair<T, T>& publicKey) {
    return exportKey(publicKey);
}

template <typename T, typename Format>
std::string RSAKeyExporter<T, Format>::exportPrivateKey(const std::pair<T, T>& privateKey) {
    return exportKey(privateKey);
}