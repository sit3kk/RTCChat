#include "Base64.hpp"

template <typename T>
std::string RSAKeyExporter<T>::exportPublicKeyPGP(const std::pair<T, T>& publicKey) {
    std::ostringstream oss;
    oss << "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n";

    std::vector<uint8_t> keyData;
    std::string e_str = publicKey.first.get_str();
    std::string n_str = publicKey.second.get_str();

    keyData.insert(keyData.end(), e_str.begin(), e_str.end());
    keyData.insert(keyData.end(), n_str.begin(), n_str.end());

    std::string encodedKey = Base64::encode(keyData);

    for (size_t i = 0; i < encodedKey.size(); i += 64) {
        oss << encodedKey.substr(i, 64) << "\n";
    }

    oss << "-----END PGP PUBLIC KEY BLOCK-----";
    return oss.str();
}

template <typename T>
std::string RSAKeyExporter<T>::exportPrivateKeyPGP(const std::pair<T, T>& privateKey) {
    std::ostringstream oss;
    oss << "-----BEGIN PGP PRIVATE KEY BLOCK-----\n\n";

    std::vector<uint8_t> keyData;
    std::string d_str = privateKey.first.get_str();
    std::string n_str = privateKey.second.get_str();

    keyData.insert(keyData.end(), d_str.begin(), d_str.end());
    keyData.insert(keyData.end(), n_str.begin(), n_str.end());

    std::string encodedKey = Base64::encode(keyData);

    for (size_t i = 0; i < encodedKey.size(); i += 64) {
        oss << encodedKey.substr(i, 64) << "\n";
    }

    oss << "-----END PGP PRIVATE KEY BLOCK-----";
    return oss.str();
}

template <typename T>
std::string RSAKeyExporter<T>::exportPublicKeyToJSON(const std::pair<T, T>& publicKey) {
    std::ostringstream oss;
    oss << "{ \"e\": \"" << publicKey.first.get_str() << "\", \"n\": \"" << publicKey.second.get_str() << "\" }";
    return oss.str();
}

template <typename T>
std::string RSAKeyExporter<T>::exportPrivateKeyToJSON(const std::pair<T, T>& privateKey) {
    std::ostringstream oss;
    oss << "{ \"d\": \"" << privateKey.first.get_str() << "\", \"n\": \"" << privateKey.second.get_str() << "\" }";
    return oss.str();
}