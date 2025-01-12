#include "PrimeUtils.hpp"

template <typename T>
std::pair<typename RSAKeyGenerator<T>::PublicKey, typename RSAKeyGenerator<T>::PrivateKey>
RSAKeyGenerator<T>::generateKeys(T minPrime, T maxPrime) {
    T p = PrimeUtils<T>::generateRandomPrime(minPrime, maxPrime);
    T q = PrimeUtils<T>::generateRandomPrime(minPrime, maxPrime);

    T n = p * q;
    T phi = (p - 1) * (q - 1);

    T e = 65537;
    if (PrimeUtils<T>::gcd(e, phi) != 1) {
        throw std::runtime_error("e and phi(n) are not coprime");
    }

    T d = PrimeUtils<T>::modInverse(e, phi);

    return { { e, n }, { d, n } };
}

template <typename T>
typename RSAKeyGenerator<T>::PublicKey
RSAKeyGenerator<T>::importPublicKeyFromJSON(const std::string& json) {
    size_t ePos = json.find("\"e\":");
    size_t nPos = json.find("\"n\":");
    if (ePos == std::string::npos || nPos == std::string::npos) {
        throw std::invalid_argument("Invalid JSON format for public key");
    }

    size_t eStart = json.find("\"", ePos + 4) + 1;
    size_t eEnd = json.find("\"", eStart);
    size_t nStart = json.find("\"", nPos + 4) + 1;
    size_t nEnd = json.find("\"", nStart);

    T e = T(json.substr(eStart, eEnd - eStart));
    T n = T(json.substr(nStart, nEnd - nStart));

    return { e, n };
}

template <typename T>
typename RSAKeyGenerator<T>::PrivateKey
RSAKeyGenerator<T>::importPrivateKeyFromJSON(const std::string& json) {
    size_t dPos = json.find("\"d\":");
    size_t nPos = json.find("\"n\":");
    if (dPos == std::string::npos || nPos == std::string::npos) {
        throw std::invalid_argument("Invalid JSON format for private key");
    }

    size_t dStart = json.find("\"", dPos + 4) + 1;
    size_t dEnd = json.find("\"", dStart);
    size_t nStart = json.find("\"", nPos + 4) + 1;
    size_t nEnd = json.find("\"", nStart);

    T d = T(json.substr(dStart, dEnd - dStart));
    T n = T(json.substr(nStart, nEnd - nStart));

    return { d, n };
}