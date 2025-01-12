#ifndef PRIME_UTILS_TPP
#define PRIME_UTILS_TPP

#include <random>
#include <stdexcept>
#include <cmath>

template <typename T>
bool PrimeUtils<T>::isPrime(T num) {
    if (num <= 1) return false;
    for (T i = 2; i <= static_cast<T>(std::sqrt(num)); ++i) {
        if (num % i == 0) return false;
    }
    return true;
}

template <typename T>
T PrimeUtils<T>::generateRandomPrime(T min, T max) {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<T> dist(min, max);

    T candidate;
    do {
        candidate = dist(gen);
    } while (!isPrime(candidate));
    return candidate;
}

template <typename T>
T PrimeUtils<T>::gcd(T a, T b) {
    while (b != 0) {
        T temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

template <typename T>
T PrimeUtils<T>::modInverse(T e, T phi) {
    T phi0 = phi, x0 = 0, x1 = 1;

    while (e > 1) {
        T q = e / phi;
        T temp = phi;
        phi = e % phi;
        e = temp;

        temp = x0;
        x0 = x1 - q * x0;
        x1 = temp;
    }
    if (x1 < 0) x1 += phi0;
    return x1;
}

template <>
bool PrimeUtils<mpz_class>::isPrime(mpz_class num) {
    // gmp-provided primality test (Rabbin–Miller/Fermat)
    return mpz_probab_prime_p(num.get_mpz_t(), 25) > 0;
}

template <>
mpz_class PrimeUtils<mpz_class>::generateRandomPrime(mpz_class min, mpz_class max) {
    gmp_randclass randGen(gmp_randinit_default);
    randGen.seed(static_cast<unsigned long>(std::random_device{}()));

    mpz_class candidate;
    do {
        candidate = randGen.get_z_range(max - min) + min;
    } while (!isPrime(candidate));
    return candidate;
}

template <>
mpz_class PrimeUtils<mpz_class>::gcd(mpz_class a, mpz_class b) {
    mpz_class result;
    mpz_gcd(result.get_mpz_t(), a.get_mpz_t(), b.get_mpz_t());
    return result;
}

template <>
mpz_class PrimeUtils<mpz_class>::modInverse(mpz_class e, mpz_class phi) {
    mpz_class result;
    if (mpz_invert(result.get_mpz_t(), e.get_mpz_t(), phi.get_mpz_t()) == 0) {
        throw std::runtime_error("No modular inverse exists");
    }
    return result;
}

#endif // PRIME_UTILS_TPP