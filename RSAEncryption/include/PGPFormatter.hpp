#ifndef PGP_FORMATTER_HPP
#define PGP_FORMATTER_HPP

#include <string>
#include <vector>

constexpr const char* PGP_MESSAGE_BEGIN = "-----BEGIN PGP MESSAGE-----";
constexpr const char* PGP_MESSAGE_END = "-----END PGP MESSAGE-----";
constexpr const char* PGP_PUBLIC_KEY_BEGIN = "-----BEGIN PGP PUBLIC KEY-----";
constexpr const char* PGP_PUBLIC_KEY_END = "-----END PGP PUBLIC KEY-----";

constexpr const char* PGP_CERTIFICATE_BEGIN = "-----BEGIN PGP CERTIFICATE-----";
constexpr const char* PGP_CERTIFICATE_END = "-----END PGP CERTIFICATE-----";

template <typename T>
std::string exportPGPCertificate(const std::string& ownerName, const std::pair<T, T>& publicKey, const T& signature);

template <typename T>
std::tuple<std::string, std::pair<T, T>, T> importPGPCertificate(const std::string& certificate);

#include "PGPFormatter.tpp"

#endif // PGP_FORMATTER_HPP