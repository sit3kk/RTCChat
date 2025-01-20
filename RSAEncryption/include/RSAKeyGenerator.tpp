#include "PrimeUtils.hpp"
#include <stdexcept>

template <typename T>
std::pair<std::pair<T, T>, std::pair<T, T>> RSAKeyGenerator<T>::generateKeys(T min, T max) {
    T p, q;
    do {
        p = PrimeUtils<T>::generateRandomPrime(min, max);
        q = PrimeUtils<T>::generateRandomPrime(min, max);
    } while (p == q);

    T n = p * q;
    T phi = (p - 1) * (q - 1);

    T e = 65537;
    if (PrimeUtils<T>::gcd(e, phi) != 1) {
        throw std::runtime_error("e and phi(n) are not coprime");
    }

    T d = PrimeUtils<T>::modInverse(e, phi);

    // Return (publicKey, privateKey)
    //   publicKey = (e, n)
    //   privateKey = (d, n)
    return {{e, n}, {d, n}};
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
std::pair<T, T> RSAKeyGenerator<T>::importPrivateKeyFromJSON(const std::string& json) {
    auto dPos = json.find("\"d\":");
    auto nPos = json.find("\"n\":");

    if (dPos == std::string::npos || nPos == std::string::npos) {
        throw std::invalid_argument("Invalid JSON format for private key");
    }

    auto dStart = json.find("\"", dPos + 4) + 1;
    auto dEnd   = json.find("\"", dStart);
    auto nStart = json.find("\"", nPos + 4) + 1;
    auto nEnd   = json.find("\"", nStart);

    if (dStart == std::string::npos || dEnd == std::string::npos ||
        nStart == std::string::npos || nEnd == std::string::npos) {
        throw std::invalid_argument("Invalid JSON format for private key");
    }

    T dVal = T(json.substr(dStart, dEnd - dStart));
    T nVal = T(json.substr(nStart, nEnd - nStart));

    return { dVal, nVal };
}