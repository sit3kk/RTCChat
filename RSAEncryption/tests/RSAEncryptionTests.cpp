#include <gtest/gtest.h>
#include "RSAKeyGenerator.hpp"
#include "RSAKeyExporter.hpp"
#include "RSAEncryptor.hpp"
#include "RSACertificateManager.hpp"

TEST(RSAKeyGenerator, GeneratesKeys) {
    using MyType = mpz_class;
    MyType min = mpz_class(1) << 512;
    MyType max = (mpz_class(1) << 513) - 1;

    auto [publicKey, privateKey] = RSAKeyGenerator<MyType>::generateKeys(min, max);
    ASSERT_EQ(publicKey.first, 65537);

    ASSERT_GT(publicKey.second, min * min);

    ASSERT_GT(privateKey.first, 0);

    std::cout << "Generated public key: (e=" << publicKey.first
              << ", n=" << publicKey.second << ")" << std::endl;
    std::cout << "Generated private key: (d=" << privateKey.first
              << ", n=" << privateKey.second << ")" << std::endl;
}

TEST(RSACertificateManager, CreatesValidCertificate) {
    using MyType = mpz_class;
    auto [publicKey, privateKey] = RSAKeyGenerator<MyType>::generateKeys(mpz_class(1) << 512, (mpz_class(1) << 513) - 1);

    RSACertificate<MyType> cert("John Doe", publicKey, privateKey.first, publicKey.second);
    ASSERT_EQ(cert.getOwnerName(), "John Doe");
    ASSERT_EQ(cert.getPublicKey().first, publicKey.first);
    ASSERT_EQ(cert.getPublicKey().second, publicKey.second);
}

TEST(RSACertificateManager, VerifiesSignature) {
    using MyType = mpz_class;
    auto [publicKey, privateKey] = RSAKeyGenerator<MyType>::generateKeys(mpz_class(1) << 512, (mpz_class(1) << 513) - 1);

    std::string message = "Hello, RSA!";
    MyType signature = RSAEncryptor<MyType>::generateSignature(message, privateKey.first, publicKey.second);

    bool valid = RSAEncryptor<MyType>::verifySignature(signature, message, publicKey.first, publicKey.second);
    ASSERT_TRUE(valid);
}